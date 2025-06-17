const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db_config/db_config');
const productRoutes = require('./routers/product_routes');
const forecast = require('./routers/transactionRouters');
const user =require('./routers/userRoutes')
dotenv.config();
const app = express();
const PORT = process.env.PORT || 7000;
app.use(cors());
app.use(express.json());
app.use('/api/v1', productRoutes);
app.use('/api/v1', forecast);
app.use('/api/v1/users', user);




// ✅ connect to MongoDB and then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});
