'use server';
import crypto from 'crypto';

const SECRET_KEY = process.env.SECRET_KEY_CRYPTO || 'pL9zX2mK5vR1nB8jW4qT7yH3sC6aD0gF';
const ALGORITHM = 'aes-256-gcm';

export async function encrypt(text: string) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const combined = Buffer.concat([iv, authTag, encrypted]);

    return combined.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function decrypt(safeBase64: string) {
    try {
        if (!safeBase64) return null;
        const base64 = safeBase64.replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
        const buffer = Buffer.from(paddedBase64, 'base64');

        if (buffer.length < 28) {
            throw new Error("Token muito curto para ser válido.");
        }

        const iv = buffer.subarray(0, 12);
        const authTag = buffer.subarray(12, 28);
        const encryptedText = buffer.subarray(28);

        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString('utf8');
    } catch (error) {
        if (error instanceof Error) {
            console.error("Erro na descriptografia:", error.message);
        } else {
            console.error("Erro na descriptografia:", error);
        }
        return null;
    }
}