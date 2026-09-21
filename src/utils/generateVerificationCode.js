import { randomBytes } from "node:crypto";

const generateVerificationCode = (length = 10) => {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let code = "";

  while (code.length < length) {
    const bytes = randomBytes(length);

    for (const byte of bytes) {
      // 248 is the largest multiple of 62 below 256.
      if (byte >= 248) continue;

      code += alphabet[byte % 62];

      if (code.length === length) {
        break;
      }
    }
  }

  return code;
};

export default generateVerificationCode;