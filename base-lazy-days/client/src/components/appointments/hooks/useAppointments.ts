// @ts-nocheck
import dayjs from 'dayjs';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useUser } from '../../user/hooks/useUser';
import { AppointmentDateMap } from '../types';
import { getAvailableAppointments } from '../utils';
import { getMonthYearDetails, getNewMonthYear, MonthYear } from './monthYear';

// common option for both useQuery and prefetchQuery
const commonOptions = {
  staleTime: 0,
  cacheTime: 300000, // 5 qns
};

// for useQuery call
async function getAppointments(
  year: string,
  month: string,
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

// types for hook return object
interface UseAppointments {
  appointments: AppointmentDateMap;
  monthYear: MonthYear;
  updateMonthYear: (monthIncrement: number) => void;
  showAll: boolean;
  setShowAll: Dispatch<SetStateAction<boolean>>;
}

// The purpose of this hook:
//   1. track the current month/year (aka monthYear) selected by the user
//     1a. provide a way to update state
//   2. return the appointments for that particular monthYear
//     2a. return in AppointmentDateMap format (appointment arrays indexed by day of month)
//     2b. prefetch the appointments for adjacent monthYears
//   3. track the state of the filter (all appointments / available appointments)
//     3a. return the only the applicable appointments for the current monthYear
export function useAppointments(): UseAppointments {
  /** ****************** START 1: monthYear state *********************** */
  // get the monthYear for the current date (for default monthYear state)
  const currentMonthYear = getMonthYearDetails(dayjs());

  // state to track current monthYear chosen by user
  // state value is returned in hook return object
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  // setter to update monthYear obj in state when user changes month in view,
  // returned in hook return object
  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }
  /** ****************** END 1: monthYear state ************************* */
  /** ****************** START 2: filter appointments  ****************** */
  // State and functions for filtering appointments to show all or only available
  const [showAll, setShowAll] = useState(false);

  // We will need imported function getAvailableAppointments here
  // We need the user to pass to getAvailableAppointments so we can show
  //   appointments that the logged-in user has reserved (in white)
  const { user } = useUser();

  // 최적화 필요
  const slectFn = useCallback(
    (data) =>
      // 사용자가 로그아웃 할때마다 이함수를 변경 해야 할것.
      getAvailableAppointments(data, user),
    [user],
  );

  /** ****************** END 2: filter appointments  ******************** */
  const queryClient = useQueryClient(); // Query client to get available appointments
  useEffect(() => {
    const nextMonthYear = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery(
      // 쿼리키는 의존성, 뭔스로 읽고,
      [queryKeys.apoointments, nextMonthYear.year, nextMonthYear.month],
      // 클릭 할때마다 서버 호출
      () => getAppointments(nextMonthYear.year, nextMonthYear.month),
      commonOptions,
    );
  }, [queryClient, monthYear]); // 데이터 가 바뀔때마다 업데이팅

  /** ****************** START 3: useQuery  ***************************** */
  // useQuery call for appointments for the current monthYear

  // TODO: update with useQuery!
  // Notes:
  //    1. appointments is an AppointmentDateMap (object with days of month
  //       as properties, and arrays of appointments for that day as values)
  //
  //    2. The getAppointments query function needs monthYear.year and
  //       monthYear.month
  const fallback = {};

  /* 
    만료 상태,
    리패치 함수를 수동 리패칭 수행
    예약이 되었는지 
    알려진 키에 대해서만 가져온다
    매월 새로운 키를 가져온다.
    데이터가 변결될대마다 새로운 키가 필요하다.
  */
  const { data: appointments = fallback } = useQuery(
    // 데이터 뮤ㅜ효화 ,
    [queryKeys.appointments, monthYear.year, monthYear.month],
    () => getAppointments(monthYear.year, monthYear.month),
    {
      select: showAll ? undefined : slectFn,
      ...commonOptions,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      refetchInterval: 60000, // 사용하지 말아, 몇초마다 업데이트
    },
    /* {
      // 배경과 데이터가 밪아야 한다.
      keepPreviousData: true,
    }, */
  );

  /** ****************** END 3: useQuery  ******************************* */

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}

// 유드 이팩트로 프리 패칭 하는게 좋다.

// 뭔스 이어가 바뀔때마다 프리패칭한다.

// 디펜던시 프레치 싱행하기전 ㅇ아ㅣㄹ수 있다.
// 쿼리키는 다음의 뭔스 이어와 관려ㅕㄴ 되어있다.
// prev 데이터

/* 
  난이도 있는 내용
  초기데이터 채우기 옵션
  프리패칭 셋 쿼리 데이타는 쿼리 클라이언트

  프리패치
  넷 쿼리 데이타는 향후

  렌더링
  트리트 먼트 페이지 가상의 샤옹자 대상으로  데이터를 기달리지 않고 했다.
  캐시를 미리 채워 놓었다.

  패이지 매김과는 다르다.
  이전데이터를 유지할수 없었는데
  
  쿼리키를 종석서을 처리로 
  쿼리가 데이터를 가져오지 못하고, 새 데이터를 가져올수도  없다
*/
