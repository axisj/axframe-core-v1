import * as React from "react";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { use$STATS$Store } from "./use$STATS$Store";
import { Loading } from "@core/components/common";
import { Tabs } from "antd";
import styled from "@emotion/styled";
import { SMixinFlexRow } from "@core/styles/emotion";
import { CHART_COLORS } from "@types";

interface Props {}

const dates = ["01-28", "01-27", "01-26", "01-25", "01-24", "01-23", "01-22"];

function StatChart01({}: Props) {
  const listData = use$STATS$Store((s) => s.listData);
  const spinning = use$STATS$Store((s) => s.spinning);

  const [chartType, setChartType] = React.useState("line");

  const { chartData, dataKeys } = React.useMemo(() => {
    const map: Record<string, any> = {};
    const dataKeysMap: Record<string, any> = {};

    listData.forEach((data) => {
      dates.forEach((dt) => {
        const dataKey = data.busi + ", " + data.stor;
        if (dt in map) {
          map[dt][dataKey] = (map[dt][dataKey] ?? 0) + data[dt];
        } else {
          map[dt] = {
            [dataKey]: data[dt],
          };
        }

        if (!(dataKey in dataKeysMap)) {
          dataKeysMap[dataKey] = true;
        }
      });
    });

    return {
      chartData: Object.entries(map).map(([k, v]) => {
        return {
          name: k,
          ...v,
        };
      }),
      dataKeys: Object.keys(dataKeysMap),
    };
  }, [listData]);

  return (
    <Container>
      {chartType === "line" && (
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              bottom: 10,
              right: 10,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />

            {dataKeys.map((dataKey, di) => (
              <Line
                key={dataKey}
                type='monotone'
                dataKey={dataKey}
                stroke={CHART_COLORS[di % CHART_COLORS.length]}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
      {chartType === "bar" && (
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              bottom: 10,
              right: 10,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />

            {dataKeys.map((dataKey, di) => (
              <Bar key={dataKey} dataKey={dataKey} fill={CHART_COLORS[di % CHART_COLORS.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
      {chartType === "bar-stacked" && (
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              bottom: 10,
              right: 10,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />

            {dataKeys.map((dataKey, di) => (
              <Bar key={dataKey} dataKey={dataKey} stackId={"a"} fill={CHART_COLORS[di % CHART_COLORS.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
      <Tabs
        tabPosition={"right"}
        activeKey={chartType}
        onChange={setChartType}
        items={[
          { label: "Line", key: "line" },
          { label: "Bar", key: "bar" },
          { label: "StackedBar", key: "bar-stacked" },
        ]}
      />
      <Loading active={spinning} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  ${SMixinFlexRow("stretch", "stretch")};
  position: relative;
`;

export { StatChart01 };
