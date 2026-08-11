import crypto from "crypto";
import { getRequiredEnv } from "@/lib/env";

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

function signPayload(payloadBase64, secret) {
  return crypto.createHmac("sha256", secret).update(payloadBase64).digest("base64url");
}

// Genera token firmado con datos de sesion del usuario
export function createSessionToken(userData) {
  const { sessionSecret } = getRequiredEnv();

  const payload = {
    idusuario: userData.idusuario,
    idsesion: userData.idsesion,
    nombre: userData.nombre,
    apellido: userData.apellido,
    exp: Date.now() + TOKEN_TTL_MS,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(payloadBase64, sessionSecret);

  return `${payloadBase64}.${signature}`;
}

// Verifica firma y expiracion del token
export function verifySessionToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  let sessionSecret;

  try {
    ({ sessionSecret } = getRequiredEnv());
  } catch {
    return null;
  }

  const [payloadBase64, signature] = token.split(".");
  const expectedSignature = signPayload(payloadBase64, sessionSecret);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf8"));

    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
