import { css } from "@emotion/react";
import styled from "@emotion/styled";
import * as React from "react";
import { AXFIArrowLogOut } from "@axframe/icon";
import { SMixinFlexColumn } from "@core/styles/emotion";
import { IconText, LabelText } from "@core/components/common";
import { useDialog } from "@core/hooks/useDialog";
import { useUserStore } from "stores";

interface StyleProps {
  asPopover?: boolean;
}

interface Props extends StyleProps {
  onSignOut?: () => Promise<void>;
}

function UserInfoDropdown({ asPopover }: Props) {
  const { errorDialog } = useDialog();
  const signOut = useUserStore((s) => s.signOut);
  const me = useUserStore((s) => s.me);
  const [signOutSpinning, setSignOutSpinning] = React.useState(false);

  const { userNm, email } = me ?? {};

  const handleClickSignOut = React.useCallback(async () => {
    setSignOutSpinning(true);
    try {
      await signOut();
    } catch (err) {
      await errorDialog(err);
    } finally {
      setSignOutSpinning(false);
    }
  }, [errorDialog, setSignOutSpinning, signOut]);

  return (
    <UserInfoDropdownContainer asPopover={asPopover}>
      <LabelText role={"info"} label='User Name'>
        {userNm}
      </LabelText>
      <LabelText role={"info"} label='E-Mail'>
        {email}
      </LabelText>
      <CustomDivider />
      <CustomMenus>
        <IconText
          icon={<AXFIArrowLogOut />}
          iconSize={"15px"}
          onClick={handleClickSignOut}
          block
          loading={signOutSpinning}
        >
          Sign Out
        </IconText>
      </CustomMenus>
    </UserInfoDropdownContainer>
  );
}

const UserInfoDropdownContainer = styled.div<StyleProps>`
  ${SMixinFlexColumn("stretch", "stretch")};
  border-radius: 5px;
  padding: 15px 0 15px 0;
  gap: 15px;

  ${({ asPopover, theme }) => {
    if (asPopover) {
      return css``;
    }
    return css`
      background: ${theme.popover_background};
      box-shadow: ${theme.box_shadow_base};
    `;
  }}
  font-size: 12px;

  [role="info"] {
    padding: 0 20px;
  }
`;

const CustomDivider = styled.div`
  height: 1px;
  width: 100%;
  clear: both;
  background: ${(p) => p.theme.axf_border_color};
`;

const CustomMenus = styled.div`
  padding: 0 20px;
`;

export default UserInfoDropdown;
