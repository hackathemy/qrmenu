"use client";

import { ChangeEvent, ReactNode, useRef } from "react";

export const FileUploader = ({
  children,
  onChange,
  file,
}: {
  children: (onUpload: () => void) => ReactNode;
  onChange: (file: File) => void;
  file: File | null;
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    onChange(file);
    e.target.value = "";
  };

  return (
    <div>
      {children(() => {
        ref.current?.click();
      })}
      <span className="text-[14px]">{file ? "선택됨: " + file.name : ""}</span>
      <input
        accept="image/*"
        type="file"
        ref={ref}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};
