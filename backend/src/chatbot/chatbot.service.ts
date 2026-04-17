import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { MenuItem } from '../menu-items/menu-item.entity';
import {
  ChatMessage,
  ClientContext,
  SendMessageDto,
} from './send-message.dto';

const MAX_MESSAGES = 10;
const MAX_MESSAGE_CHARS = 1000;
const MAX_TOTAL_CHARS = 4000;
const MODEL_NAME = 'gemini-2.5-flash';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly client: GoogleGenAI | null;

  constructor(
    private readonly config: ConfigService,
    private readonly menuItemsService: MenuItemsService,
  ) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.client = new GoogleGenAI({ apiKey });
    } else {
      this.client = null;
      this.logger.warn(
        'GEMINI_API_KEY is not set. Chatbot requests will fail until it is configured.',
      );
    }
  }

  async sendMessage(dto: SendMessageDto): Promise<{ reply: string }> {
    if (!this.client) {
      throw new ServiceUnavailableException(
        'Chatbot is not configured. Missing GEMINI_API_KEY.',
      );
    }

    const messages = this.validateMessages(dto.messages);
    const menuItems = await this.menuItemsService.findAll();
    const systemInstruction = this.buildSystemInstruction(
      menuItems,
      dto.clientContext,
    );

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    try {
      const response = await this.client.models.generateContent({
        model: MODEL_NAME,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 400,
        },
      });

      const reply = (response.text ?? '').trim();
      if (!reply) {
        return {
          reply:
            "Sorry, I couldn't come up with a suggestion right now. Could you try rephrasing?",
        };
      }
      return { reply };
    } catch (err) {
      this.logger.error('Gemini request failed', err as Error);
      throw new ServiceUnavailableException(
        'The assistant is temporarily unavailable. Please try again shortly.',
      );
    }
  }

  private validateMessages(messages: ChatMessage[] | undefined): ChatMessage[] {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new BadRequestException('At least one message is required.');
    }

    const trimmed = messages.slice(-MAX_MESSAGES).map((m) => {
      if (!m || typeof m.content !== 'string') {
        throw new BadRequestException('Each message must have text content.');
      }
      const role: 'user' | 'assistant' =
        m.role === 'assistant' ? 'assistant' : 'user';
      const content = m.content.trim().slice(0, MAX_MESSAGE_CHARS);
      if (!content) {
        throw new BadRequestException('Messages cannot be empty.');
      }
      return { role, content };
    });

    const total = trimmed.reduce((sum, m) => sum + m.content.length, 0);
    if (total > MAX_TOTAL_CHARS) {
      throw new BadRequestException('Conversation is too long.');
    }

    if (trimmed[trimmed.length - 1].role !== 'user') {
      throw new BadRequestException('The latest message must be from the user.');
    }

    return trimmed;
  }

  private buildSystemInstruction(
    menuItems: MenuItem[],
    context: ClientContext | undefined,
  ): string {
    const lines: string[] = [];

    lines.push(
      'You are a friendly assistant for a boba tea kiosk. Your job is to help customers decide what to order from the menu provided below.',
    );
    lines.push(
      'Keep replies concise: at most 4 short sentences. Use a warm, welcoming tone.',
    );
    lines.push(
      'Only recommend drinks or items that appear in the provided menu. Never invent items.',
    );
    lines.push(
      'When you recommend an item, mention its name exactly as it appears in the menu so the customer can find it on the screen.',
    );
    lines.push(
      'You cannot add anything to the cart yourself. After suggesting, invite the customer to tap the item on the menu to add it.',
    );
    lines.push(
      'If asked about allergies, ingredients you do not know, medical advice, or anything unrelated to ordering, politely say you can only help with menu suggestions and invite them to ask a staff member.',
    );
    lines.push('');

    const weather = context?.weather;
    const tempF =
      typeof weather?.temperature === 'number' ? weather.temperature : null;
    const localTime = context?.localTime ?? new Date().toISOString();
    const season = context?.season ?? deriveSeason(new Date(localTime));

    lines.push('# Current context');
    lines.push(`- Local time: ${localTime}`);
    lines.push(`- Season: ${season}`);
    if (tempF !== null) {
      const feel =
        tempF >= 80 ? 'hot' : tempF <= 55 ? 'cold' : 'mild';
      const desc = weather?.description ? ` (${weather.description})` : '';
      lines.push(
        `- Weather in College Station, TX: ${tempF}°F${desc} — it is ${feel} outside.`,
      );
      if (feel === 'hot') {
        lines.push(
          '- Lean toward iced, refreshing, fruit-based, or slushy drinks.',
        );
      } else if (feel === 'cold') {
        lines.push(
          '- Lean toward hot drinks or warmer, comforting milk tea flavors.',
        );
      }
    } else {
      lines.push('- Weather: unavailable');
    }
    lines.push('');

    lines.push('# Menu (only recommend from this list)');
    const byCategory = new Map<string, MenuItem[]>();
    for (const item of menuItems) {
      if (!item.available) continue;
      const list = byCategory.get(item.category) ?? [];
      list.push(item);
      byCategory.set(item.category, list);
    }

    if (byCategory.size === 0) {
      lines.push('- (no items available right now)');
    } else {
      for (const [category, items] of byCategory) {
        lines.push(`## ${category}`);
        for (const item of items) {
          const price = Number(item.price);
          const priceLabel = Number.isFinite(price) ? `$${price.toFixed(2)}` : '';
          lines.push(`- ${item.name}${priceLabel ? ` — ${priceLabel}` : ''}`);
        }
      }
    }

    return lines.join('\n');
  }
}

function deriveSeason(date: Date): string {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Fall';
  return 'Winter';
}
