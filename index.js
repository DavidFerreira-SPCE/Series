const express = require('express');
const app = express();
const pool = require('./db');



const PORT = 3000;
app.listen(PORT, ()=> {
   console.log (`Servidor iniciado na porta ${PORT}`);
});