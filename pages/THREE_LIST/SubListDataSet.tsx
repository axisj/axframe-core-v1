import * as React from "react";
import styled from "@emotion/styled";
import { use$THREE_LIST$Store } from "./use$THREE_LIST$Store";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { SubListDataGrid } from "./SubListDataGrid";
import { PageLayout } from "styles/pageStyled";

interface DtoItem extends ExampleItem {}

interface Props {}

function SubListDataSet({}: Props) {
  // const setListSelectedRowKey = useLIST_WITH_LISTStore((s) => s.setListSelectedRowKey);
  const flexGrow = use$THREE_LIST$Store((s) => s.flexGrow);

  const onClickItem = React.useCallback((_params: AXFDGClickParams<DtoItem>) => {
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
