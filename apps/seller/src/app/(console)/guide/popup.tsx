import { Checkbox } from "@/components/checkbox";
import { Input } from "@/components/input";
import { InputLabel } from "@/components/input-label";
import { PayItem } from "@/components/pay-item";
import { Popup } from "@/components/popup";
import { QuillEditor } from "@/components/quill-editor";
import { Select } from "@/components/select";
import {
  PaymentCardType,
  PaymentCashType,
  PaymentSmartPayType,
} from "@hackathon-qrmenu/type";
import { Editor } from "@toast-ui/react-editor";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateField } from "./page";

export const UpdateEditorPopoup = ({
  onClose,
  type,
  onUpdate,
  initialValue,
}: {
  type: UpdateField;
  initialValue?: string | null | undefined;
  onUpdate: (html: string) => void;
  onClose: () => void;
}) => {
  const editorRef = useRef<Editor>(null);

  const handleChange = () => {
    onUpdate(editorRef.current?.getInstance().getHTML() || "");
  };

  return (
    <Popup
      bigTitle
      title={
        type === "accessibilityHtml"
          ? "Accessibilitys"
          : type === "parkingHtml"
          ? "Parking"
          : type === "kidsHtml"
          ? "Baby & Kids"
          : "Toilet"
      }
      confirmLabel="저장"
      onCancel={onClose}
      onConfirm={handleChange}
    >
      <InputLabel label="설명" labelBold />

      <QuillEditor initialValue={initialValue} editorRef={editorRef} />
    </Popup>
  );
};

export interface WiFiForm {
  wifiSSID: string;
  wifiKey: string;
}

export const UpdateWiFiPopup = ({
  onClose,
  onUpdate,
  initialValue,
}: {
  initialValue: WiFiForm;
  onUpdate: (initalValue: WiFiForm) => void;
  onClose: () => void;
}) => {
  const form = useForm({ defaultValues: initialValue });
  return (
    <Popup
      bigTitle
      title="Wi-Fi"
      onCancel={() => {
        onClose();
      }}
      onConfirm={form.handleSubmit(onUpdate)}
      confirmLabel="저장"
    >
      <div className="grid gap-y-5">
        <span className="text-[20px] font-bold">
          암호화
          <br />
          WPA/WPA2/WPA3
        </span>
        <Input
          label="SSID(와이파이 ID)"
          inputProps={{
            placeholder: "와이파이 이름을 입력하세요.",

            ...form.register("wifiSSID"),
          }}
        />
        <Input
          label="와이파이 암호"
          inputProps={{
            placeholder: "와이파이 암호를 입력하세요.",
            ...form.register("wifiKey"),
          }}
        />
      </div>
    </Popup>
  );
};

export interface PaymentValues {
  prepayment: boolean | null | undefined;
  paymentCashTypes: PaymentCashType[];
  paymentCardTypes: PaymentCardType[];
  paymentSmartPayTypes: PaymentSmartPayType[];
}

export const UpdatePaymentPopup = ({
  values,
  onChange,
  onClose,
}: {
  values: PaymentValues;
  onClose: () => void;
  onChange: (values: PaymentValues) => void;
}) => {
  const [data, setData] = useState<PaymentValues>(values);

  return (
    <Popup
      bigTitle
      title="Payments"
      onCancel={onClose}
      onConfirm={() => {
        onChange(data);
      }}
      confirmLabel="저장"
    >
      <>
        <span className="text-[20px] font-bold">선불/후불</span>
        <span className="text-[14px] text-[#666] mb-1">
          식당의 후불제, 선불제 정보를 입력해주세요.
        </span>
        <div className="self-start w-[300px]">
          <Select
            options={[
              { label: "선불제", value: "1" },
              { label: "후불제", value: "0" },
            ]}
            selectProps={{
              placeholder: "선택",
              value:
                data.prepayment === null || data.prepayment === undefined
                  ? ""
                  : data.prepayment
                  ? "1"
                  : "0",
              onChange: (e) =>
                setData((prev) => ({
                  ...prev,
                  prepayment: e.target.value === "1" ? true : false,
                })),
            }}
          />
        </div>
        <div className="border-b-[1px]  my-5" />
      </>

      <span className="text-[20px] font-bold">결제 수단</span>
      <span className="text-[14px] text-[#666] mb-1">
        식당에서 사용 가능한 결제 수단을 설정해주세요.
      </span>

      <div className="mt-5" />

      <span className="text-[16px] font-extrabold">현금</span>
      <div className="grid grid-cols-3 gap-y-1 mt-3 mb-5">
        {Object.values(PaymentCashType).map((x) => {
          return (
            <Checkbox
              key={x}
              label={<PayItem type={x} />}
              id={x}
              inputProps={{
                checked: data.paymentCashTypes.includes(x),
                onChange: (e) => {
                  if (e.target.checked) {
                    data.paymentCashTypes.push(x);
                    setData((prev) => ({ ...data }));
                  } else {
                    setData((prev) => ({
                      ...data,
                      paymentCashTypes: [
                        ...prev.paymentCashTypes.filter((z) => z !== x),
                      ],
                    }));
                  }
                },
              }}
            />
          );
        })}
      </div>

      <div className="border-b-[1px]  my-5" />

      <span className="text-[14px] font-extrabold">신용카드</span>
      <div className="grid grid-cols-3 gap-y-1 mt-3 mb-5">
        {Object.values(PaymentCardType).map((x) => {
          return (
            <Checkbox
              key={x}
              label={<PayItem type={x} />}
              id={x}
              inputProps={{
                checked: data.paymentCardTypes.includes(x),
                onChange: (e) => {
                  if (e.target.checked) {
                    data.paymentCardTypes.push(x);
                    setData((prev) => ({ ...data }));
                  } else {
                    setData((prev) => ({
                      ...data,
                      paymentCardTypes: [
                        ...prev.paymentCardTypes.filter((z) => z !== x),
                      ],
                    }));
                  }
                },
              }}
            />
          );
        })}
      </div>

      <div className="border-b-[1px]  my-5" />

      <span className="text-[14px] font-extrabold">스마트페이</span>
      <div className="grid grid-cols-3 gap-y-1 mt-3 mb-5">
        {Object.values(PaymentSmartPayType).map((x) => {
          return (
            <Checkbox
              key={x}
              label={<PayItem type={x} />}
              id={x}
              inputProps={{
                checked: data.paymentSmartPayTypes.includes(x),
                onChange: (e) => {
                  if (e.target.checked) {
                    data.paymentSmartPayTypes.push(x);
                    setData((prev) => ({ ...data }));
                  } else {
                    setData((prev) => ({
                      ...data,
                      paymentSmartPayTypes: [
                        ...prev.paymentSmartPayTypes.filter((z) => z !== x),
                      ],
                    }));
                  }
                },
              }}
            />
          );
        })}
      </div>
    </Popup>
  );
};
