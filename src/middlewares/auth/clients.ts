import { publicKeyService } from "../../sso/publicKey.service.js";
import { jwtVerify, importJWK, decodeProtectedHeader } from "jose";

type TokenBody = {
  userId: number;
};

async function authClient(token: string): Promise<number> {
  const tokenParts = token.split(".");

  if (tokenParts.length !== 3) {
    throw new Error("Invalid JWT");
  }

  const header = decodeProtectedHeader(token);

  if (typeof header.kid !== "string" || !header.kid) {
    throw new Error("Invalid JWT key ID");
  }

  if (header.alg !== "RS256") {
    throw new Error("Unsupported algorithm");
  }

  const publicKey = publicKeyService.getKey(header.kid);

  if (!publicKey) {
    throw new Error("Public key not found");
  }

  if (header.alg !== "RS256") {
    throw new Error("Unsupported algorithm");
  }

  const cryptoKey = await importJWK(publicKey, "RS256");

  const { payload } = await jwtVerify(token, cryptoKey, {
    algorithms: ["RS256"],
  });

  if (
    typeof payload.userId !== "number" ||
    !Number.isSafeInteger(payload.userId) ||
    payload.userId <= 0
  ) {
    throw new Error("Invalid user ID");
  }

  return payload.id as number;
}

export default authClient;
