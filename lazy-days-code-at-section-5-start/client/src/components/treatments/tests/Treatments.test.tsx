import { render, screen } from '@testing-library/react';

import { Treatments } from '../Treatments';
import { renderWithQueryClient } from '../../../test-utils';

// 이 테스트를 업데이트하여 오류가 없는 렌더링 뿐만 아니라
// 비동식
test('renders response from query', async () => {
  // write test here
  // render 대신 renderWithQueryClient, 클라이언트에 대한 오류가 안 뜰 것이다.
  renderWithQueryClient(<Treatments />);

  // 스크린 렌더링 결과 , 파인드 기달리고 있다는 비동기식  뜻,  'heading'은 제목들의 역활, {}테스팅 선택지들에 대한  세부내은 상당부분을 넘어가는중, 대소문자 주의
  const treatmentTitles = await screen.findAllByRole('heading', {
    name: /massage|facial|scrub/i,
  });

  // 찾다
  expect(treatmentTitles).toHaveLength(3);
  // 테스팅 결과 확인
});
