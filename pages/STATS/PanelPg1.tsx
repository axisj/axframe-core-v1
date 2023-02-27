import * as React from "react";
import styled from "@emotion/styled";
import { StatCol, StatTable } from "@core/components/statTable";

interface DtoItem {
  busi?: string;
  stor?: string;
  storCnt?: number;
  children?: Record<string, number>;
}

interface Props {}

function PanelPg1({}: Props) {
  const [colGroups, setColGroups] = React.useState<StatCol[]>([
    { width: 60 },
    { width: 100 },
    { width: 90 },
    { width: 80 },
    { width: 100 },
    { width: 100 },
    { width: 100 },
    { width: 100 },
    { width: 100 },
    { width: 100 },
    { width: 100 },
  ]);
  const [list, setList] = React.useState<DtoItem[]>([
    {
      busi: "DX",
      stor: "수원사업장",
      storCnt: 14,
      children: {
        "01-28": 100,
        "01-27": 90,
        "01-26": 110,
        "01-25": 80,
        "01-24": 70,
        "01-23": 200,
        "01-22": 50,
      },
    },
    {
      busi: "DX",
      stor: "구미사업장",
      storCnt: 10,
      children: {
        "01-28": 100,
        "01-27": 90,
        "01-26": 110,
        "01-25": 80,
        "01-24": 70,
        "01-23": 200,
        "01-22": 50,
      },
    },
    {
      busi: "DS",
      stor: "광주사업장",
      storCnt: 6,
      children: {
        "01-28": 100,
        "01-27": 90,
        "01-26": 110,
        "01-25": 80,
        "01-24": 70,
        "01-23": 200,
        "01-22": 50,
      },
    },
    {
      busi: "DS",
      stor: "광주사업장",
      storCnt: 8,
      children: {
        "01-28": 100,
        "01-27": 90,
        "01-26": 110,
        "01-25": 80,
        "01-24": 70,
        "01-23": 200,
        "01-22": 50,
      },
    },
  ]);

  return (
    <Container>
      <StatTable
        headRowHeight={35}
        bodyRowHeight={34}
        colGroups={colGroups}
        head={[
          {
            children: [
              { label: "부문" },
              { label: "사업장" },
              { label: "식당수" },
              { label: "01월 28일(토)" },
              { label: "01월 27일(금)" },
              { label: "01월 26일(목)" },
              { label: "01월 25일(수)" },
              { label: "01월 24일(화)" },
              { label: "01월 23일(월)" },
              { label: "01월 22일(일)" },
            ],
          },
        ]}
      >
        <tbody>
          {list.map((item, ii) => {
            return (
              <tr key={ii}>
                <td>{item.busi}</td>
                <td>{item.stor}</td>
                <td>{item.storCnt}</td>
                {Object.values(item.children ?? {}).map((d, di) => (
                  <td key={di}>{d}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </StatTable>
    </Container>
  );
}

const Container = styled.div``;

export { PanelPg1 };
