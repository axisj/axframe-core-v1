import * as React from "react";
import styled from "@emotion/styled";
import { useExampleListWithListStore } from "./useExampleListWithListStore";
import { SMixinFlexColumn, SMixinFlexRow } from "@core/styles/emotion";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { SubListDataGrid } from "./SubListDataGrid";

interface Props {}

function SubListDataSet({}: Props) {
  const setListSelectedRowKey = useExampleListWithListStore((s) => s.setListSelectedRowKey);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<ExampleItem>) => {
      setListSelectedRowKey(params.item.id);
    },
    [setListSelectedRowKey]
  );

  return (
    <Container>
      <Header>Title</Header>
      <SubListDataGrid onClick={onClickItem} />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  flex: 1;
  ${SMixinFlexColumn("stretch", "stretch")};
`;
const Header = styled.div`
  ${SMixinFlexRow("flex-start", "center")};
  line-height: 32px;
  gap: 10px;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
`;

export { SubListDataSet };
