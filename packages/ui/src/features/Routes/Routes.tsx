import { component$ } from "@qwik.dev/core";
import { State } from "../../types/state";

interface RoutesProps {
  state: State;
}

export const Routes = component$(({ state }: RoutesProps) => {

  return (
    <div class="overflow-hidden rounded-xl border border-white/10 flex-1">
      <div class="grid grid-cols-4 gap-4 bg-white/[0.03] p-4 text-sm font-medium">
        <div>Route Path</div>
        <div>Name</div>
        <div>Middleware</div>
        <div>Layout</div>
      </div>
      {state.routes?.map((route, i) => {
        const children = route.children || [];
        const layout =
          route.relativePath !== "" &&
          route.type === "directory" &&
          children.find((child) => child.name.startsWith("layout"));

        return (
          <div
            key={route.relativePath}
            class="grid grid-cols-4 gap-4 border-t border-white/10 p-4 text-sm hover:bg-white/[0.02]"
          >
            <div>
              <span
                class={{
                  "text-emerald-400":
                    (location.pathname === "/" &&
                      route.relativePath === "") ||
                    location.pathname === `/${route.relativePath}/`,
                }}
              >
                {route.relativePath === "" ? "/" : `/${route.relativePath}/`}
              </span>
            </div>
            <div class="text-zinc-400">{route.name}</div>
            <div class="text-zinc-400">-</div>
            <div>
              <span
                class={{
                  "text-emerald-400": layout && i > 0,
                  "text-zinc-400": !layout || i === 0,
                }}
              >
                {layout && i > 0 ? `${route.relativePath}/layout` : "default"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});
