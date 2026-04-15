'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import LanguageIcon from '@mui/icons-material/Language';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from '@/contexts/TranslationContext';

export default function LanguageSelector() {
  const {
    language,
    languageName,
    setLanguage,
    isTranslating,
    availableLanguages,
    loadLanguages,
  } = useTranslation();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleOpen = async () => {
    setOpen(true);
    setSearch('');
    await loadLanguages();
  };

  const handleSelect = (code: string) => {
    setOpen(false);
    setLanguage(code);
  };

  const filtered = availableLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()),
  );

  const isEnglish = language === 'en';

  return (
    <>
      {/* Vertical tab on the right edge, vertically centered */}
      <Box
        sx={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1199,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 1,
        }}
      >
        {!isEnglish && (
          <Button
            variant="contained"
            onClick={() => setLanguage('en')}
            sx={{
              bgcolor: 'var(--color-accent-coral)',
              color: 'var(--color-text-white)',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.75rem',
              px: 1.5,
              py: 0.75,
              borderRadius: '8px 0 0 8px',
              boxShadow: '-2px 2px 8px rgba(0,0,0,0.15)',
              minWidth: 0,
              '&:hover': { bgcolor: 'var(--color-accent-coral-hover)' },
            }}
          >
            English
          </Button>
        )}

        <Button
          variant="contained"
          onClick={handleOpen}
          disabled={isTranslating}
          sx={{
            bgcolor: isEnglish ? 'var(--color-kiosk-text)' : 'var(--color-accent-teal)',
            color: 'var(--color-text-white)',
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '0.75rem',
            px: 1.5,
            py: 1.5,
            borderRadius: '8px 0 0 8px',
            boxShadow: '-2px 2px 8px rgba(0,0,0,0.15)',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            '&:hover': {
              bgcolor: isEnglish ? 'var(--color-accent-teal-dark)' : 'var(--color-accent-teal-hover)',
            },
            '&.Mui-disabled': {
              bgcolor: 'var(--color-kiosk-muted)',
              color: 'var(--color-text-white)',
            },
          }}
        >
          {isTranslating ? (
            <CircularProgress size={18} sx={{ color: 'var(--color-text-white)' }} />
          ) : (
            <LanguageIcon sx={{ fontSize: 20 }} />
          )}
          <span>{isTranslating ? '...' : isEnglish ? 'Translate' : languageName}</span>
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { bgcolor: 'var(--color-cream-light)', borderRadius: 4, maxHeight: '80vh' },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--color-kiosk-text)' }}>
            Select Language
          </Typography>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: 'var(--color-cream-hover)', p: 0 }}>
          <Box sx={{ px: 3, pt: 2, pb: 1 }}>
            <TextField
              placeholder="Search languages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'var(--color-cream)',
                  borderRadius: 2,
                  '& fieldset': { borderColor: 'var(--color-cream-border)' },
                  '&:hover fieldset': { borderColor: 'var(--color-accent-teal)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--color-accent-teal)' },
                },
              }}
            />
          </Box>

          {availableLanguages.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} sx={{ color: 'var(--color-accent-teal)' }} />
            </Box>
          ) : (
            <Box sx={{ maxHeight: 400, overflowY: 'auto', px: 1, py: 1 }}>
              {filtered.map((lang) => (
                <Button
                  key={lang.code}
                  fullWidth
                  onClick={() => handleSelect(lang.code)}
                  sx={{
                    justifyContent: 'flex-start',
                    px: 3,
                    py: 1.5,
                    color: language === lang.code ? 'var(--color-text-white)' : 'var(--color-kiosk-text)',
                    bgcolor: language === lang.code ? 'var(--color-accent-teal)' : 'transparent',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: language === lang.code ? 700 : 400,
                    '&:hover': {
                      bgcolor: language === lang.code ? 'var(--color-accent-teal-hover)' : 'rgba(78,205,196,0.1)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{lang.name}</span>
                    <Typography
                      component="span"
                      sx={{
                        color: language === lang.code ? 'rgba(255,255,255,0.7)' : 'var(--color-kiosk-muted)',
                        fontSize: '0.85rem',
                      }}
                    >
                      {lang.code}
                    </Typography>
                  </Box>
                </Button>
              ))}
              {filtered.length === 0 && (
                <Typography sx={{ color: 'var(--color-kiosk-muted)', textAlign: 'center', py: 3 }}>
                  No languages found
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
