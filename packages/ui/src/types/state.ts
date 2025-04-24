import { AssetInfo, NpmInfo, RoutesInfo, Component } from "@devtools/kit";
import { NoSerialize, Signal } from "@qwik.dev/core";

export type TabName =
  | "overview"
  | "packages"
  | "routes"
  | "state"
  | "assets"
  | "components"
  | "inspect";

export interface State {
  isOpen: Signal<boolean>;
  activeTab: TabName;
  npmPackages: NpmInfo;
  assets: AssetInfo[];
  components: Component[];
  routes: NoSerialize<RoutesInfo[]>;
}
