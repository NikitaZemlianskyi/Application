import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventVisibility } from './event.entity';
import { User } from '../users/user.entity';
import { CreateEventDto, UpdateEventDto } from './dto/event.schemas';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAllPublic() {
    return await this.eventRepository.find({
      where: { visibility: EventVisibility.PUBLIC },
      relations: ['organizer', 'participants'],
    });
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'participants'],
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(dto: CreateEventDto, userId: string) {
    const organizer = await this.userRepository.findOne({ where: { id: userId } });
    if (!organizer) throw new NotFoundException('User not found');
    const event = this.eventRepository.create({
      ...dto,
      organizer,
      capacity: dto.capacity || null, 
    });
    return await this.eventRepository.save(event); 
  }

  async update(id: string, dto: UpdateEventDto, userId: string) {
    const event = await this.findOne(id);
    if (event.organizer.id !== userId) {
      throw new ForbiddenException('Only the organizer can edit this event');
    }
    Object.assign(event, dto);
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

    if (event.capacity && event.participants.length >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    const isAlreadyParticipant = event.participants.some(p => p.id === userId);
    if (isAlreadyParticipant) {
      throw new BadRequestException('You are already a participant');
    }

    event.participants.push(user);
    await this.eventRepository.save(event);
    return { message: 'Successfully joined the event' };
  }

  async leave(eventId: string, userId: string) {
    const event = await this.findOne(eventId);
    
    event.participants = event.participants.filter(p => p.id !== userId);
    await this.eventRepository.save(event);
    return { message: 'Successfully left the event' };
  }
}