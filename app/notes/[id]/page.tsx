import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";

interface NoteProps {
  params: Promise<{ id: string }>;
}
export const generateMetadata = async ({
  params,
}: NoteProps): Promise<Metadata> => {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    return {
      title: `${note.title} | NoteHub`,
      description: note.content,
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content,
        url: `https://08-zustand-weld-zeta.vercel.app/notes/${id}`,
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
  } catch {
    return {
      title: "Note Not Found | NoteHub",
      description: "The requested note does not exist.",
    };
  }
};

const NoteDetails = async ({ params }: NoteProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteDetails;
