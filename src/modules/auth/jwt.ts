import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { env } from '../../config/env';

export type AccessTokenPayload = {
  sub: string; // userId
  sid: string; // session id (random per login, bound into the token)
  type: 'user' | 'admin';
  role: string; // Role ObjectId as a string
};

export function signAccessToken(params: { userId: string; roleId: string }): {
  token: string;
  sid: string;
} {
  const sid = randomUUID();
  const payload: AccessTokenPayload = {
    sub: params.userId,
    sid,
    type: 'user',
    role: params.roleId,
  };

  const token = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    algorithm: 'HS256',
    expiresIn: `${env.JWT_ACCESS_TTL_MIN}m`,
  });

  return { token, sid };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ['HS256'] }) as AccessTokenPayload;
}
