// Consent is driven by this service list. While it is empty, no banner is shown.
export type ConsentService = { id: string; name: string; purpose: string; provider: string };

export const consentServices: ConsentService[] = [];
