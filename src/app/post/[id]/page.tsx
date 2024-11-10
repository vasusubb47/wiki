"use server";

import fetchPageById from "pages/api/page/fetchPageById";

export default async function PostPage({ params }: { params: { id: string } }) {
  const page = await fetchPageById(params.id);

  if (!page.ok) {
    return <div>Page not found</div>;
  }

  return (
    <div>
      Post {params.id}
      <div>{page.value.title}</div>
      <div>{page.value.status}</div>
      <div>{page.value.createdAt.toISOString()}</div>
      <div>{page.value.updatedAt?.toISOString()}</div>
    </div>
  );
}
