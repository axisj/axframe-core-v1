import styled from "@emotion/styled";
import { Button } from "antd";
import { IconText, ProgramTitle } from "@core/components/common";
import * as React from "react";
import { AXFIListSearch, AXFIRevert } from "@axframe/icon";
import { PageLayout } from "styles/pageStyled";
import { useI18n } from "@core/hooks";
import { ListDataSet } from "./ListDataSet";
import { use$LIST_AND_MODAL$Store } from "./use$LIST_AND_MODAL$Store";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";

interface Props {}
function App({}: Props) {
  const { t } = useI18n();
  const init = use$LIST_AND_MODAL$Store((s) => s.init);
  const reset = use$LIST_AND_MODAL$Store((s) => s.reset);
  const callListApi = use$LIST_AND_MODAL$Store((s) => s.callListApi);

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
        <ProgramTitle icon={<AXFIListSearch />} title={t.pages.example.listAndModal.title}>
          <Button icon={<AXFIRevert />} onClick={handleReset} size='small' type={"ghost"}>
            {t.button.reset}
          </Button>
        </ProgramTitle>

        <ButtonGroup compact></ButtonGroup>
      </Header>

      <ListDataSet />
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export default App;
