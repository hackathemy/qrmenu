"use client";

import { Input } from "@/components/input";
import { InputLabel } from "@/components/input-label";
import { OpenTimes } from "@/components/open-time";
import { Popup } from "@/components/popup";
import { QuillEditor } from "@/components/quill-editor";
import { Select } from "@/components/select";
import { SmallBorderButton } from "@/components/small-border-button";
import { TimeManage } from "@/components/time-manage";
import { getOpenTimeLabel, openTimeToObject, openTimeToString } from "@/utils";
import { OpenTimeObject, OpenTimeType } from "@hackathon-qrmenu/type";
import { Editor } from "@toast-ui/react-editor";
import { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDaumPostcodePopup } from "react-daum-postcode";

export const IntroductipnUpdatePopup = ({
  onClose,
  onUpdate,
  initialValue,
}: {
  initialValue?: string | null | undefined;
  onUpdate: (html: string) => void;
  onClose: () => void;
}) => {
  const editorRef = useRef<Editor>(null);

  const handleChange = () => {
    onUpdate(editorRef.current?.getInstance().getHTML() || "");
  };

  return (
    <Popup confirmLabel="저장" onCancel={onClose} onConfirm={handleChange}>
      <InputLabel label="식당 소개" required labelBold />
      <span className="mb-2.5">
        식당에 대한 간단한 소개를 작성해보세요. 해당 내용은 메인화면의 식당
        소개영역에 나타납니다.
      </span>

      <QuillEditor initialValue={initialValue} editorRef={editorRef} />
    </Popup>
  );
};

export const PrepaymentUpdatePopup = ({
  onClose,
  onUpdate,
  initialValue,
}: {
  initialValue?: boolean | null;
  onUpdate: (s: boolean) => void;
  onClose: () => void;
}) => {
  const [value, setValue] = useState(
    initialValue === null ? "" : initialValue ? "1" : "0"
  );

  const handleChange = () => {
    onUpdate(value === "1");
  };

  return (
    <Popup confirmLabel="저장" onCancel={onClose} onConfirm={handleChange}>
      <InputLabel label="선불/후불" required labelBold />
      <Select
        options={[
          { label: "선불제", value: "1" },
          { label: "후불제", value: "0" },
        ]}
        selectProps={{
          placeholder: "선택",
          value,
          onChange: (e) => setValue(e.target.value),
        }}
      />
    </Popup>
  );
};

export interface InforUpdatePopupFormValue {
  name: string;
  contact: string;
  address: string;
  addressDetail: string;
}

export const InforUpdatePopup = ({
  onClose,
  onUpdate,
  initialValue,
}: {
  initialValue?: InforUpdatePopupFormValue;
  onUpdate: (value: InforUpdatePopupFormValue) => void;
  onClose: () => void;
}) => {
  const form = useForm({
    defaultValues: initialValue,
  });

  const open = useDaumPostcodePopup();

  return (
    <Popup
      confirmLabel="저장"
      onCancel={onClose}
      onConfirm={form.handleSubmit(onUpdate)}
    >
      <div className="grid gap-y-5">
        <Input
          labelBold
          label="식당명"
          required
          inputProps={{ placeholder: "", ...form.register("name") }}
        />
        <Input
          labelBold
          label="식당 전화번호"
          required
          inputProps={{ placeholder: "", ...form.register("contact") }}
        />
        <div className="grid gap-y-2.5">
          <Input
            labelBold
            label="식당 주소"
            labelComponent={
              <SmallBorderButton
                className="ml-3"
                type="button"
                onClick={() => {
                  open({
                    onComplete: (data) => {
                      let fullAddress = data.address;
                      let extraAddress = "";

                      if (data.addressType === "R") {
                        if (data.bname !== "") {
                          extraAddress += data.bname;
                        }
                        if (data.buildingName !== "") {
                          extraAddress +=
                            extraAddress !== ""
                              ? `, ${data.buildingName}`
                              : data.buildingName;
                        }
                        fullAddress +=
                          extraAddress !== "" ? ` (${extraAddress})` : "";
                      }
                      form.setValue("address", fullAddress);
                      form.setValue("addressDetail", "");
                    },
                  });
                }}
              >
                주소찾기
              </SmallBorderButton>
            }
            required
            inputProps={{
              placeholder: "주소를 입력해주세요.",
              ...form.register("address"),
            }}
          />
          <Input
            inputProps={{
              placeholder: "추가 주소를 입력해주세요.",
              ...form.register("addressDetail"),
            }}
          />
        </div>
      </div>
    </Popup>
  );
};

const initialOpenTimeValues: OpenTimeObject = {
  start: "",
  end: "",
  break: false,
  breakStart: "",
  breakEnd: "",
};

export const ChangeTimePopup = ({
  onClose,
  onUpdate,
  initialValue,
}: {
  onClose: () => void;
  onUpdate: (str: string) => void;
  initialValue: string;
}) => {
  const [type, setType] = useState(OpenTimeType.EVERYDAY);
  const [data, setData] = useState<OpenTimeObject[]>([]);

  useEffect(() => {
    const [type, data] = openTimeToObject(initialValue);
    setData(data);
    setType(type);
  }, [initialValue]);

  const renderLabel = (type: OpenTimeType, data: OpenTimeObject[]) => {
    return (
      <>
        {
          //data.map()
        }
      </>
    );
  };

  return (
    <Popup
      confirmLabel="저장"
      onCancel={onClose}
      onConfirm={() => {
        onUpdate(openTimeToString(type, data));
      }}
    >
      <div className="grid gap-y-5">
        <InputLabel label="영업시간 설정" required labelBold />
        <div className="flex">
          <Select
            options={[
              { label: "매일", value: OpenTimeType.EVERYDAY },
              { label: "주중/주말", value: OpenTimeType.WEEK },
              { label: "요일별", value: OpenTimeType.DAY },
            ]}
            selectProps={{
              placeholder: "선택",
              value: type,
              onChange: (e) => {
                const to = e.target.value as OpenTimeType;
                setType(to);
                if (to === OpenTimeType.EVERYDAY) {
                  setData([initialOpenTimeValues]);
                } else if (to === OpenTimeType.WEEK) {
                  setData([initialOpenTimeValues, initialOpenTimeValues]);
                } else {
                  setData([
                    initialOpenTimeValues,
                    initialOpenTimeValues,
                    initialOpenTimeValues,
                    initialOpenTimeValues,
                    initialOpenTimeValues,
                    initialOpenTimeValues,
                    initialOpenTimeValues,
                  ]);
                }
              },
            }}
          />
          <div className="flex-1 ml-10 flex flex-col max-h-[290px] overflow-y-auto">
            {data.map((x, i) => {
              return (
                <Fragment key={i}>
                  {i !== 0 && <div className="my-5 border-b-[1px]" />}
                  <TimeManage
                    index={i}
                    key={i}
                    value={x}
                    onChange={(value) => {
                      data[i] = value;
                      setData([...data]);
                    }}
                    label={getOpenTimeLabel(type, x, i)}
                  />
                </Fragment>
              );
            })}
          </div>
        </div>

        <div className="border-[#ddd] border-[1px] rounded-md p-5 bg-[#fafafa]">
          <span className="text-[16px]/[32px]">
            <OpenTimes value={openTimeToString(type, data)} />
          </span>
        </div>
      </div>
    </Popup>
  );
};
