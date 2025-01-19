import { $, component$, useSignal, useTask$ } from "@qwik.dev/core";
import { getViteClientRpc } from "@devtools/kit";
import { useDebouncer } from "../../hooks/useDebouncer";

export const Packages = component$(() => {
  const debouncedQuery = useSignal("");
  const isLoading = useSignal(false);
  const searchResults = useSignal<
    { name: string; version: string; description: string }[]
  >([]);
  const installingPackage = useSignal<string | null>(null);
  const installError = useSignal<{ pkg: string; error: string } | null>(null);

  const debounceSearch = useDebouncer(
    $((value: string) => {
      debouncedQuery.value = value;
    }),
    300,
  );

  // Use debounced value for API calls
  useTask$(async ({ track }) => {
    const query = track(() => debouncedQuery.value);

    if (!query || query.length < 2) {
      searchResults.value = [];
      return;
    }

    isLoading.value = true;
    try {
      const response = await fetch(
        `https://registry.npmjs.org/-/v1/search?text=${query}`,
      );
      const data = await response.json();
      searchResults.value = data.objects.map((obj: any) => ({
        name: obj.package.name,
        version: obj.package.version,
        description: obj.package.description || "No description available",
      }));
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      searchResults.value = [];
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="space-y-4">
      <div class="relative">
        <input
          type="text"
          onInput$={(_, target) => {
            debounceSearch(target.value);
          }}
          placeholder="Search npm packages..."
          class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/20"
        />
        {isLoading.value && (
          <div class="absolute right-3 top-2.5">
            <div class="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
          </div>
        )}
      </div>

      {searchResults.value.length > 0 && (
        <div class="grid gap-3 md:grid-cols-2">
          {searchResults.value.map((pkg) => (
            <div
              key={pkg.name}
              class="flex flex-col gap-2 rounded-lg bg-white/5 p-3"
            >
              <div class="flex items-center justify-between">
                <div class="text-sm">{pkg.name}</div>
                <div class="flex items-center gap-2">
                  <div class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-400">
                    {pkg.version}
                  </div>
                  <button
                    onClick$={async () => {
                      installingPackage.value = pkg.name;
                      installError.value = null;
                      const rpc = getViteClientRpc();
                      try {
                        const result = await rpc.installPackage(pkg.name);
                        if (!result.success) {
                          installError.value = {
                            pkg: pkg.name,
                            error: result.error || "Installation failed",
                          };
                        }
                      } catch (error) {
                        installError.value = {
                          pkg: pkg.name,
                          error: "Installation failed",
                        };
                      } finally {
                        installingPackage.value = null;
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
                </div>
              </div>
              <div class="line-clamp-2 text-xs text-zinc-400">
                {pkg.description}
              </div>
              {installError.value?.pkg === pkg.name && (
                <div class="mt-2 text-xs text-red-400">
                  {installError.value.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
