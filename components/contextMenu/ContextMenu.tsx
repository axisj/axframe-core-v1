import * as React from "react";
import { ContextMenu as ContextMenuClass, AXFCMenu } from "@axframe/contextmenu";
import { LanguageType } from "i18n";

export interface IContextmenuItem {
  action: number | string;
  label?: string;
}

export abstract class ContextMenu<T = any> {
  public menu: AXFCMenu.IContextMenu;
  private _click: AXFCMenu.OnClickItem<T> | undefined;
  private _lang: LanguageType;

  public constructor() {
    this.menu = new ContextMenuClass({ id: "context-menu" });
    this._lang = "en";
    this.initMenu();
  }

  public set onClick(_onClick: AXFCMenu.OnClickItem<T> | undefined) {
    if (_onClick) {
      this._click = _onClick;
    }
  }

  public get language() {
    return this._lang;
  }

  public set language(lang: LanguageType) {
    this._lang = lang;
    this.initMenu();
  }

  public handleMenuClick = (
    menuItem: AXFCMenu.IMenuItem,
    browserWindow: Window,
    evt: React.MouseEvent<HTMLDivElement>
  ) => {
    // log.debug('handleMenuClick', menu, this._click);
    this._click?.(menuItem, browserWindow, evt);
  };

  public popup(e: React.MouseEvent, _options?: AXFCMenu.IPopupOption): void {
    this.menu.popup({ x: e.pageX, y: e.pageY });
  }

  public abstract initMenu(): void;

  public destroy(): void {
    this.menu.close();
  }
}
