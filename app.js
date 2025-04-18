const express = require('express')
const pool =require('./config/db')

const app = express();
app.use(express.json());

app.get('/products',async(req,res)=>{
    try {
        const result = await pool.query('SELECT * FROM product');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error'); 
    }
});
app.listen(9000, () => {
    console.log(`Server running on port`);
  });
