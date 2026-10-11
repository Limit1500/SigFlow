import { publicKeyService } from "../../sso/publicKey.service.js";
import { jwtVerify, importJWK, decodeProtectedHeader, importSPKI } from "jose";

type TokenBody = {
  userId: number;
};

async function authClient(token: string): Promise<number> {
  const tokenParts = token.split(".");

  if (tokenParts.length !== 3) {
    throw new Error("Invalid JWT");
  }

  const header = decodeProtectedHeader(token);

  console.log("Token kid:", header.kid);

  if (typeof header.kid !== "string" || !header.kid) {
    throw new Error("Invalid JWT key ID");
  }

  if (header.alg !== "RS256") {
    throw new Error("Unsupported algorithm");
  }

  const publicKey = publicKeyService.getKey(header.kid as string);

  console.log("Public key found:", Boolean(publicKey));
  console.log("Public key:", publicKey);

  if (!publicKey) {
    throw new Error("Public key not found");
  }

  if (header.alg !== "RS256") {
    throw new Error("Unsupported algorithm");
  }

  const cryptoKey = await importSPKI(publicKey.publicKey, "RS256");

  const { payload } = await jwtVerify(token, cryptoKey, {
    algorithms: ["RS256"],
  });

  const userId = Number(payload.sub);

  if (
    typeof payload.sub !== "string" ||
    !Number.isSafeInteger(userId) ||
    userId <= 0
  ) {
    throw new Error("Invalid user ID");
  }

  return userId;
}

export default authClient;
