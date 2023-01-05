import styled from "@emotion/styled";
import { Button } from "antd";
import { IconText } from "@core/components/common";
import * as React from "react";
import { AXFIListSearch } from "@axframe/icon";
import { PageLayout } from "styles/pageStyled";
import { useI18n } from "@core/hooks/useI18n";
import { ExampleListDataSet } from "./ExampleListDataSet";
import { useExampleListStore } from "./useExampleListStore";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";

interface Props {}
function App({}: Props) {
  const { t } = useI18n();
  const init = useExampleListStore((s) => s.init);
  const reset = useExampleListStore((s) => s.reset);
  const callListApi = useExampleListStore((s) => s.callListApi);

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
        <IconText icon={<AXFIListSearch />}>{t.pages.example.list.title}</IconText>

        <ButtonGroup compact>
          <Button size='small' onClick={() => {}}>
            {t.button.excel}
          </Button>
          <Button size='small' onClick={handleReset}>
            {t.button.reset}
          </Button>
        </ButtonGroup>
      </Header>

      <ExampleListDataSet />
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export default App;
