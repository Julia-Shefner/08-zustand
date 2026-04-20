import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

type NotesByTagProps = {
  params: Promise<{ slug: string[] }>;
};

export const generateMetadata = async ({
  params,
}: NotesByTagProps): Promise<Metadata> => {
  const { slug } = await params;
  const tag = slug[0] === "all" ? "All" : slug[0];

  return {
    title: `${tag} Notes | NoteHub`,
    description: `Browse notes filtered by tag: ${tag}`,
    openGraph: {
      title: `${tag} Notes | NoteHub`,
      description: `Browse notes filtered by tag: ${tag}`,
      url: `https://08-zustand-weld-zeta.vercel.app/notes/filter/${slug.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 620,
          alt: "NoteHub",
        },
      ],
    },
  };
};

const NotesByTag = async ({ params }: NotesByTagProps) => {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page: 1, search: "", tag }],
    queryFn: () => fetchNotes({ page: 1, tag }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesByTag;
