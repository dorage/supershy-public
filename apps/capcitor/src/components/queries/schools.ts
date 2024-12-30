import { createQueryKit } from '@/helpers/query';
import SchoolsProvider from '@/providers/schools';
import { createQuery } from '@tanstack/solid-query';

export const getSchoolsKit = createQueryKit(
  () => ['v1.0.1', 'schools'],
  SchoolsProvider.getSchools,
  {
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  }
);
