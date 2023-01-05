import * as React from "react";
import styled from "@emotion/styled";
import { mouseEventSubscribe } from "@core/utils/event";
import { IMousePosition } from "@core/utils/types";

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
  onResize: (flexGlow: number) => void;
}

function ColResizer({ containerRef, onResize }: Props) {
  const handleMove = React.useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const { left, width } = containerRef.current.getBoundingClientRect();

    mouseEventSubscribe((mousePosition: IMousePosition) => {
      const dx = mousePosition.clientX - left;
      onResize((dx * 2) / width);
    });
  }, [containerRef, onResize]);

  return <Container onMouseDown={handleMove} />;
}

const Container = styled.div`
  flex: none;
  position: relative;
  width: 1px;
  height: 100%;
  cursor: col-resize;
  background: ${(p) => p.theme.border_color_split};
  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: -4px;
    height: 100%;
    width: 8px;
  }
`;

export { ColResizer };
