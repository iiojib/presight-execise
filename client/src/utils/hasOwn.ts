export const hasOwn = <Type, Key extends string | number | symbol>(
  obj: Type,
  key: Key,
): obj is Type & { [K in Key]: unknown } => {
  return Object.hasOwn(Object(obj), key);
};
