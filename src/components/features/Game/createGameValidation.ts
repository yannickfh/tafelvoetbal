import { z } from 'zod';

export const createGameSchema = z.object({
    lightAttacker: z.string(),
    lightDefender: z.string(),
    darkAttacker: z.string(),
    darkDefender: z.string(),
});

export type createGameSchemaType = z.infer<typeof createGameSchema>;
