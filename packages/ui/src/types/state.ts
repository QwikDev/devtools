import { AssetInfo, NpmInfo, RoutesInfo, Component } from "@devtools/kit";
import { NoSerialize } from "@qwik.dev/core";

export type TabName =
  | "overview"
  | "packages"
  | "routes"
  | "state"
  | "assets"
  | "components";

export interface State {
  isOpen: boolean;
  activeTab: TabName;
  npmPackages: NpmInfo;
  assets: AssetInfo[];
  components: Component[];
  routes: NoSerialize<RoutesInfo[]>;
}
