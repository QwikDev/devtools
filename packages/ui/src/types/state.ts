import { AssetInfo, NpmInfo, RoutesInfo } from "@devtools/kit";
import { NoSerialize } from "@qwik.dev/core";

export interface State {
  isOpen: boolean;
  activeTab: "overview" | "components" | "routes" | "state" | "assets";
  npmPackages: NpmInfo;
  assets: AssetInfo[];
  routes: NoSerialize<RoutesInfo[]>;
}
