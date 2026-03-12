import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Event, EventVisibility } from '../events/event.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
  ) {}

  async onApplicationBootstrap() {
    const usersCount = await this.userRepository.count();
    if (usersCount > 0) {
      return; 
    }

    console.log('🌱 Seeding database...');

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash('password123', salt);

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

    await this.userRepository.save([user1, user2]);

    const today = new Date();
    
    const event1 = this.eventRepository.create({
      title: 'Tech Conference 2026',
      description: 'Annual technology conference featuring the latest innovations in AI.',
      dateTime: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      location: 'Convention Center, San Francisco',
      capacity: 500,
      visibility: EventVisibility.PUBLIC,
      organizer: user1,
    });

    const event2 = this.eventRepository.create({
      title: 'Community Networking Meetup',
      description: 'Connect with local professionals and expand your network.',
      dateTime: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      location: 'Downtown Coffee Shop',
      capacity: 30,
      visibility: EventVisibility.PUBLIC,
      organizer: user1,
    });

    const event3 = this.eventRepository.create({
      title: 'Design Workshop',
      description: 'Hands-on workshop covering modern UI/UX design principles.',
      dateTime: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
      location: 'Creative Space Studio',
      capacity: 20,
      visibility: EventVisibility.PUBLIC,
      organizer: user2,
    });

    await this.eventRepository.save([event1, event2, event3]);
    console.log('✅ Database seeded successfully with 2 users and 3 events!');
  }
}