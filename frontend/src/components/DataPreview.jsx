import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
  Button,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { useTable, usePagination } from 'react-table';

const DataPreview = ({ data, columns }) => {
  const tableColumns = React.useMemo(
    () =>
      columns.map(col => ({
        Header: col.name,
        accessor: col.name
      })),
    [columns]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns: tableColumns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    usePagination
  );

  return (
    <Box overflowX="auto">
      <Table {...getTableProps()} variant="simple">
        <Thead>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Th {...column.getHeaderProps()}>
                  {column.render('Header')}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <Td {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <HStack spacing={4} mt={4} justify="space-between">
        <HStack spacing={2}>
          <Button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            size="sm"
          >
            {'<<'}
          </Button>
          <Button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            size="sm"
          >
            {'<'}
          </Button>
          <Button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            size="sm"
          >
            {'>'}
          </Button>
          <Button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            size="sm"
          >
            {'>>'}
          </Button>
        </HStack>

        <HStack spacing={2}>
          <Text flexShrink={0}>Page</Text>
          <NumberInput
            min={1}
            max={pageOptions.length}
            value={pageIndex + 1}
            onChange={value => {
              const page = value ? Number(value) - 1 : 0;
              gotoPage(page);
            }}
            size="sm"
            maxW={20}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text flexShrink={0}>of {pageOptions.length}</Text>
        </HStack>

        <Select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          size="sm"
          maxW={32}
        >
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </Select>
      </HStack>
    </Box>
  );
};

export default DataPreview;