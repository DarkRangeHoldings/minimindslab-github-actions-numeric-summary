import { appendFileSync } from 'node:fs';

const payloadRaw = process.env.INPUT_PAYLOAD;
const outputPath = process.env.GITHUB_OUTPUT;

if (typeof payloadRaw !== 'string') {
  throw new Error('Invalid input');
}
if (typeof outputPath !== 'string' || outputPath.length === 0) {
  throw new Error('Invalid output');
}

let parsed;
try {
  parsed = JSON.parse(payloadRaw);
} catch {
  throw new Error('Invalid input');
}

if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.values) || parsed.values.length === 0) {
  throw new Error('Invalid input');
}

const values = parsed.values.slice();
let sum = 0;
let min = values[0];
let max = values[0];

if (typeof min !== 'number' || !Number.isFinite(min)) {
  throw new Error('Invalid input');
}

for (let i = 0; i < values.length; i++) {
  const n = values[i];
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new Error('Invalid input');
  }
  sum += n;
  if (n < min) min = n;
  if (n > max) max = n;
}

const count = values.length;
const mean = sum / count;

const result = { count, min, max, sum, mean };
appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);