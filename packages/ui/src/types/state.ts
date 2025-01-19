import { AssetInfo, NpmInfo, RoutesInfo } from "@devtools/kit";
import { NoSerialize } from "@qwik.dev/core";

export type TabName = "overview" | "packages" | "routes" | "state" | "assets";

export interface State {
  isOpen: boolean;
  activeTab: TabName;
  npmPackages: NpmInfo;
  assets: AssetInfo[];
  routes: NoSerialize<RoutesInfo[]>;
}
