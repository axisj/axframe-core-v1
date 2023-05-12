import * as React from "react";
import styled from "@emotion/styled";
import { ProgramTitle } from "@core/components/common";
import { AXFIRevert } from "@axframe/icon";
import { Button, Form, Tabs } from "antd";
import { PageLayout } from "styles/pageStyled";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { useI18n, useUnmountEffect } from "@core/hooks";
import { PanelType, use$STATS$Store } from "./use$STATS$Store";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { PanelIndex } from "./PanelIndex";
import { errorHandling } from "utils/errorHandling";

interface Props {}

function App({}: Props) {
  const { t } = useI18n();

  const init = use$STATS$Store((s) => s.init);
  const reset = use$STATS$Store((s) => s.reset);
  const destroy = use$STATS$Store((s) => s.destroy);
  const callListApi = use$STATS$Store((s) => s.callListApi);
  const listRequestValue = use$STATS$Store((s) => s.listRequestValue);
  const setRequestValue = use$STATS$Store((s) => s.setRequestValue);
  const spinning = use$STATS$Store((s) => s.spinning);
  const activeTabKey = use$STATS$Store((s) => s.activeTabKey);
  const setActiveTabKey = use$STATS$Store((s) => s.setActiveTabKey);

  const [searchForm] = Form.useForm();

  const handleReset = React.useCallback(async () => {
    try {
      reset();
      await callListApi();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi, reset]);

  const handleSearch = React.useCallback(async () => {
    try {
      await callListApi();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi]);

  const params = React.useMemo(
    () =>
      [
        {
          placeholder: t.pages.example.form.area.label,
          name: "select1",
          type: SearchParamType.SELECT,
          options: t.pages.example.form.area.options,
        },
        {
          placeholder: t.pages.example.form.cnsltHow.label,
          name: "select2",
          type: SearchParamType.SELECT,
          options: t.pages.example.form.cnsltHow.options,
        },
        {
          placeholder: t.pages.example.form.cnsltDt.label,
          name: "timeRange",
          type: SearchParamType.TIME_RANGE,
        },
      ] as IParam[],
    [t]
  );

  useDidMountEffect(() => {
    (async () => {
      try {
        await init();
        await callListApi();
      } catch (e) {
        await errorHandling(e);
      }
    })();
  });

  useUnmountEffect(() => {
    destroy();
  });

  return (
    <Container stretch role={"page-container"}>
      <Header>
        <ProgramTitle title={t.pages.example.stats.title}>
          <Button icon={<AXFIRevert />} onClick={handleReset} size='small' type={"ghost"}>
            {t.button.reset}
          </Button>
        </ProgramTitle>

        <ButtonGroup compact>
          <Button onClick={handleSearch}>{t.button.search}</Button>
        </ButtonGroup>
      </Header>

      <PageSearchBar>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value) => setRequestValue(value)}
          onSearch={handleSearch}
          spinning={spinning}
          disableFilter
        />
      </PageSearchBar>

      <PageTabBar>
        <Tabs
          items={[
            {
              key: "pg1",
              label: t.pages.example.stats.tabs.pg1,
            },
            {
              key: "pg2",
              label: t.pages.example.stats.tabs.pg2,
            },
          ]}
          onChange={(key) => setActiveTabKey(key as PanelType)}
          activeKey={activeTabKey}
        />
      </PageTabBar>

      <PanelIndex contentType={activeTabKey} />
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const PageTabBar = styled(PageLayout.PageTabBar)``;

export default App;
