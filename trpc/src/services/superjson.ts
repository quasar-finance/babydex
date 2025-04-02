import superjson from "superjson";

export function serialize<T>(value: T): string {
  return superjson.stringify(value);
}

export function deserialize<T>(value: string): T {
  return superjson.parse<T>(value);
}
