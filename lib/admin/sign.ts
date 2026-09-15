import { createHmac, timingSafeEqual } from "crypto";

// HMAC signature for the one-click approve link in the founder alert email.
// Only someone holding the emailed link (i.e. the founder's inbox) can
// approve; the application id alone is not enough.
function secret() {
  const s = process.env.APPROVAL_SECRET;
  if (!s) throw new Error("APPROVAL_SECRET is not set");
  return s;
}

export function signApproval(applicationId: string) {
  return createHmac("sha256", secret()).update(`approve:${applicationId}`).digest("hex");
}

export function verifyApproval(applicationId: string, sig: string) {
  const expected = Buffer.from(signApproval(applicationId));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
