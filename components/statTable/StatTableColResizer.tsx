import * as React from "react";
import styled from "@emotion/styled";
import { mouseEventSubscribe } from "@core/utils/event";
import { delay } from "@core/utils/thread/timing";

interface StyledProps {
  hideHandle?: boolean;
}

interface Props extends StyledProps {
  container: React.RefObject<HTMLDivElement>;
  columnIndex: number;
  left: number;
  width: number;
  onChangeWidth: (width: number) => void;
}

function StatTableColResizer({ container, columnIndex, left, width, onChangeWidth }: Props) {
  const resizerRef = React.useRef<HTMLDivElement>(null);

  const onMouseDownResizerHandle = React.useCallback(
    (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, columnIndex: number) => {
      evt.preventDefault();
      evt.stopPropagation();

      const columnSX = container.current?.getBoundingClientRect().left ?? 0;

      mouseEventSubscribe(
        (mousePosition) => {
          const mX = mousePosition.clientX;
          const dx = mX - columnSX - left - 7;
          onChangeWidth(Math.max(dx + width, 50));
        },
        () => {
          // setColumnResizing(false);
          // setColumnWidth(columnIndex);
        }
      );
    },
    [container, left, onChangeWidth, width]
  );

  const onMouseDoubleClick = React.useCallback(
    async (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, columnIndex: number) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (container.current) {
        const headFrozenHTML = container.current.querySelector('[role="rfdg-head-frozen"]')?.innerHTML;
        const headHTML = container.current.querySelector('[role="rfdg-head"]')?.innerHTML;
        const bodyFrozenHTML = container.current.querySelector('[role="rfdg-body-frozen"]')?.innerHTML;
        const bodyHTML = container.current.querySelector('[role="rfdg-body"]')?.innerHTML;
        const targetDiv = document.createElement("div");
        targetDiv.style.position = "fixed";
        targetDiv.style.top = "-9999px";

        targetDiv.innerHTML = `<table><thead>${headFrozenHTML}</thead><tbody>${bodyFrozenHTML}</tbody></table>
<table><thead>${headHTML}</thead><tbody>${bodyHTML}</tbody></table>`;
        const bodyTarget = document.getElementById("root") ?? document.body;
        bodyTarget.append(targetDiv);

        await delay(30);

        const targetTd = targetDiv.querySelector(`tr:last-of-type td[data-column-index="${columnIndex}"]`);

        if (targetTd) {
          // setColumnWidth(columnIndex, targetTd.getBoundingClientRect().width);
          // setColumnWidth(columnIndex);
        }
        targetDiv.remove();
      }
    },
    [container]
  );

  return (
    <Container
      ref={resizerRef}
      style={{ left }}
      onMouseDown={(evt) => onMouseDownResizerHandle(evt, columnIndex)}
      // onDoubleClick={(evt) => onMouseDoubleClick(evt, columnIndex)}
      onClick={(evt) => evt.stopPropagation()}
    />
  );
}

const Container = styled.div<StyledProps>`
  position: absolute;
  top: 0;
  width: 14px;
  height: 100%;
  cursor: col-resize;
  z-index: 2;
  //background: #4fb75f;
`;

export default StatTableColResizer;
