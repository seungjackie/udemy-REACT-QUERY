import { render, screen } from '@testing-library/react';

import { rest } from 'msw';
// import { defaultQueryClientOptions } from '../../../react-query/queryClient';
import { server } from '../../../mocks/server';
import { renderWithQueryClient } from '../../../test-utils';
import { AllStaff } from '../AllStaff';
import { QueryClientProvider, setLogger } from 'react-query';
import { generateQueryClient } from 'react-query/queryClient';

test('renders response from query', async () => {
  renderWithQueryClient(<AllStaff />); // 유즈 스내프 훅으로 직원 엔드 포인트릉 쿼리한다.
  const staffNames = await screen.findAllByRole('heading', {
    name: /massage|sandra|michael|scrub/i,
  });

  expect(staffNames).toHaveLength(2);
});

test('handles query error', async () => {
  // (re)set handler to return a 500 error for staff
  server.resetHandlers(
    rest.get('http://localhost:3030/staff', (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );

  setLogger({
    log: console.log,
    warn: console.warn,
    error: () => {
      // 에러 표시 x
    },
  });

  const queryClient = generateQueryClient(); // 디폴트 옵션
  // 옵션들은 뎃디폴트옵션에서 얻어오게한다.
  const options = queryClient.getDefaultOptions(); // default options are set by server when creating a new query
  options.queries = { ...options.queries, retry: false };
  queryClient.setDefaultOptions;

  render(
    <QueryClientProvider client={queryClient}>
      <AllStaff />
    </QueryClientProvider>,
  );

  const alertToast = await screen.findByRole('alert');
  // 예상값은 reuqst 500이다
  expect(alertToast).toHaveTextContent('Request failed with status code 500');
});
