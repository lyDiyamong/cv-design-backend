import * as bcrypt from 'bcryptjs';

export async function hashPassword(value: string) {
  console.log('password', value);
  return bcrypt.hash(value, 10);
}

export async function comparePassword(compareValue: string, hashValue: string) {
  return bcrypt.compare(compareValue, hashValue).catch(() => false);
}
