import * as React from "react";
import styled from "@emotion/styled";
import { SMixinFlexRow } from "@core/styles/emotion";
import { css } from "@emotion/react";

export type AvatarSize = "small" | "medium" | "large";

interface StyleProps {
  size: AvatarSize;
}

interface Props extends StyleProps {
  userName?: string;
  profileImgUrl?: string;
  role?: string;
}

const findIconLabel = (name: string): string => {
  if (name) {
    const letter = /[\p{L}\d]/gu.exec(name)?.[0];

    if (letter) {
      return /[a-z]/.test(letter) ? letter.toUpperCase() : letter;
    }
  }

  return "?";
};

function UserAvatar({ userName = "react frame", size = "medium", role }: Props) {
  return (
    <UserAvatarContainer size={size} role={role}>
      <UserAvatarBox size={size}>{findIconLabel(userName)}</UserAvatarBox>
    </UserAvatarContainer>
  );
}

const UserAvatarContainer = styled.div<StyleProps>`
  border-radius: 50%;
  position: relative;
  border: 2px solid ${(p) => p.theme.primary_color};

  ${({ size, theme }) => {
    if (size === "small") {
      return css`
        width: 24px;
        height: 24px;
        background: ${theme.primary_color};
      `;
    }
    if (size === "large") {
      return css`
        width: 56px;
        height: 56px;
        padding: 2px;
      `;
    }
    return css`
      width: 46px;
      height: 46px;
      padding: 2px;
    `;
  }}
`;
const UserAvatarBox = styled.div<StyleProps>`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  ${SMixinFlexRow("center", "center")};
  font-weight: bold;
  color: ${(p) => p.theme.component_background};
  background: ${(p) => p.theme.primary_color};
  line-height: 1.1;

  ${({ size }) => {
    if (size === "small") {
      return css`
        font-size: 14px;
      `;
    }
    if (size === "large") {
      return css`
        font-size: 36px;
      `;
    }
    return css`
      font-size: 24px;
    `;
  }}
`;

export default UserAvatar;
