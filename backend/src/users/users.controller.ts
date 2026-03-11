import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../events/event.entity';
import { CurrentUser } from '../auth/user.decorator';

@Controller('users')
export class UsersController {
  constructor(@InjectRepository(Event) private eventRepository: Repository<Event>) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/events')
  async getMyEvents(@CurrentUser() user: any) {
    const userId = user.userId;
    return await this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participant')
      .where('organizer.id = :userId', { userId })
      .orWhere('participant.id = :userId', { userId })
      .getMany();
  }
}