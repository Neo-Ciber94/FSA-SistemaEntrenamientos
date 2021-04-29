import log4js from 'log4js';

// GLOBAL LOGGER
log4js.configure({
  appenders: {
    SERVER: { type: 'console', layout: { type: 'coloured', color: 'Cyan' } },
  },
  categories: { default: { appenders: ['SERVER'], level: 'info' } },
});

export const LOGGER = log4js.getLogger('SERVER');
