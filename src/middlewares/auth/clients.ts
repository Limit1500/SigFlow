import { publicKeyService } from "../../sso/publicKey.service.js";
import { jwtVerify, importJWK } from "jose";

type tokenBody = {
  userId: number;
};

async function authClient(token: string): Promise<tokenBody> {
  const tokenParts = token.split(".");

  if (tokenParts.length !== 3) {
    throw new Error("Invalid JWT");
  }

  const header = JSON.parse(
    Buffer.from(tokenParts[0]!, "base64url").toString("utf8")
  );

  const publicKey = publicKeyService.getKey(header.kid);

  if (!publicKey) {
    throw new Error("Public key not found");
  }

  if (header.alg !== "RS256") {
    throw new Error("Unsupported algorithm");
  }

  const cryptoKey = await importJWK(publicKey, "RS256");

  const { payload } = await jwtVerify(token, cryptoKey);
  return payload as tokenBody;
}

export default authClient;
