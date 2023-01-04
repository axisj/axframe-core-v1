import { ROUTES } from "../../../router/Routes";
import { getFlattedRoutes } from "./getFlattedRoutes";

describe("getFlattedMenus", () => {
  it("getFlattedMenus test", () => {
    expect(getFlattedRoutes(ROUTES)[2].key).toBe("LIST");
  });
});
