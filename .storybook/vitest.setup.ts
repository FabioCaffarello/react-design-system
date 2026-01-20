import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from './preview';

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

// Suppress unhandled browser connection errors that are non-critical
if (typeof process !== 'undefined') {
  process.on('unhandledRejection', (reason) => {
    if (
      typeof reason === 'object' &&
      reason !== null &&
      'message' in reason &&
      typeof reason.message === 'string' &&
      (reason.message.includes('Browser connection was closed') ||
       reason.message.includes('rpc is closed'))
    ) {
      // Silently ignore browser connection errors - they're non-critical
      return;
    }
    // Re-throw other unhandled rejections
    throw reason;
  });
}