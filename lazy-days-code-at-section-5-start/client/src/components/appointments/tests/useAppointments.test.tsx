import { act, renderHook } from '@testing-library/react-hooks';

import { createQueryClientWrapper } from '../../../test-utils';
import { useAppointments } from '../hooks/useAppointments';
import { AppointmentDateMap } from '../types';

const getAppointmentCount = (appointments: AppointmentDateMap) =>
  Object.values(appointments).reduce(
    (runningCount, appointmentsOnDate) =>
      runningCount + appointmentsOnDate.length,
    0,
  );

test('filter appointments by availalibility', async () => {
  const { result, waitFor } = renderHook(() => useAppointments(), {
    wrapper: createQueryClientWrapper(),
  });

  // to get your bearings
  // console.log(result);
  // console.log(result.current);

  // wait for the appointments to populate
  await waitFor(() => getAppointmentCount(result.current.appointments) > 0);

  const filteredAppointmentLength = getAppointmentCount(
    result.current.appointments,
  );

  // set to filter to all appointments
  act(() => result.current.setShowAll(true));

  // wait for the appointments to show more than when filtered
  await waitFor(() => {
    return (
      getAppointmentCount(result.current.appointments) >
      filteredAppointmentLength
    );
  });
});

/*
    obejct.keys() 필터링 되지 않은 데이트 맵 기준
    키 개수만 비교, 헤러 팜수를 사용하여 예약 날짜 맵핑을 실제 총 예약수를 가져옵니다.
    
    */
