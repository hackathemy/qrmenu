import { Page } from "@/components/page";
import { Row } from "@/components/row";
import Link from "next/link";

export default function About() {
  return (
    <Page label="QR Menu">
      <div className="flex flex-col items-start">
        <div className="grid gap-y-s">
          <Row label="회사명" content="Hackathemy" />
        </div>

        <div className="grid gap-y-3 mt-10">
          <Link
            href={"/#/contact/"}
            className="text-[14px] border-b-[1px] border-[#101010]"
          >
            이메일로 문의하기
          </Link>
          <div>
            <Link
              href={"/#/terms/"}
              className="text-[14px] border-b-[1px] border-[#101010]"
            >
              이용약관
            </Link>
          </div>
          <Link
            href={"/#/privacy/"}
            className="text-[14px] border-b-[1px] border-[#101010]"
          >
            개인정보처리방침
          </Link>
        </div>
      </div>
    </Page>
  );
}
