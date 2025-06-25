const {Pool} = require('pg')


const pool = new Pool({
    user:'david',
    host:'localhost',
    database:'series',
    password:'wcc@2023',
    port:5432,
});



pool.connect()
.then(()=>console.log('conectado ao postgre'))
.catch(err=>console.error('erro na conexão'));


module.exports= pool