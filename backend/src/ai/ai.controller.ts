import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Request } from 'express';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('ask')
  async askQuestion(
    @Body('question') question: string,
    @Body('history') history: { role: string; content: string }[],
    @Req() req: Request & { user: { userId: string } }
  ) {
    if (!question) {
      return { answer: 'Sorry, I didn\'t understand that. Please try rephrasing your question.' };
    }
    const answer = await this.aiService.askQuestion(question, req.user.userId, history || []);
    return { answer };
  }
}
