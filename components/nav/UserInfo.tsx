import { css } from "@emotion/react";
import styled from "@emotion/styled";
import UserAvatar from "./UserAvatar";
import { Dropdown, Popover } from "antd";
import * as React from "react";
import { AXFIMoreVertical } from "@axframe/icon";
import { useAppStore, User, useUserStore } from "stores";
import { SMixinFlexRow } from "@core/styles/emotion";
import UserInfoDropdown from "./UserInfoDropdown";
import { useDialog } from "../../hooks/useDialog";

interface StyleProps {
  sideMenuOpened?: boolean;
}
interface Props extends StyleProps {
  me?: User;
  onSignOut?: () => Promise<void>;
}

function UserInfo({}: Props) {
  const sideMenuOpened = useAppStore((s) => s.sideMenuOpened);
  const me = useUserStore((s) => s.me);
  const signOut = useUserStore((s) => s.signOut);
  const { errorDialog } = useDialog();

  const { name, jobTitle } = me ?? {};

  const handleSignOut = React.useCallback(async () => {
    try {
      await signOut();
    } catch (err) {
      await errorDialog(err);
    }
  }, [errorDialog, signOut]);

  return (
    <UserInfoContainer sideMenuOpened={sideMenuOpened}>
      <UserInfoBox sideMenuOpened={sideMenuOpened}>
        {sideMenuOpened ? (
          <>
            <UserAvatar size={"medium"} userName={name} role='avatar' />
            <UserCard>
              <span role='name'>{name}</span>
              <span role='job-title'>{jobTitle}</span>
            </UserCard>
            <Dropdown
              overlay={<UserInfoDropdown onSignOut={handleSignOut} />}
              trigger={["click"]}
              placement={"bottomRight"}
            >
              <DownDownHandle>
                <AXFIMoreVertical />
              </DownDownHandle>
            </Dropdown>
          </>
        ) : (
          <>
            <Popover
              content={<UserInfoDropdown onSignOut={handleSignOut} asPopover />}
              placement={"rightTop"}
              align={{ targetOffset: [0, 8] }}
            >
              <div>
                <UserAvatar size={"small"} userName={name} role='avatar' />
              </div>
            </Popover>
          </>
        )}
      </UserInfoBox>
    </UserInfoContainer>
  );
}

const UserInfoContainer = styled.div<StyleProps>`
  flex: none;
  [role="avatar"] {
    flex: none;
  }

  ${({ sideMenuOpened }) => {
    if (sideMenuOpened) {
      return css`
        padding: 28px 28px 0 28px;
      `;
    }
    return css`
      padding: 20px 0;
    `;
  }}
`;
const UserInfoBox = styled.div<StyleProps>`
  ${SMixinFlexRow("stretch", "center")};
  column-gap: 15px;
  ${({ sideMenuOpened, theme }) => {
    if (sideMenuOpened) {
      return css`
        ${SMixinFlexRow("stretch", "center")};
        border-bottom: 1px solid ${theme.axf_border_color};
        padding-bottom: 32px;
      `;
    }
    return css`
      ${SMixinFlexRow("center", "center")};
      [role="avatar"] {
        cursor: pointer;
      }
    `;
  }}
`;
const UserCard = styled.div`
  flex: 1;
  font-weight: bold;
  line-height: 1.3;
  [role="name"] {
    display: block;
    color: ${(p) => p.theme.text_heading_color};
    font-size: 13px;
    margin-bottom: 2px;
  }
  [role="job-title"] {
    font-size: 11px;
    color: ${(p) => p.theme.text_sub_body_color};
  }
`;
const DownDownHandle = styled.div`
  ${SMixinFlexRow("center", "center")};
  cursor: pointer;
  flex: none;
  font-size: 20px;
  color: ${(p) => p.theme.primary_color};
`;

export default UserInfo;
