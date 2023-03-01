import * as React from "react";
import styled from "@emotion/styled";
import { toMoney } from "@core/utils/number";
import { ExampleStatItem } from "@core/services/example/ExampleRepositoryInterface";
import { use$STATS$Store } from "./use$STATS$Store";
import { useContainerSize } from "@core/hooks";
import { StatDataGrid } from "@core/components/StatDataGrid";

interface DtoItem extends ExampleStatItem {}

interface Props {}

function StatList1({}: Props) {
  const listData = use$STATS$Store((s) => s.listData);
  const spinning = use$STATS$Store((s) => s.spinning);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  return (
    <Container ref={containerRef}>
      <StatDataGrid<DtoItem>
        width={containerWidth}
        height={containerHeight}
        spinning={spinning}
        headRowHeight={30}
        bodyRowHeight={30}
        colGroups={[
          { width: 100 },
          { width: 90 },
          { width: 80 },
          { width: 120 },
          { width: 120 },
          { width: 130 },
          { width: 120 },
          { width: 100 },
          { width: 100 },
          { width: 100 },
        ]}
        headColumns={[
          {
            children: [
              { label: "부문", rowspan: 2 },
              { label: "기타", colspan: 9 },
            ],
          },
          {
            children: [
              { label: "사업장" },
              { label: "식당수" },
              { label: "sum" },
              { label: "count" },
              { label: "avg" },
              { label: "itemRender" },
              { label: "01월 24일(화)" },
              { label: "01월 23일(월)" },
              { label: "01월 22일(일)" },
            ],
          },
        ]}
        bodyColumns={[
          {
            key: "busi",
            isRowMerge: (p, c) => {
              return p.busi === c.busi;
            },
          },
          {
            key: "stor",
            isRowMerge: (p, c) => {
              return p.busi === c.busi && p.stor === c.stor;
            },
          },
          { key: "storCnt", align: "right" },
          {
            key: "01-28",
            itemRender: (item) => {
              return toMoney(item["01-28"]);
            },
            align: "left",
          },
          { key: "01-27", align: "right" },
          { key: "01-26", align: "right" },
          { key: "01-25", align: "right" },
          { key: "01-24", align: "right" },
          { key: "01-23", align: "right" },
          { key: "01-22", align: "right" },
        ]}
        subtotal={{
          condition: (c, n) => {
            return c.busi !== n.busi;
          },
          columns: [
            {
              colspan: 3,
              label: "소계",
            },
            // { key: "storCnt", align: "right" },
            { key: "01-28", totalType: "sum", align: "right" },
            { key: "01-27", totalType: "count", align: "right" },
            { key: "01-26", totalType: "avg", align: "right" },
            {
              key: "01-25",
              itemRender: (total, item) => {
                return "₩" + toMoney(total.sum * item["01-24"]?.sum);
              },
              align: "right",
            },
            { key: "01-24", totalType: "sum", align: "right" },
            { key: "01-23", totalType: "sum", align: "right" },
            { key: "01-22", totalType: "sum", align: "right" },
          ],
        }}
        total={{
          columns: [
            {
              colspan: 2,
              label: "총계",
            },
            { key: "storCnt", align: "right" },
            { key: "01-28", totalType: "sum", align: "right" },
            { key: "01-27", totalType: "count", align: "right" },
            { key: "01-26", totalType: "avg", align: "right" },
            {
              key: "01-25",
              itemRender: (total) => {
                return "₩" + toMoney(total.sum * 100);
              },
              align: "right",
            },
            { key: "01-24", totalType: "sum", align: "right" },
            { key: "01-23", totalType: "sum", align: "right" },
            { key: "01-22", totalType: "sum", align: "right" },
          ],
        }}
        data={listData}
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
`;

export { StatList1 };