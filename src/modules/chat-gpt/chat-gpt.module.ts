import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatGptService } from './chat-gpt.service';
import { ChatGptController } from './chat-gpt.controller';

@Module({
  imports: [HttpModule],
  providers: [ChatGptService],
  controllers: [ChatGptController],
  exports: [ChatGptService],
})
export class ChatGPTModule {}
