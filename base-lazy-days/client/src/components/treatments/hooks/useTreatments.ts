import { useQuery, useQueryClient } from 'react-query';

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
  // 에러 같은 부분은 디폴트 에러값으로 설정, 프리 리패칭 저용
  const { data = fallback } = useQuery(queryKeys.treatments, getTreatments); // 오타 방지 키

  return data;
}

export function usePreFetchTreatments(): void {
  // 쿼리 공급자에 쿼리 클라이언트로 반환
  const queryClient = useQueryClient();
  // 쿼리 클라이언트 쿼리키는 쿼리키. 트리트먼트, 일치 하는지 확인, 불러오기, 스테일로 리패칭 안하게 할수 있다., 훅으로 아니게 만들수 있지만 훅내에서 사용할수 없다?
  queryClient.prefetchQuery(queryKeys.treatments, getTreatments, {
    // 캐싱 타임 유지
    staleTime: 600000, // 10 minutes , 기본은 오분
    cacheTime: 900000, // 15 minutes ,
  });
}
