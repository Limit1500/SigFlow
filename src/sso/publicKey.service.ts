export type PublicKeyType = {
  kid: string;
  publicKey: string;
  kty: string;
  alg: string;
  use: string;
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
