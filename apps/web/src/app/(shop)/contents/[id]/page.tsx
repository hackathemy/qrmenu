"use client";

import { ContentSubInfo } from "@/components/content";
import { MenuItem } from "@/components/menu-item";
import { Nav } from "@/components/nav";
import { Page } from "@/components/page";
import { QuillViewer } from "@/components/quill-viewer";
import { useLang } from "@/hooks/use-lang";
import { formatDate } from "@/utils";
import { apiClient } from "@hackathon-qrmenu/api-client";
import { Content, Menu } from "@hackathon-qrmenu/type";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export default function ContentPage() {
  const { id: contentId } = useParams();

  const langCode = useLang();

  const getContent = useSWR(
    {
      url: `/contents/${contentId}`,
      params: { langCode },
    },
    (arg) =>
      apiClient.get<{ content: Content }>(arg.url, {
        params: arg.params,
      })
  );

  const listContentMenus = useSWR(
    {
      url: `/contents/${contentId}/menus`,
      params: { langCode },
    },
    (arg) =>
      apiClient.get<{ menus: Menu[] }>(arg.url, {
        params: arg.params,
      })
  );

  const postContent = useSWRMutation(
    { url: `/contents/${contentId}:view` },
    (arg, options: { arg: any }) => apiClient.post(arg.url, options.arg)
  );

  useEffect(() => {
    postContent.trigger({});
  }, []);

  return (
    <Page nav={<Nav back />} bgWhite>
      <div className="bg-white flex flex-col">
        <div className="flex flex-col p-4">
          <h1 className="text-[20px] font-bold">
            {getContent.data?.data.content.translate.title}
          </h1>
          <ContentSubInfo
            date={formatDate(getContent.data?.data.content.createdAt || "")}
            views={getContent.data?.data.content.views || 0}
          />
        </div>

        <div className="m-4 mt-0">
          {getContent.data && (
            <QuillViewer
              html={
                getContent.data?.data.content.translate.descriptionHtml || ""
              }
            />
          )}
        </div>
      </div>

      {listContentMenus.data && listContentMenus.data.data.menus.length > 0 && (
        <div className="m-4">
          <h3 className="font-extrabold text-[20px]/[28px] mb-5">Menu List</h3>
          {listContentMenus.data.data.menus.map((x) => (
            <MenuItem key={x.id} menu={x} />
          ))}
        </div>
      )}
    </Page>
  );
}
