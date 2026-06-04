import { Storage } from './storage';
import { AsyncDataManagers } from './asyncDataManagers.js';

const MIGRATION_FLAG_KEY = 'pw_rtdb_migrated_v1';

export async function migrateLocalStorageToRTDB({ onProgress } = {}) {
  const already = Storage.get(MIGRATION_FLAG_KEY, false);
  if (already) return { migrated: false };

  const modules = Object.keys(AsyncDataManagers);
  let migratedCount = 0;

  for (const moduleName of modules) {
    const items = Storage.get(moduleName, []);
    if (items && Array.isArray(items) && items.length > 0) {
      await AsyncDataManagers[moduleName].addBulk(items);
      migratedCount++;
      onProgress?.({ moduleName, itemsCount: items.length });
    }
  }

  Storage.set(MIGRATION_FLAG_KEY, true);
  return { migrated: true, migratedCount };
}

