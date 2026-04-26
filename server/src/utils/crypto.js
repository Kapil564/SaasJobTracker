import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

export const encrypt = (plaintext) => {
  if (!plaintext) return plaintext;
  
  const keyHex = process.env.TOKEN_ENCRYPTION_KEY;
  if (!keyHex) throw new Error("TOKEN_ENCRYPTION_KEY is missing");
  const key = Buffer.from(keyHex, 'hex');

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${ciphertext}`;
};

export const decrypt = (encrypted) => {
  if (!encrypted) return encrypted;
  if (!encrypted.includes(':')) return encrypted; // fallback for unencrypted tokens (if any exist)

  const keyHex = process.env.TOKEN_ENCRYPTION_KEY;
  if (!keyHex) throw new Error("TOKEN_ENCRYPTION_KEY is missing");
  const key = Buffer.from(keyHex, 'hex');

  const parts = encrypted.split(':');
  if (parts.length !== 3) throw new Error("Invalid encrypted format");

  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const ciphertext = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
  plaintext += decipher.final('utf8');

  return plaintext;
};
