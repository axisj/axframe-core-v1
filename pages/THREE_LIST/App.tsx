import * as React from "react";
import styled from "@emotion/styled";
import { ProgramTitle } from "@core/components/common";
import { AXFIRevert } from "@axframe/icon";
import { Button, Form } from "antd";

import { PageLayout } from "styles/pageStyled";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { useI18n, useUnmountEffect } from "@core/hooks";
import { use$THREE_LIST$Store } from "./use$THREE_LIST$Store";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { ListDataGridA } from "./ListDataGridA";
import { ListDataGridB } from "./ListDataGridB";
import { ListDataGridC } from "./ListDataGridC";
import { errorHandling } from "utils/errorHandling";

interface Props {}

function App({}: Props) {
  const { t } = useI18n();

  const init = use$THREE_LIST$Store((s) => s.init);
  const reset = use$THREE_LIST$Store((s) => s.reset);
  const destroy = use$THREE_LIST$Store((s) => s.destroy);
  const listRequestValue = use$THREE_LIST$Store((s) => s.listRequestValue);
  const setRequestValue = use$THREE_LIST$Store((s) => s.setRequestValue);
  const callListApi = use$THREE_LIST$Store((s) => s.callListApi);
  const callSaveApi = use$THREE_LIST$Store((s) => s.callSaveApi);
  const spinning = use$THREE_LIST$Store((s) => s.spinning);

  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const handleReset = React.useCallback(async () => {
    try {
      await reset();
      await callListApi();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi, reset]);

  const [searchForm] = Form.useForm();

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
        <ProgramTitle title={t.pages.example.listWithList.title}>
          <Button icon={<AXFIRevert />} onClick={handleReset} size='small' type={"ghost"}>
            {t.button.reset}
          </Button>
        </ProgramTitle>

        <ButtonGroup compact>
          <Button
            onClick={() => {
              callListApi();
            }}
          >
            {t.button.search}
          </Button>
          <Button
            type={"primary"}
            onClick={() => {
              callSaveApi();
            }}
          >
            {t.button.save}
          </Button>
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

      <Body ref={resizerContainerRef}>
        <Frame>
          <ListDataGridA />
        </Frame>
        <Frame>
          <ListDataGridB />
        </Frame>
        <Frame>
          <ListDataGridC />
        </Frame>
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const Body = styled(PageLayout.FrameRow)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Frame = styled(PageLayout.FrameColumn)``;

export default App;
