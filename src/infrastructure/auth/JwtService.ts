import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

export class JwtService {
  private readonly secret = process.env.JWT_SECRET || "supersecret";

  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: "7d",
    });
  }

  verify(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }
}