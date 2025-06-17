import { component$ } from '@qwik.dev/core';

interface TabTitleProps {
  title: string;
}

export const TabTitle = component$(({ title }: TabTitleProps) => {
  return <h3 class="text-xl font-semibold">{title}</h3>;
});
