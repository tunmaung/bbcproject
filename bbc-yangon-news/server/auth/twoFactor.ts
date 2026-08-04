import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function generateTwoFactorSecret(
  username: string,
  issuer = "BBC Yangon News"
) {
  const secret = speakeasy.generateSecret({
    name: `${issuer} (${username})`,
    issuer,
    length: 32,
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url!,
    qrCode,
  };
}

export function verifyTwoFactorToken(
  secret: string,
  token: string
) {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });
}
