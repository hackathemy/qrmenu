import { InputLabel } from "@/components/input-label";
import { SmallBorderButton } from "@/components/small-border-button";
import {
  DetailedHTMLProps,
  Fragment,
  ReactNode,
  ThHTMLAttributes,
  useRef,
  useState,
} from "react";
import { MenuManagePopup } from "./menu-manage-popup";
import { useFormContext } from "react-hook-form";
import { Request } from "./page";
import { formatNumber } from "@/utils";

export const MenuManage = ({}) => {
  const [popup, setPopup] = useState(false);
  const form = useFormContext<Request>();
  const groups = form.watch("groups");

  const requires = groups.filter((x) => x.isRequired);
  const optionals = groups.filter((x) => !x.isRequired);

  return (
    <div className="flex flex-col">
      {popup && (
        <MenuManagePopup
          groups={groups}
          onClose={() => {
            setPopup(false);
          }}
        />
      )}
      <div className="flex items-center justify-between mb-3">
        <InputLabel label="가격 및 옵션 추가" required labelBold />
        <SmallBorderButton
          type="button"
          onClick={() => {
            setPopup(true);
          }}
        >
          설정하기
        </SmallBorderButton>
      </div>

      <label className=" mt-5 text-[14px] font-bold">필수옵션</label>
      <TableWrap>
        <thead>
          <tr>
            <TableH className="w-[5%]">#</TableH>
            <TableH className="w-[25%]">옵션 그룹명</TableH>
            <TableH className="w-[25%]">옵션 항목명</TableH>
            <TableH className="w-[25%]">가격</TableH>
            <TableH className="w-[20%]">용량</TableH>
          </tr>
        </thead>
        <tbody>
          {requires.map((x, i) => {
            if (!x.isRequired) {
              return null;
            }
            return (
              <Fragment key={i}>
                {x.items.map((z, y) => {
                  return (
                    <tr key={y}>
                      {y === 0 && (
                        <TableD rowSpan={y === 0 ? x.items.length : 1}>
                          {i + 1}
                        </TableD>
                      )}
                      {y === 0 && (
                        <TableD rowSpan={y === 0 ? x.items.length : 1}>
                          {x.name}
                        </TableD>
                      )}
                      <TableD>{z.name}</TableD>
                      <TableD>
                        {formatNumber(z.price ? parseInt(z.price) : 0)}원
                      </TableD>
                      <TableD>
                        {z.weight}
                        {z.unit}
                      </TableD>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </TableWrap>

      <label className=" mt-5 text-[14px] font-bold">선택옵션</label>
      <TableWrap>
        <thead>
          <tr>
            <TableH className="w-[5%]">#</TableH>
            <TableH className="w-[25%]">옵션 그룹명</TableH>
            <TableH className="w-[25%]">옵션 항목명</TableH>
            <TableH className="w-[25%]">가격</TableH>
            <TableH className="w-[10%]">용량</TableH>
            <TableH className="w-[10%]">최대 선택 수량</TableH>
          </tr>
        </thead>
        <tbody>
          {optionals.map((x, i) => {
            if (x.isRequired) return null;
            return (
              <Fragment key={i}>
                {x.items.map((z, y) => {
                  return (
                    <tr key={y}>
                      {y === 0 && (
                        <TableD rowSpan={y === 0 ? x.items.length : 1}>
                          {i + 1}
                        </TableD>
                      )}
                      {y === 0 && (
                        <TableD rowSpan={y === 0 ? x.items.length : 1}>
                          {x.name}
                        </TableD>
                      )}
                      <TableD>{z.name}</TableD>
                      <TableD>
                        {formatNumber(z.price ? parseInt(z.price) : 0)}원
                      </TableD>
                      <TableD>
                        {z.weight}
                        {z.unit}
                      </TableD>
                      <TableD>
                        {z.quantityMultiple ? z.quantityMax + "개" : "1개"}
                      </TableD>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </TableWrap>
    </div>
  );
};

export const TableWrap = ({ children }: { children: ReactNode }) => {
  return (
    <table cellPadding={0} cellSpacing={0} border={0} className="mt-5">
      {children}
    </table>
  );
};

export const TableH = (
  props: DetailedHTMLProps<
    ThHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  >
) => {
  return (
    <th
      {...props}
      className={`bg-[#f1f1f1] h-[47px] text-center font-normal ${props.className}`}
    />
  );
};

export const TableD = (
  props: DetailedHTMLProps<
    ThHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  >
) => {
  return (
    <td
      {...props}
      className="border-[##EEEEEE] border-b-[1px] border-r-[1px] text-center last-of-type:border-r-0"
    >
      <div className="min-h-[47px] flex items-center justify-center">
        {props.children}
      </div>
    </td>
  );
};
