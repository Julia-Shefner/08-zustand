import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Note | NoteHub",
  description: "Create a new note to keep your ideas organized",
  openGraph: {
    title: "Create Note | NoteHub",
    description: "Create a new note to keep your ideas organized",
    url: "https://08-zustand-weld-zeta.vercel.app/notes/actions/create",
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
const CreateNote = () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
};

export default CreateNote;
