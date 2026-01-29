import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);

const CONFIG_PATH =
  process.env.ICONIFY_CONFIG ||
  resolve(process.cwd(), 'iconify-icons.json');
const OUTPUT_PATH =
  process.env.ICONIFY_OUTPUT ||
  resolve(process.cwd(), 'src/generated-iconify.ts');

const loadConfig = async () => {
  const raw = await readFile(CONFIG_PATH, 'utf8');
  return JSON.parse(raw);
};

const loadCollection = (pkgName) => {
  const collection = require(`${pkgName}/icons.json`);
  return collection;
};

const toViewBox = (icon, collection) => {
  const width = icon.width || collection.width || 24;
  const height = icon.height || collection.height || 24;
  return `0 0 ${width} ${height}`;
};

const escapeSvg = (svg) =>
  svg.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

const run = async () => {
  const config = await loadConfig();
  const collections = new Map();

  for (const [key, entry] of Object.entries(config.collections || {})) {
    collections.set(key, loadCollection(entry.package));
  }

  const iconEntries = [];
  const missing = [];

  for (const iconConfig of config.icons || []) {
    const { id, collection: collectionId, icon } = iconConfig;
    const collection = collections.get(collectionId);
    if (!collection) {
      missing.push(`${id} (collection: ${collectionId})`);
      continue;
    }
    const iconData = collection.icons?.[icon];
    if (!iconData) {
      missing.push(`${id} (${collectionId}:${icon})`);
      continue;
    }
    iconEntries.push({
      id,
      viewBox: toViewBox(iconData, collection),
      svg: iconData.body,
    });
  }

  if (missing.length) {
    throw new Error(
      `Missing iconify entries:\n${missing.map((item) => `- ${item}`).join('\n')}`
    );
  }

  const lines = [
    "import type { IconDefinition } from '@runiq/core';",
    '',
    'export const generatedIconMap: Record<string, IconDefinition> = {',
  ];

  for (const entry of iconEntries) {
    lines.push(
      `  '${entry.id}': { viewBox: '${entry.viewBox}', svg: \`${escapeSvg(
        entry.svg
      )}\` },`
    );
  }

  lines.push('};', '');

  await writeFile(OUTPUT_PATH, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Wrote ${iconEntries.length} icons to ${OUTPUT_PATH}`);
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
