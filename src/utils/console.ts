export function Debug(...messages: unknown[]) {
  if (!import.meta.env.DEV) return;

  // eslint-disable-next-line no-console
  console.log("👻 DEBUG LOG / ", ...messages);
}
