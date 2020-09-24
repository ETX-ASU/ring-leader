import jwt from "jsonwebtoken";
import got from "got";

class RlPlatform {
  private Kid: string;
  private PlatformPublicKey: string;
  private ClientId: string;
  private AuthOIDCRedirectEndpoint: string;
  private AccesstokenEndpoint: any;
  private IdToken: string;
  private Iss: string;
  private Aud: string;
  private Alg: any;
  private Jti: string;
  private Iat: number;
  private Azp: string;
  private Sub: string;
  private Exp: number;
  constructor(
    platformPublicKey: string,
    authenticationEndpoint: string,
    accesstokenEndpoint: string,
    kid: string,
    alg: string,
    idToken: string
  ) {
    this.AccesstokenEndpoint = accesstokenEndpoint;
    this.AuthOIDCRedirectEndpoint = authenticationEndpoint;
    this.Kid = kid;
    this.PlatformPublicKey = platformPublicKey;
    this.IdToken = idToken;
    this.Alg = alg;
    const token = jwt.decode(idToken);
    this.setDefaultValues(token);
    return this;
  }
  setDefaultValues = (token: any): void => {
    if (!token) {
      (this.Jti =
        token.jti ||
        encodeURIComponent(
          [...Array(25)]
            .map((_) => ((Math.random() * 36) | 0).toString(36))
            .join("-")
        )),
        (this.Iss = token.iss);
      this.Aud = token.aud;
      this.Iat = token.iat;
      this.Sub = token.sub;
      this.Exp = token.exp;
      this.ClientId = token.client_id;
    }
  };

  platformAccessTokenEndpoint(): string {
    return this.AccesstokenEndpoint;
  }

  platformAuthOIDCRedirectEndpoint(): string {
    return this.AuthOIDCRedirectEndpoint;
  }

  platformPublicKey(): string {
    return this.PlatformPublicKey;
  }

  platformKeyId(): string {
    return this.Kid;
  }

  platformIdToken(): string {
    return this.IdToken;
  }

  platformIAlg(): any {
    return this.Alg;
  }

  platformIJti(): string {
    return this.Jti;
  }

  platformIss(): string {
    return this.Iss;
  }

  platformAud(): string {
    return this.Aud;
  }

  platformIat(): number {
    return this.Iat;
  }

  platformClientId(): string {
    return this.ClientId;
  }

  platformAzp(): string {
    return this.Azp;
  }

  platformSub(): string {
    return this.Sub;
  }

  platformExp(): number {
    return this.Exp;
  }

  getPlatform(): any {
    return this;
  }
}

export { RlPlatform };
