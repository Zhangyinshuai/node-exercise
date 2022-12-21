const crypto = require("crypto");

const encryption_key = "53cb430c537d79dc74d59914235518efac845835";
const user_id = "62ba63ca4dd722e042fae91c";
// 加密字符串
function encrypt(text) {
  const IV_LENGTH = 16;
  const NONCE_LENGTH = 5;
  const key = crypto.pbkdf2Sync(encryption_key, user_id, 10000, 32, 'sha512');
  
  let nonce = crypto.randomBytes(NONCE_LENGTH);
  let iv = Buffer.alloc(IV_LENGTH);
  nonce.copy(iv);

  let cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
  let encrypted = cipher.update(text.toString());
  let message = Buffer.concat([nonce, encrypted, cipher.final()]);
  
  return message.toString('base64');
}

// 解密字符串
function decrypt(text) {
  const IV_LENGTH = 16;
  const NONCE_LENGTH = 5;
  const key = crypto.pbkdf2Sync(encryption_key, user_id, 10000, 32, 'sha512');
  
  let message = Buffer.from(text, 'base64');
  let iv = Buffer.alloc(IV_LENGTH);
  message.copy(iv, 0, 0, NONCE_LENGTH);
  
  let encryptedText = message.slice(NONCE_LENGTH);
  let decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
  let decrypted = decipher.update(encryptedText);
  
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

let enPassword = encrypt("123456Zz");
let dePassword = decrypt("iSTYPWgSkL0d7cqAJA==");
let randomPassword = crypto.randomBytes(6).toString("hex");
let enRandomPassword = encrypt(randomPassword);
let deRandomPassword = decrypt(enRandomPassword);
console.log("加密后的字符串",enPassword);
console.log("解密后的字符串",dePassword);
console.log("随机产生的字符串", randomPassword);
console.log("加密后随机产生的字符串", enRandomPassword);
console.log("解密后随机产生的字符串", deRandomPassword);