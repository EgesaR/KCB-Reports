interface OAuthTokens {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
  token_type?: string | null;
  id_token?: string | null;
  scope?: string;
}

interface GmailAuthStorage {
  getTokens(): Promise<OAuthTokens | null>;
  storeTokens(tokens: OAuthTokens): Promise<void>;
  clearTokens(): Promise<void>;
}
