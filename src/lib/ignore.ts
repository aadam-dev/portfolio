/**
 * "Don't count me": one localStorage key shared with the Scout tracker, so a
 * single step on each of the owner's devices silences every visit alert.
 *   localStorage.setItem("scout-ignore", "1")   or open /?scout-ignore=1
 */
export const IGNORE_KEY = "scout-ignore";
const OLD_KEY = "visit-owner"; // set by earlier builds when signing in to /office

export function isIgnored() {
  try {
    return localStorage.getItem(IGNORE_KEY) === "1" || localStorage.getItem(OLD_KEY) === "1";
  } catch {
    return false;
  }
}

export function setIgnored(on: boolean) {
  try {
    if (on) localStorage.setItem(IGNORE_KEY, "1");
    else {
      localStorage.removeItem(IGNORE_KEY);
      localStorage.removeItem(OLD_KEY);
    }
  } catch {}
}
