import { screen } from '@testing-library/react';

import { rest } from 'msw';
import { server } from '../../../mocks/server';

import { renderWithQueryClient } from '../../../test-utils';
import { Calendar } from '../Calendar';

// mocking useUser to mimic a logged-in user
// jest.mock('../../user/hooks/useUser', () => ({
//   __esModule: true,
//   useUser: () => ({ user: mockUser }),
// }));

test('Reserve appointment error', async () => {
  // (re)set handler to return a 500 error for appointments
  // 특정
  server.resetHandlers(
    rest.get(
      'http://localhost:3030/appointments/:month/:year',
      (req, res, ctx) => {
        return res(ctx.status(500));
      },
    ),
  );

  renderWithQueryClient(<Calendar />);

  const alertToast = await screen.findByRole('alert');
  // 대 소문자 확인 잘 해야함.
  // expect(alertToast).toHaveTextContent(
  //   'Requset falied with 스에티어스 코드 500',
  // );
  expect(alertToast).toHaveTextContent('Request failed with status code 500');
});
