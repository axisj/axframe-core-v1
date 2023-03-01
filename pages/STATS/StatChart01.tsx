import * as React from "react";
import { use$STATS$Store } from "./use$STATS$Store";
import { Loading } from "@core/components/common";
import { Tabs } from "antd";
import styled from "@emotion/styled";
import { SMixinFlexRow } from "@core/styles/emotion";
import { PageLayout } from "styles/pageStyled";
import { Chart, ChartType } from "@core/components/Chart";

interface Props {}

const dates = ["01-28", "01-27", "01-26", "01-25", "01-24", "01-23", "01-22"];

function StatChart01({}: Props) {
  const listData = use$STATS$Store((s) => s.listData);
  const spinning = use$STATS$Store((s) => s.spinning);

  const [chartType, setChartType] = React.useState<ChartType>("line");

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
      <ChartWrap>
        <div>
          <Chart chartType={chartType} dataKeys={dataKeys} data={chartData} />
        </div>
      </ChartWrap>
      <Tabs
        tabPosition={"right"}
        activeKey={chartType}
        onChange={(chartType) => setChartType(chartType as ChartType)}
        items={[
          { label: "Line", key: "line" },
          { label: "Bar", key: "bar" },
          { label: "StackedBar", key: "stackedBar" },
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

  .ant-tabs-content-holder {
    width: 16px;
  }
`;

const ChartWrap = styled(PageLayout.ContentBox)`
  flex: 1;
  padding: 0;
  position: relative;
  background: ${(p) => p.theme.component_background};
  > div {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

export { StatChart01 };
