import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // Must match TanStack's generic ColumnMeta; names are required for declaration merging.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    enableColumnFilter?: boolean;
  }
}
