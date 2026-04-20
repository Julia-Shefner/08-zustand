import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

type NotesByTagProps = {
  params: Promise<{ slug: string[] }>;
};

const NotesByTag = async ({ params }: NotesByTagProps) => {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, tag],
    queryFn: () => fetchNotes({ page: 1, tag }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesByTag;
