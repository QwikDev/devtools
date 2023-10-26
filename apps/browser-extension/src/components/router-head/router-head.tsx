import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {head.meta.map((m, key) => (
        <meta {...m} key={key} />
      ))}

      {head.links.map((l, key) => (
        <link {...l} key={key} />
      ))}

      {head.styles.map((s, key) => (
        <style {...s.props} dangerouslySetInnerHTML={s.style}  key={key}/>
      ))}
    </>
  );
});
