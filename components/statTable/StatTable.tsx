import * as React from "react";
import styled from "@emotion/styled";
import { StatTableProps } from "./types";
import { StatTableTHead } from "./StatTableTHead";
import { StatTableTBody } from "./StatTableTBody";
import { StatTableTFoot } from "./StatTableTFoot";
import { Loading } from "../common";
import { SMixinScrollerStyle } from "../../styles/emotion";
import { StatTableRawBody } from "./StatTableRawBody";
import { StatTableRawFoot } from "./StatTableRawFoot";

function StatTable<T = Record<string, any>>({
  width,
  height,
  className,
  style,
  spinning,
  headRowHeight = 34,
  bodyRowHeight = 34,
  colGroups,
  onChangeColGroups,
  headColumns = [],
  bodyColumns = [],
  subtotal,
  total,
  data = [],
  onClick,
  selectedRowIndex,
  rawBodyData,
  rawTotalData,
}: StatTableProps<T>) {
  const tableWidth = React.useMemo(() => {
    if (Array.isArray(colGroups)) {
      return colGroups.reduce((acc, cur) => {
        return acc + (cur.width ?? 0);
      }, 0);
    }
    return 0;
  }, [colGroups]);

  const { headHeight, bodyHeight, footHeight } = React.useMemo(() => {
    const headHeight = headRowHeight + 1;
    const footHeight = total || rawTotalData ? bodyRowHeight + 1 : 0;
    const bodyHeight = height - headHeight - footHeight;
    return {
      headHeight,
      bodyHeight,
      footHeight,
    };
  }, [bodyRowHeight, headRowHeight, height, rawTotalData, total]);

  const { newData: cdata, totalValues } = React.useMemo(() => {
    const newData = [] as Record<string, any>[];
    let subTotalValues: Record<string, any> = {};
    const totalValues: Record<string, any> = {};

    for (let i = 0; i < data.length; i++) {
      const prevItem = data[i - 1] as T;
      const curItem = data[i] as T;
      const nextItem = data[i + 1] as T;

      const newItem: Record<string, any> = {
        __originValue__: { ...curItem },
      };
      bodyColumns.forEach((bc) => {
        if (!bc.key) return;

        newItem[bc.key] = {
          originValue: curItem[bc.key],
          rowspan: 1,
        };

        if (subtotal?.columns.find((sc) => sc.key === bc.key)) {
          if (bc.key in subTotalValues) {
            subTotalValues[bc.key].sum += curItem[bc.key];
            subTotalValues[bc.key].count += 1;
          } else {
            subTotalValues[bc.key] = {
              sum: curItem[bc.key],
              count: 1,
            };
          }
        }

        if (total?.columns.find((tc) => tc.key === bc.key)) {
          if (bc.key in totalValues) {
            totalValues[bc.key].sum += curItem[bc.key];
            totalValues[bc.key].count += 1;
          } else {
            totalValues[bc.key] = {
              sum: curItem[bc.key],
              count: 1,
            };
          }
        }

        if (prevItem && bc.isRowMerge?.(prevItem, curItem)) {
          const parentIndex = newData[newData.length - 1][bc.key].parentIndex ?? newData.length - 1;
          newData[parentIndex][bc.key].rowspan += 1;
          newItem[bc.key].rowspan = 0;
          newItem[bc.key].parentIndex = parentIndex;
        }
      });

      newData.push(newItem);

      if (subtotal) {
        if (!nextItem || subtotal.condition(curItem, nextItem)) {
          newData.push({
            __subtotal__: true,
            ...subTotalValues,
          });
          subTotalValues = {};
        }
      }
    }

    return {
      newData,
      totalValues,
    };
  }, [bodyColumns, data, subtotal, total?.columns]);

  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [scrollTop, setScrollTop] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const onScroll = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollLeft } = scrollContainerRef.current;
      setScrollTop(scrollTop);
      setScrollLeft(scrollLeft);

      if (containerRef.current) {
        const headDiv = containerRef.current.querySelector("[role='head-container'] > div");
        if (headDiv && headDiv["style"]) {
          headDiv["style"].marginLeft = `${-scrollLeft}px`;
        }
        const footDiv = containerRef.current.querySelector("[role='foot-container'] > table");
        if (footDiv && footDiv["style"]) {
          footDiv["style"].marginLeft = `${-scrollLeft}px`;
        }
      }
    }
  }, []);

  const onWheel: (this: HTMLDivElement, ev: HTMLElementEventMap["wheel"]) => any = React.useCallback((evt) => {
    evt.preventDefault();

    if (scrollContainerRef.current) {
      const delta = { x: 0, y: 0 };

      if ((evt as any).detail) {
        delta.y = (evt as any).detail * 10;
      } else {
        if (typeof evt.deltaY === "undefined") {
          delta.y = -(evt as any).wheelDelta;
          delta.x = 0;
        } else {
          delta.y = evt.deltaY;
          delta.x = evt.deltaX;
        }
      }

      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollTop + delta.y;
    }
  }, []);

  //setInitialized
  React.useEffect(() => {
    const scrollContainerRefCurrent = scrollContainerRef?.current;

    if (scrollContainerRefCurrent) {
      scrollContainerRefCurrent.removeEventListener("scroll", onScroll);
      scrollContainerRefCurrent.addEventListener("scroll", onScroll, { passive: true, capture: true });
      // scrollContainerRef.current.scrollLeft = props.scrollLeft ?? scrollLeft;
      // scrollContainerRef.current.scrollTop = props.scrollTop ?? scrollTop;
    }

    return () => {
      scrollContainerRefCurrent?.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container ref={containerRef} className={className} style={style} width={width} height={height}>
      <HeadContainer style={{ width: width, height: headHeight }} role={"head-container"}>
        <StatTableTHead
          // marginLeft={-scrollLeft}
          colGroups={colGroups}
          headColumns={headColumns}
          tableWidth={tableWidth}
          headRowHeight={headRowHeight}
          onChangeColGroups={onChangeColGroups}
        />
      </HeadContainer>

      <BodyContainer ref={scrollContainerRef} style={{ width: width, height: bodyHeight }} role={"body-container"}>
        {rawBodyData ? (
          <StatTableRawBody
            colGroups={colGroups}
            tableWidth={tableWidth}
            rawBodyData={rawBodyData}
            bodyRowHeight={bodyRowHeight}
            onClick={onClick}
            selectedRowIndex={selectedRowIndex}
          />
        ) : (
          <StatTableTBody
            colGroups={colGroups}
            cdata={cdata}
            subtotal={subtotal}
            bodyColumns={bodyColumns}
            tableWidth={tableWidth}
            bodyRowHeight={bodyRowHeight}
            onClick={onClick}
            selectedRowIndex={selectedRowIndex}
          />
        )}
      </BodyContainer>

      {rawTotalData ? (
        <FootContainer style={{ width: width, height: footHeight }} role={"foot-container"}>
          <StatTableRawFoot
            tableClassName={"total-table"}
            colGroups={colGroups}
            tableWidth={tableWidth}
            rawBodyData={rawTotalData}
            bodyRowHeight={bodyRowHeight}
            onClick={onClick}
            selectedRowIndex={selectedRowIndex}
          />
        </FootContainer>
      ) : (
        total && (
          <FootContainer style={{ width: width, height: footHeight }} role={"foot-container"}>
            <StatTableTFoot
              // marginLeft={-scrollLeft}
              colGroups={colGroups}
              total={total}
              totalValues={totalValues}
              tableWidth={tableWidth}
              bodyRowHeight={bodyRowHeight}
            />
          </FootContainer>
        )
      )}

      <Loading active={spinning} />
    </Container>
  );
}

const Container = styled.div<{ width: number; height: number }>`
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid ${(p) => p.theme.border_color_base};
  width: ${(p) => p.width}px;
  height: ${(p) => p.height}px;
`;

const HeadContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid ${(p) => p.theme.border_color_base};
  background: ${(p) => p.theme.component_background};
`;

const BodyContainer = styled.div`
  position: relative;
  overflow: auto;
  background: ${(p) => p.theme.component_background};

  ${(p) =>
    SMixinScrollerStyle({
      track_color: p.theme.body_background,
      thumb_color: p.theme.scroll_thumb_color,
    })};
`;

const FootContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-top: 1px solid ${(p) => p.theme.border_color_base};
  background: ${(p) => p.theme.axfdg_body_hover_odd_bg};
`;

export { StatTable };
