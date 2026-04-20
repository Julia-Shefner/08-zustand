"use client";

import css from "./NoteDetails.module.css";

type ErrorProps = {
  error: Error;
};

const Error = ({ error }: ErrorProps) => {
  return (
    <p className={css.error}>Could not fetch note details. {error.message}</p>
  );
};

export default Error;
