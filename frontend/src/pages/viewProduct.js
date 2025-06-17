import * as React from 'react';
import {
  Box, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const columns = (handleEdit, handleDelete) => [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Item Name', width: 150 },
  { field: 'unit', headerName: 'Unit', width: 100 },
  { field: 'quantity', headerName: 'Quantity', type: 'number', width: 100 },
  { field: 'reorderThreshold', headerName: 'Reorder Threshold', type: 'number', width: 150 },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 180,
    valueFormatter: (params) => new Date(params.value).toLocaleString(),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    renderCell: (params) => (
      <>
        <IconButton onClick={() => handleEdit(params.row)}>
          <EditIcon color="primary" />
        </IconButton>
        <IconButton onClick={() => handleDelete(params.row)}>
          <DeleteIcon color="error" />
        </IconButton>
      </>
    )
  },
];

export default function DataGridProduct() {
  const [rows, setRows] = React.useState([]);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const fetchData = () => {
    axios.get('http://localhost:7000/api/v1/getproduct')
      .then((res) => {
        const mappedRows = res.data.items.map((item, index) => ({
          ...item,
          id: item._id, // Use actual DB ID here for editing
        }));
        setRows(mappedRows);
      })
      .catch((err) => console.error('Fetch error:', err));
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditOpen(true);
  };

  const handleDelete = (row) => {
    axios.delete(`http://localhost:7000/api/v1/deleteproduct/${row.id}`)
      .then(() => {
        fetchData();
        alert('Item deleted successfully');
      })
      .catch(err => console.error('Delete error:', err));
  };

  const handleSave = () => {
    const { id, name, unit, quantity, reorderThreshold } = selectedRow;
    axios.put(`http://localhost:7000/api/v1/editproduct/${id}`, {
      name, unit, quantity, reorderThreshold
    })
      .then(() => {
        fetchData();
        setEditOpen(false);
        alert('Item updated');
      })
      .catch(err => console.error('Update error:', err));
  };

  return (
    <>
      <Box sx={{ height: 450, width: '98%', m: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns(handleEdit, handleDelete)}
          pageSizeOptions={[5]}
          paginationModel={{ pageSize: 5, page: 0 }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', mt: 1, mx: 3 }}>
          {/* <Box sx={{ gap: 2, mt: 1, mx: 3 }} > */}
          <label>Name</label>

          <TextField
            placeholder="Name"
            value={selectedRow?.name || ''}
            onChange={(e) => setSelectedRow({ ...selectedRow, name: e.target.value })}
          />

          {/* </Box> */}
          <label>Unit</label>
          <TextField
            placeholder="Unit"
            value={selectedRow?.unit || ''}
            onChange={(e) => setSelectedRow({ ...selectedRow, unit: e.target.value })}
          />
          <label>Quantity</label>
          <TextField
            placeholder="Quantity"
            type="number"
            value={selectedRow?.quantity || ''}
            onChange={(e) => setSelectedRow({ ...selectedRow, quantity: e.target.value })}
          />
          <label>Reorder Threshold</label>
          <TextField
            placeholder="Reorder Threshold"
            type="number"
            value={selectedRow?.reorderThreshold || ''}
            onChange={(e) => setSelectedRow({ ...selectedRow, reorderThreshold: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{
          display: 'flex',
          mx: 3,
          gap: 2,
          mt: 1,
          overflow: 'auto' // scroll content if it overflows
        }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
