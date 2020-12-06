class AccessToken {
  scopes: string;
  token: string;
  expirationDate: number;

  isExpired(): boolean {
    return Date.now() / 1000 > this.expirationDate;
  };

  constructor(data: Partial<AccessToken> | undefined) {
    if (data) {
      Object.assign(this, data);
      if (!this.expirationDate)
        this.expirationDate = (Date.now() / 1000) + 3600;
    }
  }

}

export default AccessToken;