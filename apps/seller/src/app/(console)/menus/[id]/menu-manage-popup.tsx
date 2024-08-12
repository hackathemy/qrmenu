import { Checkbox } from "@/components/checkbox";
import { Input } from "@/components/input";
import { Popup } from "@/components/popup";
import { Select } from "@/components/select";
import { SmallBorderButton } from "@/components/small-border-button";
import { Tooltip } from "@/components/tooltip";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  Controller,
  useFormContext,
} from "react-hook-form";
import { Group, Request } from "./page";
import { Switch } from "@/components/switch";
import { formatNumber } from "@/utils";
import { Drag } from "@/components/drag";

export const MenuManagePopup = ({
  onClose,
  groups,
}: {
  onClose?: () => void;
  groups: Group[];
}) => {
  const parentForm = useFormContext<Request>();

  const form = useForm({
    defaultValues: {
      groups: groups.sort((a, b) =>
        b.isRequired ? 1 : !a.isRequired && !b.isRequired ? 0 : -1
      ),
    },
  });

  const { fields, append, remove, swap } = useFieldArray({
    control: form.control,
    name: "groups",
  });

  const requireds = fields.filter((x) => x.isRequired);
  const optionals = fields.filter((x) => !x.isRequired);

  return (
    <FormProvider {...form}>
      <Popup
        confirmLabel="저장"
        minWidth="min-w-[1000px]"
        title="가격 및 옵션 추가"
        bigTitle
        onConfirm={() => {
          parentForm.setValue(
            "groups",
            form
              .getValues("groups")
              .map((x) => {
                if (!x.isDefault) {
                  x.items = x.items.filter((x) => x.name);
                }
                x.items = x.items.map((xy) => {
                  xy.price = xy.price ? xy.price : "0";
                  return xy;
                });

                return x;
              })
              .filter((x) => (x.isDefault ? true : x.name && x.items.length))
          );
          if (onClose) {
            onClose();
          }
        }}
        onCancel={onClose}
      >
        <div className="mb-10">
          <OptionContainer
            label="필수 옵션"
            tooltipComponent={
              <Tooltip
                message={
                  <>
                    필수옵션은 처음 입력한 옵션 항목이 기본값으로 노출됩니다.
                    <br />
                    필수옵션은 중복 선택이 불가합니다.
                  </>
                }
              />
            }
          >
            {requireds.map((x, i) => {
              const realIndex = fields.findIndex((z) => x.id === z.id);
              if (i === 0) {
                return (
                  <OptionItem
                    key={x.id}
                    number={i + 1}
                    index={realIndex}
                    data={x}
                    onDelete={() => {
                      remove(realIndex);
                    }}
                  />
                );
              }
              return (
                <Drag
                  key={x.id}
                  index={realIndex}
                  id={x.id}
                  move={(a, b) => {
                    swap(a, b);
                  }}
                  type="group-a"
                >
                  <OptionItem
                    number={i + 1}
                    index={realIndex}
                    data={x}
                    key={x.id}
                    onDelete={() => {
                      remove(realIndex);
                    }}
                  />
                </Drag>
              );
            })}
          </OptionContainer>
          <OptionAddButton
            onClick={() => {
              append({
                isDefault: false,
                isRequired: true,
                isFree: false,
                name: "",
                items: [
                  {
                    price: "",
                    weight: "",
                    quantityMax: "",
                    quantityMultiple: false,
                    unit: "g",
                    name: "",
                  },
                ],
              });
            }}
          >
            필수 옵션 그룹 추가
          </OptionAddButton>
        </div>
        <div>
          <OptionContainer
            label="선택 옵션"
            tooltipComponent={
              <Tooltip message={<>선택 옵션은 중복 선택할 수 있습니다.</>} />
            }
          >
            {optionals.map((x, i) => {
              const realIndex = fields.findIndex((z) => x.id === z.id);
              return (
                <Drag
                  key={x.id}
                  index={realIndex}
                  id={x.id}
                  move={(a, b) => {
                    swap(a, b);
                  }}
                  type="group-b"
                >
                  <OptionItem
                    number={i + 1}
                    index={realIndex}
                    data={x}
                    key={x.id}
                    onDelete={() => {
                      remove(realIndex);
                    }}
                  />
                </Drag>
              );
            })}
          </OptionContainer>
          <OptionAddButton
            onClick={() => {
              append({
                isDefault: false,
                isRequired: false,
                isFree: false,
                name: "",
                items: [
                  {
                    price: "",
                    weight: "",
                    quantityMax: "",
                    quantityMultiple: false,
                    unit: "g",
                    name: "",
                  },
                ],
              });
            }}
          >
            선택 옵션 그룹 추가
          </OptionAddButton>
        </div>
      </Popup>
    </FormProvider>
  );
};

