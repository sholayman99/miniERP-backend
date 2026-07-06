import type { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      id?: string
    }
  }
}

const HEADER = 'x-request-id'

export function requestId(req: Request, res: Response, next: NextFunction) {
  const incoming = req.headers[HEADER]
  const id = typeof incoming === 'string' && incoming.length <= 128 ? incoming : crypto.randomUUID()
  req.id = id
  res.setHeader(HEADER, id)
  next()
}
