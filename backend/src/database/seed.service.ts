import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Event, EventVisibility } from '../events/event.entity';
import { Tag } from '../tags/tag.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async onApplicationBootstrap() {
    const usersCount = await this.userRepository.count();
    if (usersCount > 0) {
      return; 
    }

    console.log('🌱 Seeding database...');

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash('password123', salt);

    // --- Users ---
    const user1 = this.userRepository.create({
      name: 'Eduard Organizer',
      email: 'eduard@test.com',
      passwordHash,
    });
    const user2 = this.userRepository.create({
      name: 'Alice Participant',
      email: 'alice@test.com',
      passwordHash,
    });
    const user3 = this.userRepository.create({
      name: 'Bob Developer',
      email: 'bob@test.com',
      passwordHash,
    });
    const user4 = this.userRepository.create({
      name: 'Carol Designer',
      email: 'carol@test.com',
      passwordHash,
    });

    await this.userRepository.save([user1, user2, user3, user4]);

    // --- Tags ---
    const tagTech = this.tagRepository.create({ name: 'tech' });
    const tagBusiness = this.tagRepository.create({ name: 'business' });
    const tagArt = this.tagRepository.create({ name: 'art' });
    const tagMusic = this.tagRepository.create({ name: 'music' });
    const tagEducation = this.tagRepository.create({ name: 'education' });

    await this.tagRepository.save([tagTech, tagBusiness, tagArt, tagMusic, tagEducation]);

    // --- Events ---
    const today = new Date();

    const event1 = this.eventRepository.create({
      title: 'Tech Conference 2026',
      description: 'Annual technology conference featuring the latest innovations in AI.',
      dateTime: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      location: 'Convention Center, San Francisco',
      capacity: 500,
      visibility: EventVisibility.PUBLIC,
      organizer: user1,
      tags: [tagTech, tagBusiness],
    });

    const event2 = this.eventRepository.create({
      title: 'Community Networking Meetup',
      description: 'Connect with local professionals and expand your network.',
      dateTime: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      location: 'Downtown Coffee Shop',
      capacity: 30,
      visibility: EventVisibility.PUBLIC,
      organizer: user1,
      tags: [tagBusiness],
    });

    const event3 = this.eventRepository.create({
      title: 'Design Workshop',
      description: 'Hands-on workshop covering modern UI/UX design principles.',
      dateTime: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
      location: 'Creative Space Studio',
      capacity: 20,
      visibility: EventVisibility.PUBLIC,
      organizer: user2,
      tags: [tagArt, tagEducation],
    });

    const event4 = this.eventRepository.create({
      title: 'Live Jazz Evening',
      description: 'An evening of live jazz performances from local artists.',
      dateTime: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      location: 'Blue Note Lounge',
      capacity: 50,
      visibility: EventVisibility.PUBLIC,
      organizer: user2,
      tags: [tagMusic, tagArt],
    });

    const event5 = this.eventRepository.create({
      title: 'Startup Pitch Night',
      description: 'Watch promising startups pitch their ideas to investors.',
      dateTime: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000),
      location: 'Innovation Hub',
      capacity: 100,
      visibility: EventVisibility.PUBLIC,
      organizer: user3,
      tags: [tagTech, tagBusiness, tagEducation],
    });

    await this.eventRepository.save([event1, event2, event3, event4, event5]);

    // --- Participants (subscriptions) ---
    // Alice joins Tech Conference, Jazz Evening, and Startup Pitch Night
    await this.eventRepository.manager.query(
      `INSERT INTO "participants" ("eventId", "userId") VALUES ($1, $2)`,
      [event1.id, user2.id],
    );
    await this.eventRepository.manager.query(
      `INSERT INTO "participants" ("eventId", "userId") VALUES ($1, $2)`,
      [event4.id, user2.id],
    );
    await this.eventRepository.manager.query(
      `INSERT INTO "participants" ("eventId", "userId") VALUES ($1, $2)`,
      [event5.id, user2.id],
    );

    // Bob joins Tech Conference, Community Networking, and Design Workshop
    await this.eventRepository.manager.query(
      `INSERT INTO "participants" ("eventId", "userId") VALUES ($1, $2)`,
      [event1.id, user3.id],
    );
    await this.eventRepository.manager.query(
      `INSERT INTO "participants" ("eventId", "userId") VALUES ($1, $2)`,
      [event2.id, user3.id],
    );
    await this.eventRepository.manager.query(
      `INSERT INTO "participants" ("eventId", "userId") VALUES ($1, $2)`,
      [event3.id, user3.id],
    );

    // Carol joins Community Networking, Jazz Evening, and Startup Pitch Night
    await this.eventRepository.manager.query(
      `INSERT INTO "participants" ("eventId", "userId") VALUES ($1, $2)`,
      [event2.id, user4.id],
    );
    await this.eventRepository.manager.query(
      `INSERT INTO "participants" ("eventId", "userId") VALUES ($1, $2)`,
      [event4.id, user4.id],
    );
    await this.eventRepository.manager.query(
      `INSERT INTO "participants" ("eventId", "userId") VALUES ($1, $2)`,
      [event5.id, user4.id],
    );

    console.log('✅ Database seeded successfully with 4 users, 5 tags, 5 events, and participant subscriptions!');
  }
}