export const OptionContainer = ({
  children,
  label,
  tooltipComponent,
}: {
  tooltipComponent: ReactNode;
  children: ReactNode;
  label: ReactNode;
}) => {
  return (
    <div className=" flex flex-col">
      <div className="flex items-center my-3">
        <label className="font-bold text-[20px]">{label}</label>
        {tooltipComponent}
      </div>
      {children}
    </div>
  );
};

export const OptionItem = ({
  data,
  index,
  onDelete,
  number,
}: {
  number: number;
  onDelete: () => void;
  index: number;
  data: Group;
}) => {
  const form = useFormContext<Request>();

  const [opened, setOpened] = useState(data.isDefault);

  const { fields, append, remove, update, swap } = useFieldArray({
    control: form.control,
    name: `groups.${index}.items`,
  });

  const isFree = form.watch(`groups.${index}.isFree`);
  const isDefault = form.watch(`groups.${index}.isDefault`);

  useEffect(() => {
    if (isFree) {
      fields.forEach((x, i) => update(i, { ...x, price: "" }));
    }
  }, [isFree]);

  return (
    <div className="border-[1px] rounded-xl flex p-5 flex-col mb-5">
      <div className="flex items-center">
        {!isDefault && (
          <Image
            width={24}
            height={24}
            src={"/menu.png"}
            alt="Menu"
            className="mr-3"
          />
        )}

        <label className="w-[100px] text-[14px]">#{number} 옵션 그룹명</label>
        <div className="flex-1 max-w-[300px]">
          <Input
            inputProps={{
              placeholder: "옵션 그룹명을 입력해 주세요.",
              ...form.register(`groups.${index}.name`),
            }}
          />
        </div>

        <div className="mx-2">
          {data.isDefault && (
            <span className="text-[#666] text-[12px]">
              ※기본 필수 옵션입니다. 삭제가 불가능합니다.
            </span>
          )}

          {!data.isDefault && (
            <Checkbox
              id={`groups-${index}-free`}
              label="무료 옵션"
              inputProps={{
                ...form.register(`groups.${index}.isFree`),
              }}
            />
          )}
        </div>

        <div className="ml-auto" />

        <Image
          onClick={(e) => {
            setOpened((prev) => !prev);
          }}
          className="cursor-pointer"
          src={opened ? "/up.png" : "/open.png"}
          width={24}
          height={24}
          alt="Open"
        />

        {!data.isDefault && (
          <SmallBorderButton type="button" onClick={onDelete} className="ml-2">
            삭제
          </SmallBorderButton>
        )}
      </div>
      {opened && (
        <div className="flex">
          <div className="w-[100px]" />
          <div className="flex flex-1 flex-col mt-5 items-stretch">
            {fields.map((x, i) => {
              return (
                <Drag
                  key={x.id}
                  index={i}
                  id={x.id}
                  move={(a, b) => {
                    swap(a, b);
                  }}
                  type="group-a"
                >
                  <OptionItemInner
                    groupIndex={index}
                    index={i}
                    isFree={isFree}
                    isRequired={data.isRequired}
                    onDelete={
                      i !== 0
                        ? () => {
                            remove(i);
                          }
                        : undefined
                    }
                  />
                </Drag>
              );
            })}
            <OptionAddButton
              onClick={() => {
                append({
                  price: "",
                  weight: "",
                  quantityMax: "",
                  quantityMultiple: false,
                  unit: "g",
                  name: "",
                });
              }}
            >
              옵션 항목 추가
            </OptionAddButton>
          </div>
        </div>
      )}
    </div>
  );
};

