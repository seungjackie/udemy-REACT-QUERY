import { useStaff } from '../hooks/useStaff';
import { act, renderHook } from '@testing-library/react-hooks/';

import { createQueryClientWrapper } from '../../../test-utils';

test('filter staff', async () => {
  // the magic happens here
  const { result, waitFor } = renderHook(useStaff, {
    wrapper: createQueryClientWrapper(),
  });

  // wait for the staff to populate, 데이터 로드
  await waitFor(() => result.current.staff.length === 4);

  // set to filter for only staff who give massage
  act(() => result.current.setFilter('facial'));

  // wait for the staff list to display only 3, 세명인지 확이
  await waitFor(() => result.current.staff.length === 3);
});
