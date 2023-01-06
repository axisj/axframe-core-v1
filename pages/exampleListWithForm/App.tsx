import * as React from "react";
import styled from "@emotion/styled";
import { ColResizer, IconText } from "@core/components/common";
import { AXFIDefaultProgram } from "@axframe/icon";
import { Button } from "antd";

import { PageLayout } from "styles/pageStyled";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { useI18n } from "@core/hooks/useI18n";
import { useExampleListWithFormStore } from "./useExampleListWithFormStore";
import { ListDataSet } from "./ListDataSet";
import { FormSet } from "./FormSet";

interface Props {}

function App({}: Props) {
  const { t } = useI18n();

  const init = useExampleListWithFormStore((s) => s.init);
  const reset = useExampleListWithFormStore((s) => s.reset);
  const callListApi = useExampleListWithFormStore((s) => s.callListApi);
  const setFlexGrow = useExampleListWithFormStore((s) => s.setFlexGrow);
  const setFormActive = useExampleListWithFormStore((s) => s.setFormActive);
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

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
        <IconText icon={<AXFIDefaultProgram />}>{t.pages.example.listWithForm.title}</IconText>

        <ButtonGroup compact>
          <Button size='small' onClick={setFormActive}>
            {t.button.addNew}
          </Button>
          <Button size='small' onClick={handleReset}>
            {t.button.reset}
          </Button>
        </ButtonGroup>
      </Header>

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
const Body = styled(PageLayout.FrameRow)`
  padding: 0;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export default App;
