import { z } from 'zod';

export const zColumns = {
  poll_date: z.string().length(10),
  poll_gender: z.enum(['m', 'f', 'u', 'o']),
  user_id: z.number(),
  user_name: z.string().max(30),
  user_gender: z.enum(['m', 'f']),
  user_phone: z.string().regex(/[0-9]*/),
  city_id: z.string().length(6),
  school_nspn: z.string().length(8),
  school_type: z.enum(['smp', 'smk', 'sma']),
  school_grade: z.enum(['1', '2', '3', '4', '5', '6']),
};
