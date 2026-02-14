export function generateRandomMail(prefix: string): string {
  const randomStr = Math.random().toString(36).substring(2, 8); 
  return `${prefix}_user_${randomStr}@test.com`;
}