export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ClientWeather {
  temperature?: number;
  unit?: string;
  description?: string;
}

export interface ClientContext {
  weather?: ClientWeather;
  localTime?: string;
  season?: string;
}

export class SendMessageDto {
  messages: ChatMessage[];
  clientContext?: ClientContext;
}
