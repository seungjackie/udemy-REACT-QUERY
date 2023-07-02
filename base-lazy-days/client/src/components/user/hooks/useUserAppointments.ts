import dayjs from 'dayjs';
import { useQuery } from 'react-query';

import type { Appointment, User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useUser } from './useUser';

// for when we need a query function for useQuery
async function getUserAppointments(
  user: User | null,
): Promise<Appointment[] | null> {
  if (!user) return null;
  const { data } = await axiosInstance.get(`/user/${user.id}/appointments`, {
    headers: getJWTHeader(user),
  });
  return data.appointments;
}

// appointment[] fal
export function useUserAppointments(): Appointment[] {
  // 유저 불러오기
  const { user } = useUser();
  // data

  // 처음에 빈값이기 떼ㅐ문에
  const fallback: Appointment[] = [];
  const { data: userAppointments = fallback } = useQuery(
    // 'user-qppointments',
    [queryKeys.appointment, queryKeys.user, user?.id], // 예약
    () => getUserAppointments(user),
    { enabled: !!user }, // 참 거짓
  );

  // 폴백
  return userAppointments;
}
