export type PublicKeyType = {
  kty: string;
  use: string;
  alg: string;
  kid: string;
  n: string;
  e: string;
};

class PublicKeyService {
  private keys: PublicKeyType[] = [];

  setKeys(keys: PublicKeyType[]) {
    this.keys = keys;
  }

  getKey(kid: string) {
    return this.keys.find((key) => key.kid === kid);
  }
}

export const publicKeyService = new PublicKeyService();
