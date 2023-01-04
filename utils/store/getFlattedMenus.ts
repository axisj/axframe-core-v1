import { MenuItem } from "router/menus";

export const getFlattedMenus = (menus: MenuItem[]) => {
  const useMenuFlatFn = ({ children = [], ...rest }: any) => {
    return [rest, ...children.flatMap(useMenuFlatFn)];
  };
  return menus.flatMap<MenuItem>(useMenuFlatFn);
};
