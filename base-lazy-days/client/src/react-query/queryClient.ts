import { createStandaloneToast } from '@chakra-ui/react';
import { MutationCache, QueryClient } from 'react-query';

import { theme } from '../theme';

const toast = createStandaloneToast({ theme });

// 애러 훅 디폴트로 에러 핸들러 발생
function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : 'error connecting to server';

  // prevent duplicate toasts
  toast.closeAll();
  toast({ title, status: 'error', variant: 'subtle', isClosable: true });
}

// to satisfy typescript until this file has uncommented contents

// 기본 에러 생성
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 에러 핸들러 생성, 보수적인 방법,  대부분 쿼리에서 리페칭 할만큼 데이터 변경이 충분하지 않다. 데이터를 무용지물 만들수 있다.
      // 글로벌로 적용
      //
      onError: queryErrorHandler,
      staleTime: 600000,
      cacheTime: 600000,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },

  // mutationCache: new MutationCache({
  //   onError: queryErrorHandler,
  // }),
  // },
});
