import * as React from "react";

export function modalCloseEventValidator(evt: React.MouseEvent): boolean {
  if (evt.target["tagName"] !== "INPUT" && evt.target["tagName"] !== "TEXTAREA") {
    return true;
  }

  evt.currentTarget["focus"]();

  return false;
}
