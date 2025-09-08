'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type VisibilityState,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
} from '@tanstack/react-table';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Fragment, useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  generalFilterKey?: string;
  generalFilterColumns?: (keyof TData)[];
  selectFilterKey?: keyof TData;
  selectFilterOptions?: { label: string; value: string }[];
  sorting?: SortingState;
  onSortingChange?: (updater: SortingState | ((old: SortingState) => SortingState)) => void;
  renderRowSubComponent?: (props: { row: any }) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  generalFilterKey,
  generalFilterColumns = [],
  selectFilterKey,
  selectFilterOptions = [],
  sorting,
  onSortingChange,
  renderRowSubComponent,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const sortingState = sorting ?? internalSorting;
  const handleSortingChange = onSortingChange ?? setInternalSorting;

  const generalSearchColumn: ColumnDef<TData> = {
    accessorKey: generalFilterKey ?? 'search',
    header: '',
    filterFn: (row, _columnId, filterValue) => {
      const value = (filterValue as string).toLowerCase();
      const content = generalFilterColumns
        .map((key) => String(row.original[key]).toLowerCase())
        .join(' ');
      return value.split(' ').every((term) => content.includes(term));
    },
    enableSorting: false,
    enableHiding: false,
  };

  const extendedColumns: ColumnDef<TData, TValue>[] =
    generalFilterKey && generalFilterColumns.length > 0
      ? [...columns, generalSearchColumn]
      : [...columns];

  const table = useReactTable({
    data,
    columns: extendedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: handleSortingChange,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting: sortingState,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between py-1">
        {generalFilterKey && generalFilterColumns && (
          <Input
            placeholder="Filtro..."
            value={(table.getColumn(generalFilterKey)?.getFilterValue() as string) ?? ''}
            onChange={(e) => {
              table.getColumn(generalFilterKey)?.setFilterValue(e.target.value);
            }}
            className="max-w-sm"
          />
        )}
        {selectFilterOptions.length > 0 && selectFilterKey && (
          <Select
            value={
              (table.getColumn(selectFilterKey as string)?.getFilterValue() as string) ?? 'all'
            }
            onValueChange={(value) => {
              table
                .getColumn(selectFilterKey as string)
                ?.setFilterValue(value === 'all' ? undefined : value);
            }}
          >
            <SelectTrigger className="w-[180px] ml-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filtrar</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                {selectFilterOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .filter((column) => column.id !== 'actions')
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Select
          onValueChange={(value) => {
            table.setPageSize(+value);
          }}
        >
          <SelectTrigger className="w-[180px] m-2">
            <SelectValue placeholder="10 Filas" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filas por Página</SelectLabel>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="70">70</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className='bg-primary/20'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderRowSubComponent?.({ row })}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {table
            .getFooterGroups()
            .some((group) => group.headers.some((header) => header.column.columnDef.footer)) && (
              <tfoot className="mt-6 border-t pt-4 bg-muted/100 p-4 rounded-md">
                {table.getFooterGroups().map((footerGroup) => (
                  <TableRow key={footerGroup.id} className="text-sm text-muted-foreground">
                    {footerGroup.headers.map((header) => (
                      <TableCell key={header.id} className="font-bold text-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.footer, header.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </tfoot>
            )}
        </Table>

        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Regresar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
