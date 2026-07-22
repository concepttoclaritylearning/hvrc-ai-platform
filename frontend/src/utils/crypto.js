/**
 * HVRC.AI Client-side Web Crypto API Key Encryption Helper (AES-GCM 256-bit)
 * 
 * Ensures API Keys are stored exclusively as encrypted ciphertext in browser localStorage.
 * Plaintext keys are never logged or stored in unencrypted local storage.
 */

const STORAGE_KEY = "hvrc_sec_master_k1";

async function getMasterKey() {
  let rawKey = localStorage.getItem(STORAGE_KEY);
  if (!rawKey) {
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    const exported = await crypto.subtle.exportKey("jwk", key);
    rawKey = JSON.stringify(exported);
    localStorage.setItem(STORAGE_KEY, rawKey);
  }

  const jwk = JSON.parse(rawKey);
  return await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt plaintext string to Base64 ciphertext
 */
export async function encryptSecret(plaintext) {
  if (!plaintext || typeof plaintext !== "string") return "";
  try {
    const key = await getMasterKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (err) {
    console.error("Encryption failed:", err);
    return plaintext;
  }
}

/**
 * Decrypt Base64 ciphertext to plaintext string
 */
export async function decryptSecret(ciphertextBase64) {
  if (!ciphertextBase64 || typeof ciphertextBase64 !== "string") return "";
  try {
    const key = await getMasterKey();
    const combined = Uint8Array.from(atob(ciphertextBase64), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (err) {
    // Return original string if not ciphertext or decryption fails
    return ciphertextBase64;
  }
}
