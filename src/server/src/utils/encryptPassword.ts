import bcrypt from 'bcrypt';

export async function encryptPassword(data: {
  password: string;
  salt?: string;
}): Promise<{ salt: string; hash: string }> {
  const salt = data.salt || (await bcrypt.genSalt(10));
  const hash = await bcrypt.hash(data.password, salt);

  return { salt, hash };
}
