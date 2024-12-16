export function genId(): string {
  return crypto.randomUUID().split("-")[4];
}
