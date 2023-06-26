import { useQueries, useQuery, useMutation } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  const { data, isLoading, isError, error } = useQuery(
    ["comments", post.id],
    () => {
      fetchComments(post.id);
    }
  );

  // 첫번째 인자는 배열이다., 함수가 아니다. post.id를 인자를 받아서 전달.
  const deleteMutation = useMutation((postId) => deletePost(postId));
  const updateMutation = useMutation((postId) => updatePost(postId));

  console.log(post);

  if (isLoading) return <div>Loading comments...</div>;
  if (isError) return <div>Error fetching comments</div>;

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {deleteMutation.isError && (
        <div style={{ color: "red " }}>Deleting post...</div>
      )}
      {deleteMutation.isLoading && (
        <div style={{ color: "yellow " }}>loading post...</div>
      )}
      {deleteMutation.isSuccess && (
        <div style={{ color: "green " }}>succes post...</div>
      )}
      {updateMutation.isError && (
        <div style={{ color: "red " }}>Deleting post...</div>
      )}
      {updateMutation.isLoading && (
        <div style={{ color: "yellow " }}>loading post...</div>
      )}
      {updateMutation.isSuccess && (
        <div style={{ color: "green " }}>succes post...</div>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data?.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
