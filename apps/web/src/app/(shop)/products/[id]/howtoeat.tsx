import { QuillViewer } from "@/components/quill-viewer";
import { Menu } from "@hackathon/type";

export const HowtoEat = ({ menu }: { menu: Menu }) => {
  return (
    <div className="m-4">
      <h3 className="font-bold text-[20px]/[28px] mb-4">How to Eat</h3>
      <QuillViewer html={menu.translate.guide || ""} />
    </div>
  );
};
