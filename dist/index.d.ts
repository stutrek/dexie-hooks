import Dexie from 'dexie';
export declare const useTable: <T, U>(table: Dexie.Table<T, U>) => [T[], boolean, Dexie.DexieError];
export declare const useItem: <T, U>(table: Dexie.Table<T, U>, id: U) => [T, boolean, Dexie.DexieError];
