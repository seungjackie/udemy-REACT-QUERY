import InfiniteScroll from "react-infinite-scroller";
import { Person } from "./Person";
import { UseBaseQuery, useInfiniteQuery } from "react-query";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  // 어떤 데이터를 쓸지?
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery(
    "sw-people", // 쿼리키
    // 프러포티로 페이지 파람스로 받는다.
    ({ pageParam = initialUrl }) => fetchUrl(pageParam), // 쿼리 함수, url 불러오기
    {
      // 라스트 페이지 를 가진
      getNextPageParm: (lastPage) => lastPage.next || undefined, // 라스트 페이지 에 도달 거짓이면 언디 파인드
    }
  );
  // TODO: get data for InfiniteScroll via React Query
  if (isLoading) return <div className="loading"> loading</div>;
  if (isError) return <div>Error ! {error.toString()}</div>;
  // is fetching은 새페이지를 열어야 되는데 조기반환 으로 실행되서 페이지 위로 올라간다.

  return (
    <>
      {isFetching && <div className="loading"> loading</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eye_color}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
