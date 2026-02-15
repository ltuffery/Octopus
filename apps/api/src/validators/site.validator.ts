import {z} from 'zod';
import {Site} from "@octopus/shared";

const baseSiteSchema = z.object({
    name: z
        .string()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must not exceed 100 characters')
        .regex(/^[a-zA-Z0-9-_]+$/, 'Name must contain only lowercase letters, uppercase letters, numbers, and hyphens'),
    source: z.enum(['local', 'github', 'gitlab'], {
        errorMap: () => ({message: 'Source must be either "local" or "github"'}),
    }),
    sourceUrl: z.string().url('Invalid URL format').optional(),
    localPath: z
        .string()
        .regex(/^\//, 'Local path must be an absolute path starting with /')
        .optional(),
    framework: z.string(),
    branch: z.string().max(100, 'Branch name must not exceed 100 characters').optional(),
    buildCommand: z.string().max(500, 'Build command must not exceed 500 characters').optional(),
    startCommand: z.string().max(500, 'Start command must not exceed 500 characters').optional(),
    envVars: z.record(z.string()).optional(),
    domain: z
        .string()
        .max(255, 'Domain must not exceed 255 characters')
        .regex(
            /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/,
            'Invalid domain format'
        )
        .optional(),
    port: z
        .number()
        .int('Port must be an integer')
        .min(1, 'Port must be at least 1')
        .max(65535, 'Port must not exceed 65535')
        .optional(),
});

export const createSiteSchema = baseSiteSchema
    .refine(
        (data: Site) => {
            if (data.source === 'github' || data.source === 'gitlab') {
                return !!data.sourceUrl;
            }
            return true;
        },
        {
            message: 'sourceUrl is required when source is github or gitlab',
            path: ['sourceUrl'],
        }
    )
    .refine(
        (data: Site) => {
            if (data.source === 'local') {
                return !!data.localPath;
            }
            return true;
        },
        {
            message: 'localPath is required when source is local',
            path: ['localPath'],
        }
    );

export const updateSiteSchema = baseSiteSchema.partial();

export const idParamSchema = z.object({
    id: z.string().uuid('Invalid UUID format'),
});
