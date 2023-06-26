import { useQuery } from 'react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  const fallback = []; // fallback for the default

  // TODO: get data from server via useQuery
  const { data = fallback } = useQuery(
    queryKeys.treatments,
    getTreatments /* {
    onError: (error) => {
      const title =
        error instanceof Error ? error.message : 'error connecting to server';
      toast({ title, status: 'error' });
    },
  } */,
  ); // 오타 방지 키
  return data;
}
