import { Box, TextField, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function Comsumer() {
    const [rows, setRows] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [editedQuantities, setEditedQuantities] = React.useState({});

    const fetchData = () => {
        axios.get('http://localhost:7000/api/v1/getproduct')
            .then((res) => {
                const mappedRows = res.data.items.map((item) => ({
                    ...item,
                    id: item._id,
                }));
                setRows(mappedRows);
            })
            .catch((err) => console.error('Fetch error:', err));
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleQuantityChange = async (id) => {
        const newQuantity = editedQuantities[id];
        const item = rows.find(row => row._id === id);
        if (!item || newQuantity == null || newQuantity === item.quantity) return;

        try {
            const quantityUsed = item.quantity - newQuantity;

            // Update quantity
            await axios.patch(`http://localhost:7000/api/v1/consumer/${id}/quantity`, {
                quantity: newQuantity
            });

            // Log consumption only if quantity is reduced
            if (quantityUsed > 0) {
                await axios.post(`http://localhost:7000/api/v1/consume/${id}`, {
                    quantityUsed,
                    consumer: 'admin'
                });
            }

            setEditedQuantities((prev) => ({ ...prev, [id]: undefined }));
            fetchData();
        } catch (error) {
            console.error("❌ Failed to update quantity or log consumption:", error);
        }
    };

    const handleInputChange = (id, value) => {
        if (!isNaN(value)) {
            setEditedQuantities((prev) => ({ ...prev, [id]: Number(value) }));
        }
    };

    const filteredRows = rows.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Item Name', width: 160 },
        { field: 'unit', headerName: 'Unit', width: 100 },
        {
            field: 'quantity',
            headerName: 'Quantity',
            width: 250,
            renderCell: (params) => {
                const id = params.row._id;
                const currentQuantity = params.row.quantity;
                const quantity = editedQuantities[id] ?? currentQuantity;

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                            size="small"
                            onClick={() => setEditedQuantities(prev => ({
                                ...prev,
                                [id]: Math.max(0, (prev[id] ?? currentQuantity) - 1)
                            }))}
                        >
                            <RemoveIcon fontSize="small" />
                        </IconButton>

                        <TextField
                            value={quantity}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (!isNaN(val)) {
                                    setEditedQuantities((prev) => ({ ...prev, [id]: val }));
                                }
                            }}
                            size="small"
                            sx={{ width: 60 }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleQuantityChange(id);
                            }}
                        />

                        <IconButton
                            size="small"
                            onClick={() => setEditedQuantities(prev => ({
                                ...prev,
                                [id]: (prev[id] ?? currentQuantity) + 1
                            }))}
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(id)}
                            title="Save"
                            color="primary"
                        >
                            ✅
                        </IconButton>
                    </Box>
                );
            }
        }
    ];

    return (
        <Box sx={{ m: 2 }}>
            <TextField
                label="Search Item"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ mb: 2 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSizeOptions={[5]}
                paginationModel={{ pageSize: 5, page: 0 }}
                disableRowSelectionOnClick
            />
        </Box>
    );
}

export default Comsumer;
