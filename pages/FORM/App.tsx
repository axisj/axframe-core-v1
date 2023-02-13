import styled from "@emotion/styled";
import { Button } from "antd";
import { Loading, ProgramTitle } from "@core/components/common";
import * as React from "react";
import { AXFIRevert, AXFIWriteForm } from "@axframe/icon";
import { PageLayout } from "styles/pageStyled";
import { useI18n, useUnmountEffect } from "@core/hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { FormSet } from "./FormSet";
import { use$FORM$Store } from "./use$FORM$Store";

interface Props {}
function App({}: Props) {
  const { t } = useI18n();
  const init = use$FORM$Store((s) => s.init);
  const reset = use$FORM$Store((s) => s.reset);
  const destroy = use$FORM$Store((s) => s.destroy);
  const saveSpinning = use$FORM$Store((s) => s.saveSpinning);

  useDidMountEffect(() => {
    init();
  });

  useUnmountEffect(() => {
    destroy();
  });

  return (
    <Container>
      <Header>
        <ProgramTitle icon={<AXFIWriteForm />} title={t.pages.example.form.title}>
          <Button icon={<AXFIRevert />} onClick={reset} size='small' type={"ghost"}>
            {t.button.reset}
          </Button>
        </ProgramTitle>
        <ButtonGroup compact></ButtonGroup>
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
