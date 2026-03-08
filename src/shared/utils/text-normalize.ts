const CP1252_REVERSE: Record<string, number> = {
  '€': 0x80,
  '‚': 0x82,
  'ƒ': 0x83,
  '„': 0x84,
  '…': 0x85,
  '†': 0x86,
  '‡': 0x87,
  'ˆ': 0x88,
  '‰': 0x89,
  'Š': 0x8a,
  '‹': 0x8b,
  'Œ': 0x8c,
  'Ž': 0x8e,
  '‘': 0x91,
  '’': 0x92,
  '“': 0x93,
  '”': 0x94,
  '•': 0x95,
  '–': 0x96,
  '—': 0x97,
  '˜': 0x98,
  '™': 0x99,
  'š': 0x9a,
  '›': 0x9b,
  'œ': 0x9c,
  'ž': 0x9e,
  'Ÿ': 0x9f,
};

const MOJIBAKE_PATTERN = /[ÃÂâðŸœž]/;
const MOJIBAKE_SCORE = /[ÃÂâðŸœž]/g;

function decodeLikelyMojibake(value: string): string {
  if (!MOJIBAKE_PATTERN.test(value)) return value;

  const bytes: number[] = [];
  for (const char of value) {
    const mapped = CP1252_REVERSE[char];
    if (mapped !== undefined) {
      bytes.push(mapped);
      continue;
    }

    const code = char.charCodeAt(0);
    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }

    return value;
  }

  try {
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bytes));
    const before = (value.match(MOJIBAKE_SCORE) ?? []).length;
    const after = (decoded.match(MOJIBAKE_SCORE) ?? []).length;
    return after < before ? decoded : value;
  } catch {
    return value;
  }
}

export function normalizeTextDeep<T>(input: T): T {
  if (typeof input === 'string') {
    return decodeLikelyMojibake(input) as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => normalizeTextDeep(item)) as T;
  }

  if (input && typeof input === 'object') {
    const entries = Object.entries(input as Record<string, unknown>).map(([key, value]) => [
      key,
      normalizeTextDeep(value),
    ]);
    return Object.fromEntries(entries) as T;
  }

  return input;
}
