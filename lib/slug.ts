const SERBIAN_MAP: Record<string, string> = {
  č: "c",
  ć: "c",
  đ: "dj",
  š: "s",
  ž: "z",
  Č: "c",
  Ć: "c",
  Đ: "dj",
  Š: "s",
  Ž: "z",
};

export function slugify(value: string) {
  return value
    .trim()
    .replace(/[čćđšžČĆĐŠŽ]/g, (char) => SERBIAN_MAP[char] ?? char)
    .toLowerCase()
    .replace(/&/g, " i ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
