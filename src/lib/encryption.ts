import crypto from "crypto";

const algorithm = "aes-256-gcm";
const key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32 bytes

function getInitials(schoolName: string) {
  if (!schoolName) return "";
  return schoolName
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function generatePassword(schoolName: string) {
  const initials = getInitials(schoolName);
  const digits = Math.floor(100000 + Math.random() * 9000000); // returns 6 or 7 digits
  return `${initials}-${digits}`;
}

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return {
    encrypted: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
}

export function decrypt(encrypted: string, iv: string, tag: string) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(tag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
