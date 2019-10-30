import Dexie from 'dexie';
import { useReducer, useEffect, useCallback } from 'react';
import { IDatabaseChange } from 'dexie-observable/api';

type TableState<T> = [T[] | undefined, boolean, Dexie.DexieError | undefined];
type TableAction<T> =
    | { type: 'resolved'; data: T[] }
    | { type: 'reset' }
    | { type: 'error'; error: Dexie.DexieError };

type ItemState<T> = [T | undefined, boolean, Dexie.DexieError | undefined];
type ItemAction<T> =
    | { type: 'resolved'; data: T }
    | { type: 'reset' }
    | { type: 'error'; error: Dexie.DexieError };

export const useTable = <T, U>(table: Dexie.Table<T, U>): TableState<T> => {
    const reducer = useCallback(
        (state: TableState<T>, action: TableAction<T>): TableState<T> => {
            switch (action.type) {
                case 'resolved':
                    return [action.data, false, undefined];
                case 'error':
                    return [undefined, false, action.error];
                default:
                    return [undefined, true, undefined];
            }
        },
        [table]
    );

    const [state, dispatch] = useReducer(reducer, [undefined, true, undefined]);

    useEffect(() => {
        const getAndDispatch = () =>
            table
                .toArray()
                .then(data => {
                    dispatch({
                        type: 'resolved',
                        data,
                    });
                })
                .catch(error => {
                    dispatch({
                        type: 'error',
                        error,
                    });
                });
        const listener = (changes: IDatabaseChange[]) => {
            for (const change of changes) {
                if (change.table === table.name) {
                    getAndDispatch();
                    break;
                }
            }
        };

        getAndDispatch();
        // @ts-ignore
        table.db.on('changes', listener);
        return () => {
            // @ts-ignore
            table.db.off('changes', listener);
        };
    }, [table]);

    return state;
};

export const useItem = <T, U>(table: Dexie.Table<T, U>, id: U) => {
    const reducer = useCallback(
        (state: ItemState<T>, action: ItemAction<T>): ItemState<T> => {
            switch (action.type) {
                case 'resolved':
                    return [action.data, false, undefined];
                case 'error':
                    return [undefined, false, action.error];
                default:
                    return [undefined, true, undefined];
            }
        },
        [table]
    );

    const [state, dispatch] = useReducer(reducer, [undefined, true, undefined]);

    useEffect(() => {
        const getAndDispatch = () =>
            table
                .get(id)
                .then(data => {
                    dispatch({
                        type: 'resolved',
                        data,
                    });
                })
                .catch(error => {
                    dispatch({
                        type: 'error',
                        error,
                    });
                });

        const listener = (changes: IDatabaseChange[]) => {
            for (const change of changes) {
                if (change.table === table.name && change.key === id) {
                    getAndDispatch();
                    break;
                }
            }
        };

        getAndDispatch();
        // @ts-ignore
        table.db.on('changes', listener);
        return () => {
            // @ts-ignore
            table.db.off('changes', listener);
        };
    }, [table, id]);

    return state;
};
