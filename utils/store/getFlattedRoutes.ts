import { RawRoutes, RawRoute } from "router/Routes";
import { MenuItem } from "router/menus";

export const getFlattedRoutes = (routes) => {
  function getRouteList(routes: RawRoutes): MenuItem[] {
    return Object.entries(routes).map(([key, { path, labels, hideTab, children }]) => {
      return {
        key,
        path,
        labels,
        hideTab,
        children: children ? getRouteList(children) : undefined,
      };
    });
  }

  const useMenuFlatFn = ({ children = [], ...rest }: any) => {
    return [rest, ...children.flatMap(useMenuFlatFn)];
  };
  return getRouteList(routes).flatMap<RawRoute>(useMenuFlatFn);
};
