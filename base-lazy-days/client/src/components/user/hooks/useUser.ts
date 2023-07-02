import { AxiosResponse } from 'axios';
import { useQuery, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

// 오래되어있을 데이터를 수동으로 취소할수 있게 가져와야 한다.
// signal : AbortSignal 에 해당된다. 취소 하는 해당
async function getUser(
  user: User | null,
  signal: AbortSignal,
): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
      signal,
    },
  );
  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}
// 유저 데이터 가져오는 곳
export function useUser(): UseUser {
  const queryClient = useQueryClient();
  // 로컬리지에 유저 저장,
  const { data: user } = useQuery(
    queryKeys.user,
    // signal that user has been updated, 인수 분해
    ({ signal }) => getUser(user, signal), // 두번째 인수로 전달
    {
      initialData: getStoredUser,
      // 셋 쿼리 데이타에서 가져오는 데이터
      onSuccess: (recived: User | null) => {
        if (!recived) {
          clearStoredUser();
        } else {
          setStoredUser(recived);
        }
      },
    },
  ); // getuser 기존 유저값, 업데이트는 data:유저를 사용

  // 셋 쿼리 로컬 스토리지로

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // 연결
    queryClient.setQueriesData(queryKeys.user, newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // TODO: reset user to null in query cache
    queryClient.setQueriesData(queryKeys.user, null);
    // queryClient.removeQueries('user-appointments');
    // 배열추가, 쿼리키 어포인트 먼트 삭제, 무효화 상태, 접두사 를 사용하기 때문에 널이여도 상관 없다.
    queryClient.removeQueries([queryKeys.appointments, queryKeys.user]); // abortController will be null
  }

  return { user, updateUser, clearUser };
}

/* 
  인증 제공자 역활
    캐시는 유저를 필요하는 값을 
  쿼리 키
  유즈 유저
    셋 쿼리 데이타를 호출

  로컬 스토리지 콜백으로 업데이트 해야한다.
  onsuccess 로컬 스토리지
    하나 추가를 해야한다
    이니셩 데이타를 추가
      캐시에 추가하고싶을때 사용
      페이지가 

    쿼리 케시 데이타 보존

    유즈 딜리트 뮤테이션
    취소 토스트를 표시할수있다.
  
  유저 

*/
