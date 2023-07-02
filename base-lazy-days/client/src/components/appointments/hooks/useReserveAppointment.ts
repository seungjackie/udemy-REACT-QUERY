import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';

import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from '../../user/hooks/useUser';

// for when we need functions for useMutation
// 유저 아이디,
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined,
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useReserveAppointment(): UseMutateFunction<
  void,
  unknown,
  Appointment, // 타입 적용
  unknown
> {
  const { user } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  // TODO: replace with mutate function
  const { mutate } = useMutation(
    (appointment: Appointment) =>
      // 서버를 업데이트
      setAppointmentUser(appointment, user?.id),
    {
      onSuccess: () => {
        // 무효화
        queryClient.invalidateQueries([queryKeys.appointments]);
        toast({
          title: 'you have reserved the apooint',
          status: 'success',
        });
      },
    },
  );

  return mutate;
}

/* 
  no 캐시 데이타
  재시도가 없다.
  노 이즈로딩 이즈 페칭
  변이를 한다.
  온 뮤테이트 콜백
    실패할때 복원 하는데 사용한다.
    이전상태로 복귀
  
  타입스크립트 
    1. 데이터 타입
      보이드
    2. 변이 함수
      에러타입, 에러
    3. 배리어블
      예상하는 변수 유형
    4. 컨텍스트

    예약시
      캐시를 무효화
      새로고침을 할 필요 없이
      만료 
      리페치로 트리커 역활
      뮤테이트를 호출하면
        온 서셋스
        관뤈 쿼리 무효화
        리패치로 데이터 송신

    쿼리 키  펄픽스
      모든 쿼리를 무효화


*/
