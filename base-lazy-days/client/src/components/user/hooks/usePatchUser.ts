import jsonpatch from 'fast-json-patch';
import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from './useUser';

/* 
  쿼리 클라이언트는 사용할 필요가 없다.
  유즈유저훅으로 쿼리 캐시를 업데이트 할 예정

*/

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
}

// TODO: update type to UseMutateFunction type
export function usePatchUser(): UseMutateFunction<
  User,
  unknown,
  User,
  unknown
> {
  const { user, updateUser } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  // TODO: replace with mutate function
  const { mutate: patchUser } = useMutation(
    (newUserData: User) => patchUserOnServer(newUserData, user),
    {
      // 기존사용자의 데이터의 스냅샷을 찍을텐데 온뮤테이트 안에 온 에러가 컨텍스트로 반환
      onMutate: async (newData: User | null) => {
        // 첫번째로 필요한것은 사용자 데이터를 대상으로 한  발신하는 쿼리를 모두 취소합니다
        // 즉 오래된 서버 데이터는 옵티머스 업데이트로 덮어 쓰지 않는다.
        queryClient.cancelQueries(queryKeys.user); // 이는 업데이트 전 캐시에 있던 데이터

        // 스냅샷 전의 유저의 밸류
        // 유저를 사용하면
        const previousUserData: User = queryClient.getQueryData(queryKeys.user);

        // ㅇㅎㅂ티머스 업데이트 새로운 캐시  새로운 유저 밸류와ㅓ 함께
        updateUser(newData);

        // 반환값은 스냅샷
        return { previousUserData };
      },
      onError: (error, newData, context) => {
        // 롤백 캐시 , 오류가 있는 경우 저장된 오값으로 캐시를 롤백 한다.
        if (context.previousUserData) {
          updateUser(context.previousUserData);
          toast({
            title: '업데이트 실패, 기전 값으로 돌아갑니다',
            status: 'warning',
          });
        }
      },

      // 업데이트, user 데이터를 담겨있다.
      onSuccess: (userData: User | null) => {
        // 쿼리 데이터 업데이트
        if (user) {
          updateUser(userData);
          toast({
            title: 'User Updated',
            status: 'success',
          });
        }
      },

      onSettled: () => {
        // 사용자의 데이터를 무효화 한다. 서버에서 최신 데이터를 보여줄수 있도로 하겠다.
        // 무효화 해야하기 때문에 쿼리 클라이언트를 사용한다.
        queryClient.invalidateQueries(queryKeys.user);
      },
    },
  );

  return patchUser;
}
