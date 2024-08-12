import { Page } from "@/components/page";
import { Row } from "@/components/row";
import Link from "next/link";

export default function About() {
  return (
    <Page label="QR Menu">
      <div className="flex flex-col items-start">
        <div className="grid gap-y-s">
          <Row label="회사명" content="헤드리스" />
          <Row label="주식회사대표" content="남궁지환" />
          <Row label="주소" content="서울특별시 강남구 역삼로180, 3층3E" />
          <Row label="사업자등록번호" content="694-86-02485" />
          <Row label="통신판매번호" content="2022-서울강남-00470" />
          <Row label="고객센터" content="02-6953-1836" />
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
