/* eslint-disable no-console */

import { RenderResult, render } from '@testing-library/react';
import {
  DefaultOptions,
  QueryClient,
  QueryClientProvider,
  setLogger,
} from 'react-query';

import { defaultQueryClientOptions } from '../react-query/queryClient';
import { ReactElement } from 'react';

import { generateQueryClient } from '../react-query/queryClient';

setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {
    // 에러가 발생하면 보기 싫어서 출력을 감춘다.
    // 기본값이 설정이 안되있어 에러가 난다
  },
});

// 전체 적인 쿼리 클라이언트 테스팅 함수
const generateTestQueryClient = () => {
  //커스텀 훅과 컴포넌트 양쪽 모두에 도움이 될 함수를 생성
  // return generateQueryClient(); // time out

  // 재시도 없게 만든다
  const client = generateQueryClient();
  const options = client.getDefaultOptions();
  options.queries = { ...options.queries, retry: false };

  return client;
};

// 래핑 함수, ui 함수 부가적인 클라이언트도 받을수 있다.
export function renderWithQueryClient(
  ui: ReactElement,
  client?: QueryClient, // query client for the client
): RenderResult {
  // 테스팅 라이브러리에서 렌더링 하면 받는 결과

  // 클라이언트를 알수 있는 경우 제너레이리트 클라이언트 생성
  // ??: 병합 연산자 , client가 null 또는 undefined일 경우에만 generateTestQueryClient()를 호출하여 새로운 클라이언트를
  const queryClient = client ?? generateTestQueryClient();

  // 프로바이더
  return render(
    //클라이언트가 필요, ui 를 래핑 한다.
    <QueryClientProvider client={queryClient}> {ui}</QueryClientProvider>,
  );
}

// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
export const createQueryClientWrapper = () => {
  // 테스트 간에 교차점이 없도록 한다.
  const queryClient = generateQueryClient();
  return ({ children }) => (
    // 래퍼 옵션,  크로스 오버 방지, 쿼리 클라이언트
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// // suppress errors written to console
// setLogger({
//   log: console.log,
//   warn: console.warn,
//   error: () => {
//     // swallow the errors
//   },
// });

// const defaultOptions: DefaultOptions = defaultQueryClientOptions;
// if (defaultOptions && defaultOptions.queries)
//   defaultOptions.queries.retry = false;

// // make this a function for unique queryClient per test
// const generateQueryClient = () => {
//   return new QueryClient({ defaultOptions });
// };

// export function renderWithQueryClient(
//   ui: React.ReactElement,
//   client?: QueryClient,
// ) {
//   const queryClient = client ?? generateQueryClient();
//   return render(
//     <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
//   );
// }
