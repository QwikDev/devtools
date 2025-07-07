import {
  $,
  component$,
  Resource,
  useResource$,
  useSignal,
} from '@qwik.dev/core';
import { useDebouncer } from '../../hooks/useDebouncer';
import { Package } from './types';
import { InstallButton } from './components/InstallButton/InstallButton';

export const Packages = component$(() => {
  const debouncedQuery = useSignal('');
  const installingPackage = useSignal<string | null>(null);

  const debounceSearch = useDebouncer(
    $((value: string) => {
      debouncedQuery.value = value;
    }),
    300,
  );

  const searchResults = useResource$<Package[]>(async ({ track }) => {
    const query = track(() => debouncedQuery.value);

    if (!query || query.length < 2) {
      return [] as Package[];
    }

    const response = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=${query}`,
    );
    const data = await response.json();
    const packages: Package[] = data.objects.map((obj: any) => ({
      name: obj.package.name,
      version: obj.package.version,
      description: obj.package.description || 'No description available',
    }));
    return packages;
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
          class="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-ring"
        />
      </div>

      <Resource
        value={searchResults}
        onPending={() => (
          <div class="absolute right-3 top-1">
            <div class="border-t-foreground/40 animate-spin h-5 w-5 rounded-full border-2 border-border" />
          </div>
        )}
        onRejected={(error) => (
          <div class="mt-2 text-xs text-red-400">
            {error.message || 'Failed to fetch packages'}
          </div>
        )}
        onResolved={(packages) => {
          return (
            <div class="grid gap-3 md:grid-cols-2">
              {packages.map((pkg) => {
                return (
                  <div
                    key={pkg.name}
                    class="bg-foreground/5 flex flex-col gap-2 rounded-lg p-3"
                  >
                    <div class="flex items-center justify-between">
                      <div class="text-sm">{pkg.name}</div>
                      <div class="flex items-center gap-2">
                        <div class="bg-foreground/5 rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                          {pkg.version}
                        </div>
                        <InstallButton
                          pkg={pkg}
                          installingPackage={installingPackage}
                        />
                      </div>
                    </div>
                    <div class="line-clamp-2 text-xs text-muted-foreground">
                      {pkg.description}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      />
    </div>
  );
});
