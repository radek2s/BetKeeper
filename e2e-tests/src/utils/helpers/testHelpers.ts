export function generateRandomMail(prefix: string): string {
  const randomStr = Math.random().toString(36).substring(2, 8); 
  return `${prefix}_user_${randomStr}@test.com`;
}

export function assertExists<T>(value: T | null | undefined, message?: string): T {
  if (value == null) throw new Error(message || "Value must be defined");
  return value;
}