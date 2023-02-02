import * as React from "react";
import styled from "@emotion/styled";
import { mouseEventSubscribe } from "@core/utils/event";
import { IMousePosition } from "@core/utils/types";

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
  onResize: (flexGlow: number) => void;
}

function RowResizer({ containerRef, onResize }: Props) {
  const handleMove = React.useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const { top, height } = containerRef.current.getBoundingClientRect();

    mouseEventSubscribe((mousePosition: IMousePosition) => {
      const dx = mousePosition.clientY - top;
      onResize((dx * 2) / height);
    });
  }, [containerRef, onResize]);

  return <Container onMouseDown={handleMove} />;
}

const Container = styled.div`
  flex: none;
  position: relative;
  height: 1px;
  width: 100%;
  background: ${(p) => p.theme.border_color_split};
  z-index: ${(p) => p.theme.ui_drag_zindex};
  &:before {
    cursor: row-resize;
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: -4px;
    width: 100%;
    height: 8px;
  }
`;

export { RowResizer };
