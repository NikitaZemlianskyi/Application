import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Event, EventVisibility } from './event.entity';
import { User } from '../users/user.entity';
import { Tag } from '../tags/tag.entity';
import { CreateEventDto, UpdateEventDto } from './dto/event.schemas';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
  ) {}

  private async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    if (!tagNames || tagNames.length === 0) return [];

    const lowercaseNames = tagNames.map(name => name.toLowerCase());

    const existingTags = await this.tagRepository.find({
      where: { name: In(lowercaseNames) }
    });

    const existingNames = existingTags.map(tag => tag.name);
    const newNames = lowercaseNames.filter(name => !existingNames.includes(name));

    const newTags = await Promise.all(
      newNames.map(name => {
        const tag = this.tagRepository.create({ name });
        return this.tagRepository.save(tag);
      })
    );

    return [...existingTags, ...newTags];
  }

  async findAllPublic(tags?: string[]) {
    const query = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('event.tags', 'tags')
      .where('event.visibility = :visibility', { visibility: EventVisibility.PUBLIC });

    if (tags && tags.length > 0) {
      const lowercaseTags = tags.map(t => t.toLowerCase());
      query.andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('et.eventId')
          .from('event_tags', 'et')
          .innerJoin('tags', 't', 't.id = et.tagId')
          .where('t.name IN (:...tags)')
          .getQuery();
        return 'event.id IN ' + subQuery;
      }).setParameters({ tags: lowercaseTags });
    }

    return await query.getMany();
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'participants', 'tags'],
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(dto: CreateEventDto, userId: string) {
    const organizer = await this.userRepository.findOne({ where: { id: userId } });
    if (!organizer) throw new NotFoundException('User not found');
    
    const { tags: tagNames, ...eventData } = dto;
    const tags = await this.findOrCreateTags(tagNames || []);

    const event = this.eventRepository.create({
      ...eventData,
      organizer,
      capacity: eventData.capacity || null, 
      tags,
    });
    return await this.eventRepository.save(event); 
  }

  async update(id: string, dto: UpdateEventDto, userId: string) {
    const event = await this.findOne(id);
    if (event.organizer.id !== userId) {
      throw new ForbiddenException('Only the organizer can edit this event');
    }

    const { tags: tagNames, ...updateData } = dto;
    
    if (tagNames !== undefined) {
      event.tags = await this.findOrCreateTags(tagNames);
    }
    
    Object.assign(event, updateData);
    return await this.eventRepository.save(event); 
  }

  async remove(id: string, userId: string) {
    const event = await this.findOne(id);
    if (event.organizer.id !== userId) {
      throw new ForbiddenException('Only the organizer can delete this event');
    }
    await this.eventRepository.remove(event); 
    return { message: 'Event deleted successfully' };
  }

  async join(eventId: string, userId: string) {
    const event = await this.findOne(eventId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (event.organizer.id === userId) {
      throw new BadRequestException('Organizer cannot join their own event');
    }

    if (event.capacity && event.participants.length >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    const isAlreadyParticipant = event.participants.some(p => p.id === userId);
    if (isAlreadyParticipant) {
      throw new BadRequestException('You are already a participant');
    }

    await this.eventRepository.manager.query(
      `INSERT INTO "participants" ("eventId", "userId") VALUES ($1, $2)`,
      [eventId, userId],
    );

    return { message: 'Successfully joined the event' };
  }

  async leave(eventId: string, userId: string) {
    const event = await this.findOne(eventId);

    const isAlreadyParticipant = event.participants.some(p => p.id === userId);
    if (!isAlreadyParticipant) {
      throw new BadRequestException('You are not a participant');
    }

    await this.eventRepository.manager.query(
      `DELETE FROM "participants" WHERE "eventId" = $1 AND "userId" = $2`,
      [eventId, userId],
    );

    return { message: 'Successfully left the event' };
  }
}