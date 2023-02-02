import * as React from "react";
import styled from "@emotion/styled";
import { ColResizer, ProgramTitle } from "@core/components/common";
import { AXFIRevert } from "@axframe/icon";
import { Button, Form } from "antd";
import { PageLayout } from "styles/pageStyled";
import { useDidMountEffect, useI18n } from "@core/hooks";
import { use$LIST_WITH_FORM2$Store } from "./use$LIST_WITH_FORM2$Store";
import { ListDataSet } from "./ListDataSet";
import { FormSet } from "./FormSet";
import { SearchParams, SearchParamType } from "@core/components/search";

interface Props {}

function App({}: Props) {
  const { t } = useI18n();

  const init = use$LIST_WITH_FORM2$Store((s) => s.init);
  const reset = use$LIST_WITH_FORM2$Store((s) => s.reset);
  const callListApi = use$LIST_WITH_FORM2$Store((s) => s.callListApi);
  const setFlexGrow = use$LIST_WITH_FORM2$Store((s) => s.setFlexGrow);
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const listRequestValue = use$LIST_WITH_FORM2$Store((s) => s.listRequestValue);
  const setListRequestValue = use$LIST_WITH_FORM2$Store((s) => s.setListRequestValue);
  const listSpinning = use$LIST_WITH_FORM2$Store((s) => s.listSpinning);
  const cancelFormActive = use$LIST_WITH_FORM2$Store((s) => s.cancelFormActive);
  const setFormActive = use$LIST_WITH_FORM2$Store((s) => s.setFormActive);

  const [searchForm] = Form.useForm();

  const handleSearch = React.useCallback(async () => {
    await callListApi();
  }, [callListApi]);

  const params = React.useMemo(
    () => [
      {
        title: t.formItem.counseling.area.label,
        name: "select1",
        type: SearchParamType.SELECT,
        options: t.formItem.counseling.area.options,
      },
      {
        title: t.formItem.counseling.cnsltHow.label,
        name: "select2",
        type: SearchParamType.SELECT,
        options: t.formItem.counseling.cnsltHow.options,
      },
      {
        title: t.formItem.counseling.cnsltDt.label,
        name: "timeRange",
        type: SearchParamType.TIME_RANGE,
      },
    ],
    [t]
  );

  const handleReset = React.useCallback(async () => {
    reset();
    await callListApi();
  }, [callListApi, reset]);

  useDidMountEffect(() => {
    init();
    callListApi();
  });

  return (
    <Container stretch role={"page-container"}>
      <Header>
        <ProgramTitle title={t.pages.example.listWithForm.title}>
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
              cancelFormActive();
              setFormActive();
            }}
          >
            {t.button.addNew}
          </Button>
        </ButtonGroup>
      </Header>

      <PageSearchBar>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value) => setListRequestValue(value)}
          onSearch={handleSearch}
          spinning={listSpinning}
        />
      </PageSearchBar>

      <Body ref={resizerContainerRef}>
        <ListDataSet />
        <ColResizer containerRef={resizerContainerRef} onResize={(flexGlow) => setFlexGrow(flexGlow)} />
        <FormSet />
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const Body = styled(PageLayout.FrameRow)`
  padding: 0;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export default App;
