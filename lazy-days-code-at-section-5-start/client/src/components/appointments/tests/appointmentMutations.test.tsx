import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { mockUser } from '../../../mocks/mockData';
import { renderWithQueryClient } from '../../../test-utils';
import { Calendar } from '../Calendar';

// mocking useUser to mimic a logged-in user
// 목 유저 유저 , 로그인한 사용자, 그리고 값을
jest.mock('../../user/hooks/useUser', () => ({
  __esModule: true,
  useUser: () => ({ user: mockUser }),
}));

test('Reserve appointment', async () => {
  // 리액트 쿼리 렌더링
  renderWithQueryClient(
    // 메모리 라우터
    <MemoryRouter>
      <Calendar />
    </MemoryRouter>,
  );

  // find all the appointments
  const appointments = await screen.findAllByRole('button', {
    name: /\d\d? [ap]m\s+(scrub|facial|massage)/i,
  });

  // click on the first one to reserve
  fireEvent.click(appointments[0]);

  // check for the toast alert, 경고창
  const alertToast = await screen.findByRole('alert');
  expect(alertToast).toHaveTextContent('reserve');

  // close alert to keep state clean and wait for it to disappear
  // 경고창 닫기, 제스트 오류 발생
  const alertCloseButton = screen.getByRole('button', { name: 'Close' });
  alertCloseButton.click();
  await waitForElementToBeRemoved(alertToast);
});

test('Cancle appointment', async () => {
  // 렌더
  renderWithQueryClient(
    <MemoryRouter>
      <Calendar />
    </MemoryRouter>,
  );

  const cancleButtons = await screen.findAllByRole('button', {
    name: /cancel appointment/i,
  });

  // 왜 첫번재인지?
  // mmsw가 있어서 서버에는 영향이 가지 않는다.
  fireEvent.click(cancleButtons[0]);

  // 변이가 성공하면 토스트 가 뜬다.
  const alertToast = await screen.findByRole('alert');
  expect(alertToast).toHaveTextContent('cancel');

  // 클로즈 라는 버튼을 찾아서 클릭
  const alertCloseButton = screen.getByRole('button', { name: 'Close' });

  alertCloseButton.click();
  await waitForElementToBeRemoved(alertToast);
});
