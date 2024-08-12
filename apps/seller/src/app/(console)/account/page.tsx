"use client";

import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { Page } from "@/components/page";
import { Popup } from "@/components/popup";
import { Row, RowGrid } from "@/components/row";
import { SmallBorderButton } from "@/components/small-border-button";
import { formatBussinessNumber, formatPhoneNumber } from "@/utils";
import { useAccountStore, useSellerStore } from "@hackathon/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PasswordUpdateForm, PhoneUpdateForm } from "./form";
import { usePatchSeller } from "@/hooks/use-patch-seller";
import { Seller } from "@hackathon/type";

export default function Account() {
  const [changePassword, setChangePassword] = useState(false);
  const [changeMP, setChangeMP] = useState(false);
  const [changeP, setChangeP] = useState(false);

  const seller = useSellerStore((s) => s.seller);
  const account = useAccountStore((s) => s.account);

  const [managerPhoneNumber, setManagerPhoneNumber] = useState("");

  const patchSeller = usePatchSeller();

  useEffect(() => {
    setManagerPhoneNumber(seller?.managerPhoneNumber || "");
  }, [seller?.managerPhoneNumber]);

  return (
    <Page label="계정 정보">
      {changeP && (
        <PhoneUpdateForm
          onClose={() => {
            setChangeP(false);
          }}
        />
      )}
      {changeMP && (
        <Popup
          confirmLabel="저장"
          title="담당자 전화번호 변경"
          onCancel={() => {
            setChangeMP(false);
          }}
          onConfirm={() => {
            patchSeller.patch({ managerPhoneNumber } as Seller).then(() => {
              alert("담당자 전화번호 변경이 완료되었습니다.");
              setChangeMP(false);
            });
          }}
        >
          <Input
            label="담당자 전화번호"
            inputProps={{
              placeholder: "담당자 전화번호를 입력해 주세요.",
              value: managerPhoneNumber,
              type: "number",
              onChange: (e) => setManagerPhoneNumber(e.target.value),
            }}
          />
        </Popup>
      )}
      {changePassword && (
        <PasswordUpdateForm onClose={() => setChangePassword(false)} />
      )}
      <div className="grid grid-cols-2 gap-5">
        <Card title="계정 정보" titleDivier>
          <RowGrid>
            <Row label="이메일 ID" content={account?.email} />
            <Row
              label="비밀번호"
              content="******"
              rightComponent={
                <SmallBorderButton onClick={() => setChangePassword(true)}>
                  변경
                </SmallBorderButton>
              }
            />
            <Row
              label="휴대폰번호"
              content={formatPhoneNumber(account?.phoneNumber || "")}
              rightComponent={
                <SmallBorderButton onClick={() => setChangeP(true)}>
                  변경
                </SmallBorderButton>
              }
            />
          </RowGrid>
        </Card>
        <Card title="담당자 정보" titleDivier>
          <RowGrid>
            <Row label="식당명" content={seller?.name} />
            <Row
              label="담당자 전화번호"
              content={formatPhoneNumber(seller?.managerPhoneNumber || "")}
              rightComponent={
                <SmallBorderButton onClick={() => setChangeMP(true)}>
                  변경
                </SmallBorderButton>
              }
            />
          </RowGrid>
        </Card>
        <Card title="사업자 정보" titleDivier>
          <RowGrid>
            <Row label="상호명" content={seller?.companyName} />
            <Row
              label="사업자 등록번호"
              content={formatBussinessNumber(seller?.companyNumber || "")}
            />
            <Row label="대표자명" content={seller?.ceoName} />
            <Row
              label="사업장 소재지"
              content={seller?.address + " " + seller?.addressDetail}
            />
            <Row
              label="대표자 연락처"
              content={formatPhoneNumber(seller?.ceoPhoneNumber || "")}
            />
          </RowGrid>
        </Card>
        <div className="col-start-2 mt-5 flex justify-end">
          <div className="flex items-end">
            <Link href={"/account/withdrawal"}>탈퇴하기</Link>
          </div>
        </div>
      </div>
    </Page>
  );
}
