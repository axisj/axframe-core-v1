import { MenuItem } from "router";
import { AppMenu, AppMenuGroup } from "services";

export const getFlattedMenus = (menus: MenuItem[]) => {
  const useMenuFlatFn = ({ children = [], ...rest }: any) => {
    return [rest, ...children.flatMap(useMenuFlatFn)];
  };
  return menus.flatMap<MenuItem>(useMenuFlatFn);
};

export const getFlattedAppMenus = (menuGroups: AppMenuGroup[]) => {
  const useMenuFlatFn = ({ children = [], ...rest }: any) => {
    children.forEach((m, idx) => (m.keyPath = [...rest.keyPath, idx]));
    return [rest, ...children.flatMap(useMenuFlatFn)];
  };
  menuGroups.forEach((mg, idx) => (mg["keyPath"] = [idx]));
  return menuGroups.flatMap<AppMenu>(useMenuFlatFn);
};
