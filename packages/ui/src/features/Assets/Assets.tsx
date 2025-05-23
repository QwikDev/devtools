import { component$ } from "@qwik.dev/core";
import { State } from "../../types/state";

interface AssetsProps {
  state: State;
}

export const Assets = component$(({ state }: AssetsProps) => {
  return (
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {state.assets?.map((asset) => {
        const isImage = asset.path.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);
        const fileExt = asset.path.split(".").pop()?.toUpperCase();

        return (
          <div
            key={asset.filePath}
            class="overflow-hidden rounded-xl border border-border bg-card-item-bg transition-all duration-200 hover:bg-card-item-hover-bg"
          >
            {isImage ? (
              <div class="aspect-square overflow-hidden bg-black/20">
                <img
                  width={176}
                  height={176}
                  src={asset.publicPath}
                  alt={asset.path}
                  class="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div class="flex aspect-square items-center justify-center bg-black/20">
                <span class="font-mono text-2xl text-muted-foreground">{fileExt}</span>
              </div>
            )}
            <div class="space-y-2 p-4">
              <div class="truncate text-sm" title={asset.path}>
                {asset.path.split("/").pop()}
              </div>
              <div class="flex items-center justify-between text-xs text-muted-foreground">
                <span>{(asset.size / 1024).toFixed(2)} KB</span>
                <span class="rounded-full bg-foreground/5 px-2 py-1">{fileExt}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
