import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET or SESSION_SECRET is required");
  }
  return secret;
}

const TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || "30d";

export function signAuthToken(userId: string) {
  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: TOKEN_EXPIRY as jwt.SignOptions["expiresIn"] });
}

export function verifyAuthToken(token: string): { sub: string } {
  const decoded = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;
  if (!decoded.sub || typeof decoded.sub !== "string") {
    throw new Error("Invalid token payload");
  }
  return { sub: decoded.sub };
}
