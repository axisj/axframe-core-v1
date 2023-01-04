import { css } from "@emotion/react";
import { Dropdown, Menu } from "antd";
import * as React from "react";
import styled from "@emotion/styled";
import { AXFIArrowDown } from "@axframe/icon";
import { SMixinFlexRow } from "@core/styles/emotion";
import { alpha } from "styles/palette/colorUtil";
import { useI18n } from "@core/hooks/useI18n";
import { usePageTabStore } from "@core/stores/usePageTabStore";

interface StyleProps {
  visible?: boolean;
}

interface Props extends StyleProps {
  onClickTab: (tabUuid: string, path?: string) => void;
}

function TabItemMore({ onClickTab }: Props) {
  const { currentLanguage } = useI18n();
  const pages = usePageTabStore((s) => s.pages);
  const [visible, setVisible] = React.useState(false);

  const tabItemList = React.useMemo(() => {
    return [...pages].map(([k, v]) => ({ id: k, page: v }));
  }, [pages]);

  return (
    <Dropdown
      overlayClassName={"tab-item-more-dropdown"}
      overlay={
        <Menu
          items={tabItemList.map((tabItem) => ({
            key: tabItem.id,
            label: (
              <div
                onClick={() => {
                  onClickTab(tabItem.id, tabItem.page.path);
                }}
              >
                {tabItem.page.labels?.[currentLanguage]}
              </div>
            ),
          }))}
        />
      }
      trigger={["click"]}
      align={{ targetOffset: [-5, 0] }}
      open={visible}
      onOpenChange={(visible) => setVisible(visible)}
    >
      <TabItemMoreContainer visible={visible}>
        <AXFIArrowDown fontSize={18} />
      </TabItemMoreContainer>
    </Dropdown>
  );
}

const TabItemMoreContainer = styled.div<StyleProps>`
  ${SMixinFlexRow("center", "center")};
  flex: none;
  width: 40px;
  height: 33px;
  padding-bottom: 3px;
  cursor: pointer;
  position: relative;
  color: ${(p) => p.theme.primary_color};

  [role="rfi-icon"] {
    transition: all 0.3s;
    ${({ visible }) => {
      if (visible) {
        return css`
          transform: rotateX(180deg);
        `;
      }
      return css``;
    }};
  }

  &:after {
    content: "";
    display: block;
    position: absolute;
    left: -20px;
    top: 0;
    width: 20px;
    height: 30px;
    ${({ theme }) => {
      return css`
        background: linear-gradient(to right, ${alpha(theme.header_background, 0)}, ${theme.header_background});
      `;
    }}
`;

export default TabItemMore;
