/* eslint-disable object-curly-newline */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatGptService } from './chat-gpt.service';
import { GptRequestDto } from './dto/send-request.dto';

@ApiTags('AI Integration')
@Controller('chat-gpt')
export class ChatGptController {
  constructor(private readonly chatGptService: ChatGptService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  generateResponse(@Body() requestData: GptRequestDto) {
    return this.chatGptService.generateResponse(requestData);
  }
}
