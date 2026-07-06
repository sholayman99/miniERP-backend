import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../modules/auth/jwt'
import { UnauthorizedError } from '../lib/errors'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: { userId: string; sessionId: string; type: 'user' | 'admin'; role?: string }
    }
  }
}

const ACCESS_COOKIE = 'tp_access'

export function requireAuth(userType: 'user' | 'admin' = 'user') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    const bearer = header?.startsWith('Bearer ') ? header.slice(7) : undefined
    const token = bearer ?? req.cookies?.[ACCESS_COOKIE]
    if (!token) return next(new UnauthorizedError('No access token'))

    try {
      const payload = verifyAccessToken(token)
      if (payload.type !== userType) {
        return next(new UnauthorizedError('Wrong token type'))
      }
      req.auth = {
        userId: payload.sub,
        sessionId: payload.sid,
        type: payload.type,
        role: payload.role,
      }
      next()
    } catch {
      next(new UnauthorizedError('Invalid or expired token'))
    }
  }
}
