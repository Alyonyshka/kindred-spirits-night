import * as Sentry from "@sentry/react";

// Sentry DSN — публичный ключ, безопасно хранить во frontend-коде.
// Получить: https://sentry.io → Settings → Projects → Client Keys (DSN)
const SENTRY_DSN = "";

export function initSentry() {
  if (!SENTRY_DSN) {
    console.info("[Sentry] DSN не задан — отслеживание ошибок отключено.");
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% транзакций
    // Session Replay
    replaysSessionSampleRate: 0.0, // не пишем обычные сессии
    replaysOnErrorSampleRate: 1.0, // 100% сессий с ошибками
  });
}

export { Sentry };
