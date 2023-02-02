import * as React from "react";
import styled from "@emotion/styled";
import { ListDataGrid } from "./ListDataGrid";
import { use$LIST_WITH_FORM2$Store } from "./use$LIST_WITH_FORM2$Store";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { PageLayout } from "styles/pageStyled";

interface Props {}

function ListDataSet({}: Props) {
  const setListSelectedRowKey = use$LIST_WITH_FORM2$Store((s) => s.setListSelectedRowKey);
  const flexGrow = use$LIST_WITH_FORM2$Store((s) => s.flexGrow);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<ExampleItem>) => {
      setListSelectedRowKey(params.item.id);
    },
    [setListSelectedRowKey]
  );

  return (
    <Frame style={{ flex: flexGrow }}>
      <ListDataGrid onClick={onClickItem} />
    </Frame>
  );
}

const Frame = styled(PageLayout.FrameColumn)`
  padding: 0 15px 30px 30px;
`;

export { ListDataSet };
