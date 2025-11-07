import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { dataSourceRegistry } from './registries.js';

type DataLoaderModule = typeof import('../../data-loader/src/index.ts');

// Dynamic imports from workspace source to avoid relying on built artifacts
async function createJsonLoader() {
  const mod: DataLoaderModule = await import('../../data-loader/src/index.ts');
  return new mod.JsonDataSource();
}

async function createCsvLoader() {
  const mod: DataLoaderModule = await import('../../data-loader/src/index.ts');
  return new mod.CsvDataSource();
}

describe('dataSourceRegistry', () => {
  const tmpDir = path.join(process.cwd(), '__core-data-source-tests__');

  beforeEach(async () => {
    dataSourceRegistry.clear();
    await fs.mkdir(tmpDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up files created during tests
    try {
      const files = await fs.readdir(tmpDir);
      await Promise.all(
        files.map((f) => fs.rm(path.join(tmpDir, f), { force: true }))
      );
    } catch (err) {
      // ignore cleanup errors in CI
      void err;
    }
  });

  it('registers and retrieves loaders by key', async () => {
    const jsonLoader = await createJsonLoader();
    dataSourceRegistry.register('json', jsonLoader);

    expect(dataSourceRegistry.has('json')).toBe(true);
    const got = dataSourceRegistry.get('json');
    expect(got?.format).toBe('json');
  });

  it('lists registered loaders', async () => {
    const jsonLoader = await createJsonLoader();
    const csvLoader = await createCsvLoader();
    dataSourceRegistry.register('json', jsonLoader);
    dataSourceRegistry.register('csv', csvLoader);

    const list = dataSourceRegistry.list();
    expect(list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'json', format: 'json' }),
        expect.objectContaining({ key: 'csv', format: 'csv' }),
      ])
    );
  });

  it('resolveAndLoad loads JSON from file', async () => {
    const jsonLoader = await createJsonLoader();
    dataSourceRegistry.register('json', jsonLoader);

    const file = path.join(tmpDir, 'data.json');
    await fs.writeFile(
      file,
      JSON.stringify({ data: [{ id: 1, name: 'Alice' }] }),
      'utf8'
    );

    const rows = await dataSourceRegistry.resolveAndLoad('json', file);
    expect(rows).toEqual([{ id: 1, name: 'Alice' }]);
  });

  it('resolveAndLoad loads CSV from inline string', async () => {
    const csvLoader = await createCsvLoader();
    dataSourceRegistry.register('csv', csvLoader);

    const csv = 'id,name\n1,Bob';
    const rows = await dataSourceRegistry.resolveAndLoad('csv', csv);
    expect(rows).toEqual([{ id: 1, name: 'Bob' }]);
  });

  it('throws for unknown data source key', async () => {
    await expect(
      dataSourceRegistry.resolveAndLoad('unknown', 'anything')
    ).rejects.toThrow('Data source not registered: unknown');
  });
});
