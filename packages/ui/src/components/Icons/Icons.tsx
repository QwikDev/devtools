import { component$ } from '@qwik.dev/core';

type IconProps = {
  class?: string;
  style?: Record<string, string>;
  title?: string;
};

function baseSvgProps(props: IconProps & { viewBox: string }) {
  const { class: className, style, title, viewBox } = props;
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox,
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.5',
    class: className,
    style,
    'aria-hidden': title ? undefined : true,
    role: title ? 'img' : undefined,
  } as const;
}

export const IconSunOutline = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 3v2.25M6.364 6.364l1.591 1.591M3 12h2.25m1.114 5.636 1.591-1.591M12 18.75V21m5.636-2.364-1.591-1.591M18.75 12H21m-2.364-5.636-1.591 1.591M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  );
});

export const IconMoonOutline = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0 1 12 21.75 9.75 9.75 0 0 1 11.002 2.248 7.5 7.5 0 0 0 21.752 15Z"
      />
    </svg>
  );
});

export const IconSparkles = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9.813 5.146 12 2.25l2.187 2.896 3.563.717-2.431 2.398.434 3.489L12 10.6l-3.753 1.15.434-3.489-2.431-2.398 3.563-.717Z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19.5 13.125 21 12l-1.5-1.125L18.375 9.75 17.25 11.25 16.125 9.75 15 10.875 16.5 12l-1.5 1.125 1.125 1.5 1.125-1.5 1.125 1.5 1.125-1.5Z"
      />
    </svg>
  );
});

export const IconChevronUpMini = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m18 15-6-6-6 6"
      />
    </svg>
  );
});

export const IconBoltOutline = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M13 2 3 14h7l-1 8 12-14h-7l1-6Z"
      />
    </svg>
  );
});

export const IconCubeOutline = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 7.5 12 2.25 3 7.5m18 0v9L12 21.75 3 16.5v-9m18 0L12 12.75 3 7.5m9 5.25v9"
      />
    </svg>
  );
});

export const IconDiagram3 = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 6h8" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 18h8" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12" />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M7 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm16.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7 18a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm16.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      />
    </svg>
  );
});

export const IconFolderTree = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.75 5.25h6l1.5 1.5h9A1.5 1.5 0 0 1 21.75 8.25v10.5A1.5 1.5 0 0 1 20.25 20.25H3.75A1.5 1.5 0 0 1 2.25 18.75V6.75A1.5 1.5 0 0 1 3.75 5.25Z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 9v3m0 0H8.25m3.75 0h3.75M8.25 12v3m7.5-3v3"
      />
    </svg>
  );
});

export const IconPhotoOutline = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15A2.25 2.25 0 0 1 21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1-2.25-2.25V6.75Z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M7.5 9.75a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21.75 15-6.3-6.3a1.125 1.125 0 0 0-1.59 0L3.75 18"
      />
    </svg>
  );
});

export const IconMegaphoneMini = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 11.25v1.5a3 3 0 0 0 3 3h1.5l5.25 3V6.75L7.5 9.75H6a3 3 0 0 0-3 1.5Z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M18 9.75a3.75 3.75 0 0 1 0 4.5"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M20.25 8.25a6.75 6.75 0 0 1 0 7.5"
      />
    </svg>
  );
});

export const IconCodeBracketSolid = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8.25 6.75 3.75 12l4.5 5.25M15.75 6.75 20.25 12l-4.5 5.25"
      />
    </svg>
  );
});

export const IconClockOutline = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 6v6l4 2"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
});

export const IconXMark = component$((props: IconProps) => {
  return (
    <svg {...baseSvgProps({ ...props, viewBox: '0 0 24 24' })}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
});

