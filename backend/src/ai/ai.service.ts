import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Event, EventVisibility } from '../events/event.entity';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      console.warn('GROQ_API_KEY is not set. AI Assistant will not be able to connect to Groq.');
    }
    this.groq = new Groq({ apiKey });
  }

  async askQuestion(question: string, userId: string): Promise<string> {
    try {
      // 1. Collect Context (RAG)
      // Fetch upcoming user events (user is a participant)
      const now = new Date();
      
      const allEvents = await this.eventRepository.find({
        relations: ['organizer', 'participants', 'tags'],
      });

      // Filter events in JS for simplicity, though DB query is better for production.
      const userUpcomingEvents = allEvents.filter(
        e => e.participants.some(p => p.id === userId) && e.dateTime > now
      );
      
      const userCreatedEvents = allEvents.filter(
        e => e.organizer && e.organizer.id === userId
      );

      const publicUpcomingEvents = allEvents.filter(
        e => e.visibility === EventVisibility.PUBLIC && e.dateTime > now
      );

      // Create a compact snapshot to avoid token limits
      const snapshot = {
        myUpcomingEvents: userUpcomingEvents.map(this.mapCompactEvent),
        myOrganizedEvents: userCreatedEvents.map(this.mapCompactEvent),
        publicEvents: publicUpcomingEvents.map(this.mapCompactEvent),
      };

      // 2. Generate System Prompt
      const systemPrompt = `You are an AI assistant helping a user with their events platform. 
Here is the event data context (JSON):
${JSON.stringify(snapshot)}

Answer the user's question briefly and concisely based ONLY on the provided events data.
If the question isn't about events or you cannot answer it using the data, answer simply with the exact phrase: "Sorry, I didn't understand that. Please try rephrasing your question."`;

      // 3. Send request to Groq
      const completion = await this.groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
        model: 'llama3-8b-8192',
        temperature: 0,
      });

      return completion.choices[0]?.message?.content || 'No response';
    } catch (error) {
      console.error('Error in AiService.askQuestion:', error);
      throw new InternalServerErrorException('Failed to get answer from AI');
    }
  }

  private mapCompactEvent(event: Event) {
    return {
      id: event.id,
      title: event.title,
      dateTime: event.dateTime,
      location: event.location,
      capacity: event.capacity,
      organizerId: event.organizer?.id,
      tags: event.tags?.map(t => t.name) || [],
      participantCount: event.participants?.length || 0,
      participantsIds: event.participants?.map(p => p.id) || [],
    };
  }
}
