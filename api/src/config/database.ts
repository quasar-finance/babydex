import { DatabaseService } from '../services/database.js';

/**
 * Database configuration and initialization
 */
export interface DatabaseConfig {
  enabled: boolean;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  ssl?: boolean;
}

/**
 * Check if database is configured
 */
export function isDatabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_HOST &&
    process.env.SUPABASE_USER &&
    process.env.SUPABASE_PW &&
    process.env.SUPABASE_DB
  );
}

/**
 * Get database configuration from environment
 */
export function getDatabaseConfig(): DatabaseConfig {
  const isConfigured = isDatabaseConfigured();

  if (!isConfigured) {
    return { enabled: false };
  }

  return {
    enabled: true,
    host: process.env.SUPABASE_HOST!,
    port: Number(process.env.SUPABASE_PORT) || 5432,
    user: process.env.SUPABASE_USER!,
    password: process.env.SUPABASE_PW!,
    database: process.env.SUPABASE_DB!,
    ssl: process.env.SUPABASE_SSL === 'true',
  };
}

/**
 * Create database service if configured
 */
export async function createDatabaseService(): Promise<DatabaseService | null> {
  const config = getDatabaseConfig();
  
  if (!config.enabled) {
    // Database not configured - using contract-only mode
    return null;
  }

  try {
    const dbService = new DatabaseService({
      host: config.host!,
      port: config.port!,
      user: config.user!,
      password: config.password!,
      database: config.database!,
      ssl: config.ssl,
    });

    // Test connection
    const isConnected = await dbService.testConnection();
    
    if (!isConnected) {
      console.error('Database connection failed - falling back to contract-only mode');
      await dbService.disconnect();
      return null;
    }

    // Database connected successfully
    return dbService;
    
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return null;
  }
}

/**
 * Get operation mode based on configuration
 */
export function getOperationMode(): 'database' | 'contract' | 'hybrid' {
  // Check environment variable for explicit mode
  const mode = process.env.API_MODE?.toLowerCase();
  
  if (mode === 'database' || mode === 'contract' || mode === 'hybrid') {
    return mode;
  }

  // Default based on database availability
  return isDatabaseConfigured() ? 'hybrid' : 'contract';
}