export const OptionItemInner = ({
  onDelete,
  index,
  groupIndex,
  isRequired,
  isFree,
}: {
  isFree: boolean;
  isRequired: boolean;
  groupIndex: number;
  index: number;
  onDelete?: () => void;
}) => {
  const form = useFormContext<Request>();

  const multi = form.watch(
    `groups.${groupIndex}.items.${index}.quantityMultiple`
  );

  useEffect(() => {
    if (!multi) {
      form.setValue(`groups.${groupIndex}.items.${index}.quantityMax`, "");
    }
  }, [multi]);

  return (
    <div className="border-[1px] rounded-md flex p-5 mb-3 ">
      <div className="flex flex-col mt-2">
        <Image
          width={24}
          height={24}
          src={"/menu.png"}
          alt="Menu"
          className="mr-3"
        />

        {onDelete && (
          <button type="button" className="mt-5" onClick={onDelete}>
            <Image src="/trash.png" width={24} height={24} alt="trash" />
          </button>
        )}
      </div>

      <div className="ml-5 grid gap-y-2 grid-flow-row auto-rows-auto">
        <div className="flex items-center">
          <label className="text-[14px] w-[80px]">옵션항목명</label>
          <div className="ml-2 flex items-center">
            <Input
              inputProps={{
                ...form.register(`groups.${groupIndex}.items.${index}.name`),
              }}
            />
          </div>
        </div>

        <div className="flex items-center">
          <label className="text-[14px] w-[80px]">가격</label>
          <div className="ml-2 flex items-center">
            <Controller
              control={form.control}
              name={`groups.${groupIndex}.items.${index}.price`}
              render={({ field: { onChange, name, value } }) => {
                return (
                  <Input
                    inputProps={{
                      disabled: isFree,
                      value: value ? formatNumber(parseInt(value)) : "",
                      onChange: (e) =>
                        onChange(e.target.value.replaceAll(",", "")),
                    }}
                  />
                );
              }}
            />
            <span className="ml-2 text-[14px]">원</span>
          </div>
        </div>

        <div className="flex items-center">
          <label className="text-[14px] w-[80px]">용량</label>
          <div className="ml-2 flex items-center">
            <Input
              inputProps={{
                type: "number",
                ...form.register(`groups.${groupIndex}.items.${index}.weight`),
              }}
            />
            <div className="flex items-center ml-5">
              <span className="text-[14px] mr-2">단위</span>

              <Select
                options={[
                  { label: "Kg", value: "kg" },
                  { label: "g", value: "g" },
                  { label: "l", value: "l" },
                  { label: "ml", value: "ml" },
                ]}
                selectProps={{
                  ...form.register(`groups.${groupIndex}.items.${index}.unit`),
                }}
              />
            </div>
          </div>
        </div>

        {!isRequired && (
          <div className="flex items-center">
            <label className="text-[14px] w-[80px]">개수</label>
            <div className="ml-2 flex items-center flex-nowrap">
              <span className={`mr-2 text-[12px]`}>복수 수량 선택</span>
              <Switch
                value={multi}
                onChange={(v) => {
                  form.setValue(
                    `groups.${groupIndex}.items.${index}.quantityMultiple`,
                    v
                  );
                }}
              />
              <div className="flex items-center ml-5">
                <span className="text-[14px] mr-2">최대</span>
                <div className="ml-2 flex items-center">
                  <Input
                    inputProps={{
                      type: "number",
                      disabled: !multi,
                      ...form.register(
                        `groups.${groupIndex}.items.${index}.quantityMax`
                      ),
                    }}
                  />
                  <span className="ml-2 text-[14px]">개</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const OptionAddButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <button className="flex items-center mt-3" onClick={onClick} type="button">
      <Image src={"/add-outline.png"} width={21} height={21} alt="Circle" />
      <span className="font-bold ml-2">{children}</span>
    </button>
  );
};
