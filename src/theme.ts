import { createSystem, defaultConfig } from '@chakra-ui/react';

export const systemTheme = createSystem(defaultConfig, {
   globalCss: {
    'html, body': {
      color: '#E0E0E0',
    },
  }, 
});
