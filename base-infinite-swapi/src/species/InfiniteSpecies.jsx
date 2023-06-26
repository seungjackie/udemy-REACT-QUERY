import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "react-query";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  // TODO: get data for InfiniteScroll via React Query
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery(
    "sw-species", // 쿼리키
    // 프러포티로 페이지 파람스로 받는다.
    ({ pageParam = initialUrl }) => fetchUrl(pageParam), // 쿼리 함수, url 불러오기
    {
      // 라스트 페이지 를 가진
      getNextPageParm: (lastPage) => lastPage.next || undefined, // 라스트 페이지 에 도달 거짓이면 언디 파인드
    }
  );
  if (isLoading) return <div>loading</div>;
  if (isError) return <div>error</div>;

  return (
    <>
      {isFetching && <div className="loading"> loading</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => {
            return (
              <Species
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
