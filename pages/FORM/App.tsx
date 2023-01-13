import styled from "@emotion/styled";
import { Button } from "antd";
import { IconText, Loading } from "@core/components/common";
import * as React from "react";
import { AXFIWriteForm } from "@axframe/icon";
import { PageLayout } from "styles/pageStyled";
import { useI18n } from "@core/hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { FormSet } from "./FormSet";
import { use$FORM$Store } from "./use$FORM$Store";

interface Props {}
function App({}: Props) {
  const { t } = useI18n();
  const init = use$FORM$Store((s) => s.init);
  const reset = use$FORM$Store((s) => s.reset);
  const saveSpinning = use$FORM$Store((s) => s.saveSpinning);

  useDidMountEffect(() => {
    init();
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

      <FormSet />

      <Loading active={saveSpinning} />
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export default App;
