"use client";

import { useMemo } from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  offset: number;
  onOffsetChange: (offset: number) => void;
  limit: number;
  totalSize: number;
  tertiary?: boolean;
}

const pageClassName = `text-[12px]/[17px] text-[#999] w-[24px] h-[24px]  flex items-center justify-center mx-1`;

export const Pagination = (props: PaginationProps) => {
  let limit =
    typeof props.limit === "string" ? parseInt(props.limit) : props.limit;
  let offset =
    typeof props.offset === "string" ? parseInt(props.offset) : props.offset;

  const pageCount = useMemo(
    () => Math.ceil(props.totalSize / limit),
    [props.totalSize, limit]
  );

  const page = useMemo(() => Math.ceil(offset / limit), [offset, limit]);

  if (!pageCount || pageCount === 1) return null;

  return (
    <ReactPaginate
      onPageChange={(e) => {
        /** page to offset */
        const offset = e.selected * limit;
        props.onOffsetChange(offset);
      }}
      forcePage={page}
      pageCount={pageCount}
      previousLabel={"<"}
      nextLabel={">"}
      containerClassName={"py-10 self-center list-none flex"}
      previousClassName={pageClassName + " !text-[#666]"}
      nextClassName={pageClassName + " !text-[#666]"}
      pageClassName={pageClassName}
      activeLinkClassName={`${pageClassName} text-black`}
    />
  );
};
