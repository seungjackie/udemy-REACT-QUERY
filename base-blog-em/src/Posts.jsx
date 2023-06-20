import { useState } from "react";
import { useQuery } from "react-query";

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0"
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery, 구조 분해
  const { data, isError, isLoading, error } = useQuery("posts", fetchPosts, {
    staleTime: 2000,
  }); // 쿼리 키 / 쿼리 함수
  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <>
        <div>Error fetching posts</div>
        <p>{error.toString()}</p>
      </>
    );

  // isfetching
  // isloading는 상테에 쿼리 함수가 캐시가 없고 데이터를 가져온다.
  // 페이지 없을때와 있을때를 구분 해야 한다.

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
