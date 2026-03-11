import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UsePipes } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { YupValidationPipe } from '../common/pipes/yup-validation.pipe';
import * as eventSchemas from './dto/event.schemas';
import { CurrentUser } from '../auth/user.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll() {
    return await this.eventsService.findAllPublic();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new YupValidationPipe(eventSchemas.createEventSchema))
  async create(@Body() dto: eventSchemas.CreateEventDto, @CurrentUser() user: any) {
    return await this.eventsService.create(dto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new YupValidationPipe(eventSchemas.updateEventSchema))
  async update(@Param('id') id: string, @Body() dto: eventSchemas.UpdateEventDto, @CurrentUser() user: any) {
    return await this.eventsService.update(id, dto, user.userId); 
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.eventsService.remove(id, user.userId); 
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async join(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.eventsService.join(id, user.userId); 
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leave(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.eventsService.leave(id, user.userId); 
  }
}