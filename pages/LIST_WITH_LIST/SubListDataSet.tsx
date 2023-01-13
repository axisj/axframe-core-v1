import * as React from "react";
import styled from "@emotion/styled";
import { use$LIST_WITH_LIST$Store } from "./use$LIST_WITH_LIST$Store";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { SubListDataGrid } from "./SubListDataGrid";
import { PageLayout } from "styles/pageStyled";

interface Props {}

function SubListDataSet({}: Props) {
  // const setListSelectedRowKey = useLIST_WITH_LISTStore((s) => s.setListSelectedRowKey);
  const flexGrow = use$LIST_WITH_LIST$Store((s) => s.flexGrow);

  const onClickItem = React.useCallback((_params: AXFDGClickParams<ExampleItem>) => {
    // setListSelectedRowKey(params.item.id);
  }, []);

  return (
    <Frame style={{ flex: 2 - flexGrow }}>
      <Header>Title</Header>
      <SubListDataGrid onClick={onClickItem} />
    </Frame>
  );
}

const Frame = styled(PageLayout.FrameColumn)`
  padding-top: 0;
`;
const Header = styled(PageLayout.FrameHeader)``;

export { SubListDataSet };
