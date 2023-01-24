import { RawRoutes, RawRoute } from "router";
import { MenuItem } from "router";

export const getFlattedRoutes = (routes) => {
  function getRouteList(routes: RawRoutes): MenuItem[] {
    return Object.entries(routes).map(([key, { path, program_type, hideTab, children }]) => {
      return {
        key,
        program_type,
        path,
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
