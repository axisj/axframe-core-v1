import * as React from "react";
import styled from "@emotion/styled";
import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { useContainerSize } from "../hooks";

export type ChartJSType = "bar-horizontal" | "bar-vertical";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface ChartJSDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

export interface ChartJSProps {
  chartType: ChartJSType;
  labels: string[];
  datasets: ChartJSDataset[];
}

const footer = (tooltipItems) => {
  let sum = "";

  tooltipItems.forEach(function (tooltipItem) {
    const dataIndex = tooltipItem.dataIndex;
    const data = tooltipItem.dataset.__rawdata__[dataIndex];
    sum = `조사대상: ${data.totCnt}, 조사완료: ${data.cnt}`;
  });
  return sum;
};

export function ChartJS({ chartType, labels, datasets }: ChartJSProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  switch (chartType) {
    case "bar-horizontal":
      const options = {
        indexAxis: "y" as const,
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        scales: {
          x: {
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: {
          // legend: {
          //   position: "right" as const,
          // },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.raw} %`;
              },
              footer: footer,
            },
          },
        },
      };

      return (
        <ChartContainer ref={containerRef}>
          <Bar
            width={containerWidth}
            height={630}
            options={options}
            data={{
              labels,
              datasets: datasets?.map((dataset) => ({
                ...dataset,
              })),
            }}
          />
        </ChartContainer>
      );

    default:
      return null;
  }
}

const ChartContainer = styled.div``;
