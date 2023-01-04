import styled from "@emotion/styled";
import { Button } from "antd";
import { IconText, Loading } from "@core/components/common";
import * as React from "react";
import { AXFIWriteForm } from "@axframe/icon";
import { PageLayout } from "styles/pageStyled";
import { useI18n } from "@core/hooks/useI18n";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { ROUTES } from "router/Routes";
import { ExampleFormSet } from "./ExampleFormSet";
import { useExampleFormStore } from "./useExampleFormStore";

interface Props {}
function App({}: Props) {
  const { t } = useI18n();
  const init = useExampleFormStore((s) => s.init);
  const reset = useExampleFormStore((s) => s.reset);
  const saveSpinning = useExampleFormStore((s) => s.saveSpinning);

  useDidMountEffect(() => {
    init(ROUTES.EXAMPLES.children.LIST_DETAIL.children.REGISTRATION.path);
  });

  return (
    <Container>
      <Header>
        <IconText icon={<AXFIWriteForm />}>{t.pages.counseling.registration.title}</IconText>

        <ButtonGroup compact>
          <Button size='small'>{t.button.temporaryStorageList}</Button>
          <Button size='small' onClick={reset}>
            {t.button.reset}
          </Button>
        </ButtonGroup>
      </Header>

      <ExampleFormSet />

      <Loading active={saveSpinning} />
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export default App;
