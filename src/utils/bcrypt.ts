import * as bcrypt from 'bcryptjs';

export async function hashPassword(value: string): Promise<string> {
  return bcrypt.hash(value, 10);
}

export async function comparePassword(
  compareValue: string,
  hashValue: string,
): Promise<boolean> {
  return bcrypt.compare(compareValue, hashValue).catch(() => false);
}
