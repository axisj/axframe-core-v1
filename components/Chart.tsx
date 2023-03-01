import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as React from "react";

export const CHART_COLORS = [
  "#4572A7",
  "#AA4643",
  "#89A54E",
  "#80699B",
  "#3D96AE",
  "#DB843D",
  "#92A8CD",
  "#A47D7C",
  "#B5CA92",
];

export type ChartType = "line" | "bar" | "stackedBar";

export interface ChartProps {
  chartType: ChartType;
  dataKeys: string[];
  data?: Record<string, any>[];
}

const margin = {
  top: 20,
  bottom: 20,
  right: 20,
  left: 10,
};

export function Chart({ chartType, dataKeys, data }: ChartProps) {
  switch (chartType) {
    case "line":
      return (
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={data} margin={margin}>
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
      );
    case "bar":
      return (
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} margin={margin}>
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
      );
    case "stackedBar":
    default:
      return (
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} margin={margin}>
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
      );
  }
}
