"use client";

import { useState } from "react";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { NoteTag } from "../../types/note";
import { useNoteDraftStore } from "@/lib/store/noteStore";

type Errors = {
  title?: string;
  content?: string;
  tag?: string;
};

const NoteForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/all");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const validate = (values: {
    title: string;
    content: string;
    tag: NoteTag;
  }): Errors => {
    const newErrors: Errors = {};

    if (!values.title) {
      newErrors.title = "Title is required";
    } else if (values.title.length < 3) {
      newErrors.title = "Too short";
    } else if (values.title.length > 50) {
      newErrors.title = "Too long";
    }

    if (values.content.length > 500) {
      newErrors.content = "Too long";
    }

    if (!values.tag) {
      newErrors.tag = "Tag is required";
    }

    return newErrors;
  };

  const formAction = (formData: FormData) => {
    const values = {
      title: (formData.get("title") as string) || "",
      content: (formData.get("content") as string) || "",
      tag: formData.get("tag") as NoteTag,
    };

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    mutate(values);
  };

  return (
    <form action={formAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft?.title}
          onChange={handleChange}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft?.content}
          onChange={handleChange}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          defaultValue="Todo"
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
