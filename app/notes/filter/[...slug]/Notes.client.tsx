"use client";

import css from "./NotesPage.module.css";
import NoteList from "@/components/NoteList/NoteList";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";

type NotesClientProps = {
  tag?: string;
};

const NotesClient = ({ tag }: NotesClientProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 400);
  const { data, error } = useQuery({
    queryKey: ["notes", { page, search, tag }],
    queryFn: () => fetchNotes({ page, search, tag }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (error)
    return (
      <p className={css.error}>
        Could not fetch the list of notes. {error.message}
      </p>
    );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        {
          <Link href="/notes/action/create" className={css.button}>
            Create note +
          </Link>
        }
      </header>
      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
};

export default NotesClient;
