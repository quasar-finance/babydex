import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    console.error('Error:', err);
    
    if (err instanceof HTTPException) {
      return c.json(
        { 
          error: err.message,
          status: err.status 
        },
        err.status
      );
    }

    if (err instanceof Error) {
      return c.json(
        { 
          error: err.message || 'Internal server error',
          status: 500 
        },
        500
      );
    }

    return c.json(
      { 
        error: 'Unknown error occurred',
        status: 500 
      },
      500
    );
  }
}