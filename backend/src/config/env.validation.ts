import { z } from 'zod';

export const envSchema = z.object({
    ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_HOST: z.string().min(1, 'DATABASE_HOST is required'),
    DATABASE_PORT: z.coerce.number().int().positive().default(5432),
    DATABASE_USER: z.string().min(1, 'DATABASE_USER is required'),
    DATABASE_PASSWORD: z.string().min(1, 'DATABASE_PASSWORD is required'),
    DATABASE_NAME: z.string().min(1, 'DATABASE_NAME is required'),
    JWT_TOKEN: z.string().min(16, 'JWT_TOKEN must be at least 16 characters'),
    JWT_EXPIRATION: z.string().min(1, 'JWT_EXPIRATION is required'),
    JWT_EXPIRATION_EXCHANGE: z.string().min(1, 'JWT_EXPIRATION_EXCHANGE is required'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>): EnvConfig {
    const result = envSchema.safeParse(config);
    if (!result.success) {
        const errors = result.error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join('\n');
        throw new Error(`Environment validation failed:\n${errors}`);
    }
    return result.data;
}