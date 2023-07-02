import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';

import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update return type
export function useCancelAppointment(): UseMutateFunction<
  void, // 리무브 어포인트먼트
  unknown, // 에러타입
  Appointment, // 인수에대한
  unknown // 컨텍스트
> {
  const toast = useCustomToast();
  // useClient method to retrieve client information from server call and return client information
  const queryClient = useQueryClient();

  // 반환값을 궂도 분해,
  const { mutate } = useMutation(
    (appointment: Appointment) => removeAppointmentUser(appointment),
    {
      onSuccess: () => {
        // 모든 쿼리키를 무효화
        queryClient.invalidateQueries([queryKeys.appointments]);
        // 취소 상태 확인
        toast({
          title: 'you have cancled the appointment',
          status: 'warning',
        });
      },
    },
  );

  // TODO: replace with mutate function
  return mutate;
}
