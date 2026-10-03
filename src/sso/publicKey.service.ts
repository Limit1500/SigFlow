import type { PublicKeyType } from "../types/publicKey.type.js";

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
