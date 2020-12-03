class AccessToken {
  scopes: string;
  token: string;
  expirationDate: number;

  isExpired(): boolean {
    return Date.now() / 1000 > this.expirationDate;
  };

  constructor(scopes: string, token: string) {
    this.scopes = scopes;
    this.token = token;
    this.expirationDate = (Date.now() / 1000) + 3600;
  }
}

export default AccessToken;