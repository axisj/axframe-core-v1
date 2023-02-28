import * as React from "react";
import styled from "@emotion/styled";
import { StatTable } from "@core/components/statTable";
import { toMoney } from "@core/utils/number";

interface DtoItem {
  busi?: string;
  stor?: string;
  storCnt?: number;
  "01-28"?: number;
  "01-27"?: number;
  "01-26"?: number;
  "01-25"?: number;
  "01-24"?: number;
  "01-23"?: number;
  "01-22"?: number;
}

interface Props {}

const list = [
  {
    busi: "DX",
    stor: "수원사업장",
    storCnt: 14,
    "01-28": 1000,
    "01-27": 90,
    "01-26": 110,
    "01-25": 80,
    "01-24": 70,
    "01-23": 200,
    "01-22": 50,
  },
  {
    busi: "DX",
    stor: "수원사업장",
    storCnt: 14,
    "01-28": 1000,
    "01-27": 90,
    "01-26": 110,
    "01-25": 80,
    "01-24": 70,
    "01-23": 200,
    "01-22": 50,
  },
  {
    busi: "DX",
    stor: "구미사업장",
    storCnt: 10,
    "01-28": 100,
    "01-27": 90,
    "01-26": 110,
    "01-25": 80,
    "01-24": 70,
    "01-23": 200,
    "01-22": 50,
  },
  {
    busi: "DS",
    stor: "광주사업장",
    storCnt: 6,
    "01-28": 100,
    "01-27": 90,
    "01-26": 110,
    "01-25": 80,
    "01-24": 70,
    "01-23": 200,
    "01-22": 50,
  },
  {
    busi: "DS",
    stor: "광주사업장",
    storCnt: 8,
    "01-28": 100,
    "01-27": 90,
    "01-26": 110,
    "01-25": 80,
    "01-24": 70,
    "01-23": 200,
    "01-22": 50,
  },
];

function PanelPg1({}: Props) {
  return (
    <Container>
      <StatTable<DtoItem>
        headRowHeight={35}
        bodyRowHeight={34}
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
              { label: "부문" },
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
            align: "right",
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
              colspan: 2,
              label: "소계",
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
        data={list}
      />
    </Container>
  );
}

const Container = styled.div``;

export { PanelPg1 };
