import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

export default function CustomizedDataGrid() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:7000/api/v1/getproduct')
      .then((res) => {
        if (res.data.success) {
          const transformed = res.data.items.map((item, index) => ({
            id: item._id,
            name: item.name,
            unit: item.unit,
            quantity: item.quantity,
            reorderThreshold: item.reorderThreshold,
            status: item.quantity <= item.reorderThreshold ? 'Low' : 'Normal',
          }));
          setRows(transformed);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err);
      });
  }, []);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Product Name', flex: 1, minWidth: 150 },
    { field: 'unit', headerName: 'Unit', flex: 0.5, minWidth: 80 },
    { field: 'quantity', headerName: 'Item Count', flex: 1, minWidth: 100, type: 'number' },
    { field: 'reorderThreshold', headerName: 'Threshold', flex: 1, minWidth: 100, type: 'number' },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span style={{ color: params.value === 'Low' ? 'red' : 'green' }}>
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <DataGrid
      checkboxSelection
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
  );
}
