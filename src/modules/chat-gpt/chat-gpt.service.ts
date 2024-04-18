import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import OpenAI from 'openai';
import { GptRequestDto } from './dto/send-request.dto';

const openai = new OpenAI();

@Injectable()
export class ChatGptService {
  private readonly apiKey: string;

  private readonly apiUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
  }

  async generateResponse(requestData: GptRequestDto) {
    const prompt = `I am going to have a trip to ${requestData.cityName} between the dates ${requestData.checkIn} and ${requestData.checkOut}. Please, send your suggestions of what should I visit for each day. Send it in a JSON format for each day. Do not send any introductory sentences, just a JSON format right away. Example: day_1: "morning": Some actions, "afternoon": Some actions, "evening": Some actions, day_2: other actions, etc. Also do not use more than 150 tokens`;
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'gpt-4-turbo',
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  }
}
