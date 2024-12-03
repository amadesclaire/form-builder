export function omitProperty<T, K extends keyof T>(
  object: T,
  key: K
): Omit<T, K> {
  const { [key]: _, ...rest } = object;
  return rest as Omit<T, K>;
}

const user = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  hashedPassword: "s3cr3t",
};

const userWithoutPassword = omit(user, "hashedPassword");
console.log(userWithoutPassword);
