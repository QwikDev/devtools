import { getViteClientRpc } from "@devtools/kit";
import { component$, Signal } from "@qwik.dev/core";
import { Package } from "../../types";

export const InstallButton = component$(
  ({
    pkg,
    installingPackage,
  }: {
    pkg: Package;
    installingPackage: Signal<string | null>;
  }) => {
    return (
      <button
        onClick$={async () => {
          installingPackage.value = pkg.name;
          const rpc = getViteClientRpc();
          const result = await rpc.installPackage(pkg.name);
          if (!result.success) {
            return Promise.reject(result.error || "Installation failed");
          }
        }}
        disabled={installingPackage.value === pkg.name}
        class={[
          "rounded-full px-2 py-1 text-xs",
          installingPackage.value === pkg.name
            ? "cursor-not-allowed bg-blue-500/5 text-blue-400/50"
            : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
        ].join(" ")}
      >
        {installingPackage.value === pkg.name ? (
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
            <span>Installing...</span>
          </div>
        ) : (
          "Install"
        )}
      </button>
    );
  },
);
