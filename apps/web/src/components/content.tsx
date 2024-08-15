import { formatDate, getCDNUrl } from "@/utils";
import { Content as ContentT } from "@hackathemy-qrmenu/type";
import Image from "next/image";
import Link from "next/link";

export const Content = ({ content }: { content: ContentT }) => {
  return (
    <Link href={"/contents/" + content.id} className="mb-3 last-of-type:mb-0">
      <div className="w-full flex flex-col  bg-white px-4">
        <div className="relative self-stretch h-[240px] z-0">
          <Image
            src={getCDNUrl(content.thumbnail.key)}
            alt="Test"
            fill
            objectFit="cover"
            style={{ zIndex: 1 }}
          />
        </div>
        <div className="py-4 bg-white flex flex-col">
          <p className="text-[18px]/[24px] font-medium line-clamp-2">
            {content.translate.title}
          </p>
          <ContentSubInfo
            date={formatDate(content.createdAt)}
            views={content.views}
          />
        </div>
      </div>
    </Link>
  );
};

export const ContentSubInfo = ({
  date,
  views,
}: {
  date: string;
  views: number;
}) => {
  return (
    <div className="mt-3 self-end flex items-center">
      <span className="text-[#999] text-[12px]">{date}</span>
      <span className="text-[#666] text-[12px] flex items-center ml-3">
        <Image
          src="/view.png"
          alt="View"
          width={14}
          height={12}
          className="mr-1"
        />
        {views}
      </span>
    </div>
  );
};
