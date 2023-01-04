import * as React from "react";
import i18n from "i18n";
import { ContextMenu } from "./ContextMenu";

export enum TabGroupMenuAction {
  CLOSE_TAB = "CLOSE_TAB",
  CLOSE_OTHER_TABS = "CLOSE_OTHER_TABS",
  CLOSE_TABS_RIGHT = "CLOSE_TABS_RIGHT",
  REFRESH = "REFRESH",
}

export class TabGroupMenu<T = TabGroupMenuAction> extends ContextMenu<T> {
  public initMenu() {
    const t = i18n[this.language ?? "en"];

    this.menu.setMenu([
      { action: TabGroupMenuAction.CLOSE_TAB, label: t.pageTab.contextMenu.closeTag, click: this.handleMenuClick },
      {
        action: TabGroupMenuAction.CLOSE_OTHER_TABS,
        label: t.pageTab.contextMenu.closeOtherTabs,
        click: this.handleMenuClick,
      },
      {
        action: TabGroupMenuAction.CLOSE_TABS_RIGHT,
        label: t.pageTab.contextMenu.closeTabsToRight,
        click: this.handleMenuClick,
      },
      { action: TabGroupMenuAction.REFRESH, label: t.pageTab.contextMenu.refresh, click: this.handleMenuClick },
    ]);
  }

  public popupByItem(e: React.MouseEvent) {
    this.popup(e);
  }
}
