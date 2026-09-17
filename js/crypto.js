export async function deriveKey(password, saltText){
  const enc = new TextEncoder();
  const mat = await crypto.subtle.importKey("raw", enc.encode(password), {name:"PBKDF2"}, false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name:"PBKDF2", salt: enc.encode(saltText), iterations: 100000, hash:"SHA-256" },
    mat,
    { name:"AES-GCM", length:256 },
    false,
    ["encrypt","decrypt"]
  );
}

export async function encryptData(text, key){
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder().encode(text);
  const cipher = await crypto.subtle.encrypt({ name:"AES-GCM", iv }, key, enc);
  const combined = new Uint8Array(iv.length + cipher.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipher), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptData(b64, key){
  const raw = Uint8Array.from(atob(b64), c=>c.charCodeAt(0));
  const iv = raw.slice(0,12);
  const data = raw.slice(12);
  const plain = await crypto.subtle.decrypt({ name:"AES-GCM", iv }, key, data);
  return new TextDecoder().decode(plain);
}
