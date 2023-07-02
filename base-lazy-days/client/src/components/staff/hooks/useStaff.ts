import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useQuery } from 'react-query';

import type { Staff } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { filterByTreatment } from '../utils';

// for when we need a query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

interface UseStaff {
  staff: Staff[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export function useStaff(): UseStaff {
  // for filtering staff by treatment
  const [filter, setFilter] = useState('all'); // 업데이트

  // TODO: get data from server via useQuery
  const slectFn = useCallback(
    // 언필터 스태프 전달 , 필터와 값을 조건으로, 유즈 콜백으로 안정적, 최적화,
    (unfilteredStaff) => filterByTreatment(unfilteredStaff, filter),
    // 상태가 바뀐다면 필터 함수 업데이팅
    [filter],
  ); // 가독성을 위해서

  const fallback = [];
  const { data: staff = fallback } = useQuery(queryKeys.staff, getStaff, {
    select: filter !== 'all' ? slectFn : undefined,
  });

  return { staff, filter, setFilter };
}
