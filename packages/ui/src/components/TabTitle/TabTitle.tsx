import { component$ } from '@qwik.dev/core';

interface TabTitleProps {
  title: string;
}

export const TabTitle = component$(({ title }: TabTitleProps) => {
  return (
    <h3 class="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
      {title}
    </h3>
  );
});
