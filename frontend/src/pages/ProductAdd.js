import { Box, TextField, Button } from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import axios from 'axios';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(5),
    margin: theme.spacing(2),
    gap: theme.spacing(2),
    backgroundColor: '#fff',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
    },
}));

function ProductAdd() {
    const [formData, setFormData] = useState({
        name: '',
        unit: '',
        quantity: '',
        reorderThreshold: '',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const err = {};
        if (!formData.name) err.name = 'Item name is required';
        if (!formData.unit) err.unit = 'Unit is required';
        if (!formData.quantity || isNaN(formData.quantity)) err.quantity = 'Valid quantity is required';
        if (!formData.reorderThreshold || isNaN(formData.reorderThreshold)) err.reorderThreshold = 'Valid threshold is required';
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const response = await axios.post('http://localhost:7000/api/v1/addproduct', formData);
            console.log('Product added:', response.data);
            alert('Product added successfully!');
            setFormData({ name: '', unit: '', quantity: '', reorderThreshold: '' });
        } catch (err) {
            console.error('Error adding product:', err);
                    if (err.response && err.response.data && err.response.data.message) {
            setErrors({ name: err.response.data.message }); // optionally show under the name field
        } else {
            alert('Failed to add product');
        }
        }
    };

    return (

        <Card variant="outlined" >
            <TextField
                variant="outlined"
                placeholder="Item Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
            />
            <TextField
                variant="outlined"
                placeholder="Unit (kg, ml)"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                error={!!errors.unit}
                helperText={errors.unit}
                fullWidth
            />
            <TextField
                variant="outlined"
                placeholder="Current Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                error={!!errors.quantity}
                helperText={errors.quantity}
                fullWidth
            />
            <TextField
                variant="outlined"
                placeholder="Reorder Threshold"
                value={formData.reorderThreshold}
                onChange={(e) => setFormData({ ...formData, reorderThreshold: e.target.value })}
                error={!!errors.reorderThreshold}
                helperText={errors.reorderThreshold}
                fullWidth
            />
            <Box sx={{  mt: 2 }}>
                <Button variant="contained" onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>

        </Card >



    );
}

export default ProductAdd;
