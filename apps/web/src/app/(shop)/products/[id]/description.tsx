import { QuillViewer } from "@/components/quill-viewer";
import { Menu } from "@hackathon/type";

export const Description = ({ menu }: { menu: Menu }) => {
  return (
    <div className="m-4">
      <h3 className="font-bold text-[20px]/[28px] mb-4">Description</h3>
      <QuillViewer  html={menu.translate.description || ""} />
    </div>
  );
};
