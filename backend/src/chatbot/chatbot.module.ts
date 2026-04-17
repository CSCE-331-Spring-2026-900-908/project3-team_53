import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MenuItemsModule } from '../menu-items/menu-items.module';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
  imports: [ConfigModule, MenuItemsModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
