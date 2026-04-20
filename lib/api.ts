import axios from "axios";
import type { Note, CreateNote, NoteTag } from "@/types/note";

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}
interface FetchNotesParams {
  page: number;
  search?: string;
  tag?: string;
}

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const axiosInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: { Authorization: `Bearer ${myKey}` },
});

export const fetchNotes = async ({
  page,
  search,
  tag,
}: FetchNotesParams): Promise<NotesHttpResponse> => {
  const response = await axiosInstance.get<NotesHttpResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      ...(search && { search }),
      ...(tag && { tag }),
    },
  });
  console.log(response.data);
  return response.data;
};

export const fetchNoteById = async (id: string) => {
  const response = await axiosInstance.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (values: CreateNote): Promise<Note> => {
  const response = await axiosInstance.post<Note>("/notes", values);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
};
