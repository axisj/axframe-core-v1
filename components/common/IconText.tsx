import { LoadingOutlined } from "@ant-design/icons";
import * as React from "react";
import styled from "@emotion/styled";
import { SMixinFlexRow } from "@core/styles/emotion";
import { css } from "@emotion/react";

type IconPlacement = "left" | "right";

interface StyleProps {
  role?: string;
  iconPlacement?: IconPlacement;
  iconSize?: number | string;
  onClick?: (evt: React.MouseEvent<HTMLAnchorElement>) => void;
  disabled?: boolean;
  active?: boolean;
  block?: boolean;
  loading?: boolean;
}

interface Props extends StyleProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function IconText({
  role,
  iconSize,
  icon,
  iconPlacement,
  onClick,
  children,
  disabled,
  active,
  block,
  loading,
}: Props) {
  const handleClick = React.useCallback(
    (evt: React.MouseEvent<HTMLAnchorElement>) => {
      if (loading || disabled) return;
      onClick?.(evt);
    },
    [disabled, loading, onClick]
  );

  return (
    <IconTextContainer
      role={role}
      onClick={onClick ? handleClick : undefined}
      block={block}
      disabled={disabled}
      active={active}
    >
      {icon && (
        <IconContainer iconSize={iconSize} iconPlacement={iconPlacement}>
          {loading ? <LoadingOutlined spin /> : icon}
        </IconContainer>
      )}
      <TextContainer block={block}>{children}</TextContainer>
    </IconTextContainer>
  );
}

const IconTextContainer = styled.span<StyleProps>`
  ${SMixinFlexRow("flex-start", "center")};
  color: inherit;
  column-gap: 5px;

  & + & {
    margin-left: 5px;
  }

  ${({ block }) => {
    if (!block) {
      return css`
        display: inline-flex;
      `;
    }
    return css``;
  }}
  ${({ onClick, disabled, theme }) => {
    if (onClick && !disabled) {
      return css`
        cursor: pointer;
        color: ${theme.link_color};

        &:hover {
          color: ${theme.link_hover_color};
        }

        &:active {
          color: ${theme.link_active_color};
        }
      `;
    }
    return css``;
  }}
  ${({ disabled }) => {
    if (disabled) {
      return css`
        opacity: 0.5;
        cursor: not-allowed;
      `;
    }
    return css``;
  }}
  ${({ active, theme }) => {
    if (active) {
      return css`
        color: ${theme.link_hover_color};
      `;
    }
    return css``;
  }}
`;
const IconContainer = styled.span<StyleProps>`
  ${SMixinFlexRow("center", "center")};
  flex: none;
  ${({ iconPlacement }) => {
    if (iconPlacement === "right") {
      return css`
        order: 2;
      `;
    }

    return css``;
  }}
  ${({ iconSize }) => {
    if (iconSize) {
      return css`
        font-size: ${typeof iconSize === "number" ? `${iconSize}px` : iconSize};
      `;
    }

    return css``;
  }}
`;
const TextContainer = styled.span<StyleProps>`
  ${({ block }) => {
    if (block) {
      return css`
        flex: 1;
      `;
    }
    return css``;
  }}
`;
