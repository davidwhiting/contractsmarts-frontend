// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
import { expressjwt as auth0Jwt } from 'express-jwt';
import { rateLimit } from 'express-rate-limit';

// 2. Authentication/Authorization Middleware
export const auth0Middleware = auth0Jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://contractsmarts.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://api.contractsmarts.ai',
  issuer: 'https://contractsmarts.auth0.com/',
  algorithms: ['RS256']
});

// Permission checking middleware
export const checkPermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissions = req.auth?.permissions || [];
    if (permissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }
  };
};

// 3. Request Validation Middleware
import { z } from 'zod';

const MetadataSchema = z.object({
  excelUuid: z.string().uuid(),
  userUuid: z.string().uuid(),
  metadata: z.record(z.unknown()),
  version: z.string()
});

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error
        }
      });
    }
  };
};

// 4. Error Handling Middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    requestId: req.id,
    path: req.path,
    method: req.method,
    user: req.auth?.sub
  });

  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token'
      }
    });
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};

// 5. Logging Middleware
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'api-gateway' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      requestId: req.id,
      user: req.auth?.sub
    });
  });

  next();
};

// 6. Rate Limiting Middleware
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  }
});

// Example Route Implementation
import express from 'express';
const router = express.Router();

router.post(
  '/v1/metadata',
  auth0Middleware, // Authentication
  checkPermission('create:metadata'), // Authorization
  validateRequest(MetadataSchema), // Request validation
  rateLimiter, // Rate limiting
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Your route logic here
      const result = await createMetadata(req.body);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

// Application Setup
import express from 'express';
const app = express();

app.use(express.json());
app.use(loggingMiddleware);

// Apply rate limiting to all routes
app.use(rateLimiter);

// Apply Auth0 middleware to all routes
app.use(auth0Middleware);

// Add routes
app.use('/api', router);

// Error handling should be last
app.use(errorHandler);

export default app;