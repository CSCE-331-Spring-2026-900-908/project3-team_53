'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Post } from '@/utils/apiService';
import { useTranslation } from '@/contexts/TranslationContext';
import { useWeather } from '@/hooks/useWeather';
import OnScreenKeyboard from '@/components/customer/OnScreenKeyboard';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

function deriveSeason(date: Date): string {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Fall';
  return 'Winter';
}

export default function ChatbotPopover({
  open,
  anchorEl,
  onClose,
}: ChatbotPopoverProps) {
  const { t } = useTranslation();
  const { weather } = useWeather();

  const greeting = useMemo<ChatMessage>(
    () => ({
      role: 'assistant',
      content: t(
        "Hi! I'm your drink buddy. I can suggest drinks based on the weather and what we have today. What are you in the mood for?",
      ),
    }),
    [t],
  );

  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([greeting]);
    }
  }, [open, greeting, messages.length]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: text },
    ];
    setMessages(newMessages);
    setInput('');
    setIsSending(true);
    setError(null);

    try {
      const now = new Date();
      const clientContext = {
        weather: weather
          ? {
              temperature: weather.temperature,
              unit: weather.unit,
              description: weather.description,
            }
          : undefined,
        localTime: now.toISOString(),
        season: deriveSeason(now),
      };

      const payload = {
        messages: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        clientContext,
      };

      const resp = (await Post('/chatbot/message', payload)) as {
        reply?: string;
      };

      if (resp?.reply) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: resp.reply as string },
        ]);
      } else {
        setError(t('Sorry, I did not get a reply. Please try again.'));
      }
    } catch {
      setError(
        t('The assistant is temporarily unavailable. Please try again shortly.'),
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            width: 380,
            maxWidth: '95vw',
            height: '70vh',
            maxHeight: 560,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'var(--color-cream)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.25,
          bgcolor: 'var(--color-kiosk-text)',
          color: 'var(--color-cream)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon sx={{ color: 'var(--color-accent-coral)' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
            {t('Ask about our menu')}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'var(--color-cream)' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.map((m, idx) => (
          <Box
            key={idx}
            sx={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              bgcolor:
                m.role === 'user'
                  ? 'var(--color-accent-coral)'
                  : 'var(--color-cream-light)',
              color:
                m.role === 'user'
                  ? 'var(--color-text-white)'
                  : 'var(--color-kiosk-text)',
              px: 1.5,
              py: 1,
              borderRadius: 2,
              whiteSpace: 'pre-wrap',
              fontSize: '0.9rem',
              lineHeight: 1.4,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            {m.content}
          </Box>
        ))}
        {isSending && (
          <Box
            sx={{
              alignSelf: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 1,
              color: 'var(--color-kiosk-muted)',
              fontSize: '0.85rem',
            }}
          >
            <CircularProgress size={14} sx={{ color: 'var(--color-accent-coral)' }} />
            {t('Thinking...')}
          </Box>
        )}
        {error && (
          <Typography
            sx={{
              alignSelf: 'flex-start',
              color: 'var(--color-accent-coral)',
              fontSize: '0.8rem',
            }}
          >
            {error}
          </Typography>
        )}
      </Box>

      {/* Input */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
          p: 1.5,
          borderTop: '1px solid var(--color-cream-hover)',
          bgcolor: 'var(--color-cream)',
        }}
      >
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={() => !isSending && setKeyboardOpen(true)}
          placeholder={t('Ask for a drink suggestion...')}
          size="small"
          fullWidth
          multiline
          maxRows={3}
          disabled={isSending}
          InputProps={{ readOnly: true }}
          sx={{
            bgcolor: 'var(--color-text-white)',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
        />
        <IconButton
          onClick={sendMessage}
          disabled={!input.trim() || isSending}
          sx={{
            bgcolor: 'var(--color-accent-coral)',
            color: 'var(--color-text-white)',
            '&:hover': { bgcolor: 'var(--color-accent-coral-hover)' },
            '&.Mui-disabled': {
              bgcolor: 'var(--color-cream-hover)',
              color: 'var(--color-kiosk-muted)',
            },
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>

      <OnScreenKeyboard
        open={keyboardOpen}
        value={input}
        onChange={setInput}
        onClose={() => setKeyboardOpen(false)}
        onSubmit={() => {
          if (input.trim() && !isSending) sendMessage();
        }}
        mode="text"
        accent="coral"
        label={t('Ask about our menu')}
        submitLabel={t('Send')}
        maxLength={240}
      />
    </Popover>
  );
}
