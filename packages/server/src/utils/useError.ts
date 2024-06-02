export function useError(err: unknown, defaultMessage: string) {
  return err instanceof Error
    ? err
    : new Error(typeof err === "string" ? err : defaultMessage);
}
