import "server-only";

import { SarvamAIClient } from "sarvamai";

export class SarvamConfigurationError extends Error {
  constructor() {
    super("Sarvam voice services are not configured.");
    this.name = "SarvamConfigurationError";
  }
}

export function getSarvamClient() {
  const apiSubscriptionKey = process.env.SARVAM_API_KEY;

  if (!apiSubscriptionKey) {
    throw new SarvamConfigurationError();
  }

  return new SarvamAIClient({
    apiSubscriptionKey,
    timeoutInSeconds: 25,
    maxRetries: 1,
  });
}
