import * as React from "react";

/**
 * Select UI에 showSearch 가 활성화 된 경우에 option text로 검색이 되게 해주는 함수.
 * @return {boolean}
 * @example
 * ```js
 * <Select showSearch filterOption={fnFilterOption} style={{ width: 150 }}>
 * ```
 * @param children
 */

export function findOptionLabelValue(children: React.ReactNode): string {
  if (!children) {
    return "";
  }
  if (typeof children === "string") {
    return children;
  }
  if (Array.isArray(children)) {
    return children
      .map((child: any) => {
        if (child.props?.children) {
          return child.props.children.toString();
        }
        return child;
      })
      .join(" ");
  }
  return findOptionLabelValue((children as React.ReactElement).props.children);
}
