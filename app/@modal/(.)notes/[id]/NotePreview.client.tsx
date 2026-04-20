"use client";

import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";
import Loading from "@/app/loading";

type NotePreviewClientProps = {
  id: string;
};

const NotePreviewClient = ({ id }: NotePreviewClientProps) => {
  const router = useRouter();
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const modalClose = () => router.back();

  return (
    <Modal onClose={modalClose}>
      <button className={css.backBtn} onClick={modalClose}>
        Close
      </button>
      {isLoading && <Loading />}
      {isError && <p className={css.error}>Somethig went wrong.</p>}
      {note && (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.createdAt}</p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default NotePreviewClient;
