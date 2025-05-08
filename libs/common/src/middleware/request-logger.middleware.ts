import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || 'unknown';

    // Avoid logging sensitive data
    const safeBody = { ...req.body };
    this.sanitizeSensitiveFields(safeBody);

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${contentLength || 0}b - IP: ${ip} - Agent: ${userAgent} - Body: ${JSON.stringify(
          safeBody,
        )}`,
      );
    });

    next();
  }

  private sanitizeSensitiveFields(obj: Record<string, any>): void {
    const SENSITIVE_KEYS = ['password', 'token', 'authorization'];

    for (const key of Object.keys(obj)) {
      if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.sanitizeSensitiveFields(obj[key]);
      }
    }
  }
}
