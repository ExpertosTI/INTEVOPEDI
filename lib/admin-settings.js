import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { prisma } from '@/lib/db';

const GEMINI_KEY_SETTING = 'GEMINI_API_KEY_ENC';

function buildKey() {
  const baseSecret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_ACCESS_PASSWORD || 'intevopedi-local-admin';
  return createHash('sha256').update(baseSecret).digest();
}

function encryptValue(rawValue) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', buildKey(), iv);
  const encrypted = Buffer.concat([cipher.update(rawValue, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('base64url')}.${authTag.toString('base64url')}.${encrypted.toString('base64url')}`;
}

function decryptValue(encryptedValue) {
  const [ivRaw, tagRaw, dataRaw] = String(encryptedValue || '').split('.');
  if (!ivRaw || !tagRaw || !dataRaw) {
    return '';
  }
  const iv = Buffer.from(ivRaw, 'base64url');
  const authTag = Buffer.from(tagRaw, 'base64url');
  const encrypted = Buffer.from(dataRaw, 'base64url');
  const decipher = createDecipheriv('aes-256-gcm', buildKey(), iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

export async function getMaskedGeminiKey() {
  try {
    if (process.env.GEMINI_API_KEY) {
      const envKey = process.env.GEMINI_API_KEY;
      return `Configurada por entorno: ****${envKey.slice(-4)}`;
    }
    const setting = await prisma.adminSetting.findUnique({
      where: { key: GEMINI_KEY_SETTING },
      select: { value: true }
    });
    if (!setting?.value) {
      return null;
    }
    const decrypted = decryptValue(setting.value);
    if (!decrypted) {
      return null;
    }
    return `Guardada en ajustes: ****${decrypted.slice(-4)}`;
  } catch (error) {
    return null;
  }
}

export async function getGeminiApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  try {
    const setting = await prisma.adminSetting.findUnique({
      where: { key: GEMINI_KEY_SETTING },
      select: { value: true }
    });
    if (!setting?.value) {
      return '';
    }
    return decryptValue(setting.value);
  } catch (error) {
    return '';
  }
}

export async function saveGeminiApiKey(rawApiKey) {
  const cleanApiKey = String(rawApiKey || '').trim();
  if (!cleanApiKey) {
    try {
      await prisma.adminSetting.deleteMany({
        where: { key: GEMINI_KEY_SETTING }
      });
    } catch (error) {}
    return;
  }
  const encrypted = encryptValue(cleanApiKey);
  try {
    await prisma.adminSetting.upsert({
      where: { key: GEMINI_KEY_SETTING },
      update: { value: encrypted },
      create: { key: GEMINI_KEY_SETTING, value: encrypted }
    });
  } catch (error) {}
}
