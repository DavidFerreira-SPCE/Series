// No payload package.json , adicionar "start": nodemon + (Nome do arquivo.js)
// ex: "start": "nodemon index.js (é o nome do nosso arquivo)"

const express = require('express');
const app = express();
const pool = require('./dB');
//--//
app.use(express.json());

// TODOS AS REQUISIÇÕES NAS APIs precisam ser LETRA MINUSCULA, SEU CABISBAIXO
app.get('/series',async (_,res) => {
    try {
        const series = await pool.query('SELECT * FROM series');
        res.status(200).json(series.rows);
    } catch (err) {
        console.error('erro ao buscar série', err);
        res.status(500).json({error: 'Falha na busca de série'});
    }
});

app.post('/series', async (req,res) => {
    const { id, title, yearexhibition, gender_id, rating_id, season_id, status } = req.body;
    try {
        const series = await pool.query(
            'INSERT INTO series(id, title, yearexhibition, gender_id, rating_id, season_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
             [id, title, yearexhibition, gender_id, rating_id, season_id, status]
            );
     res.status(201).json(series.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar série', err)
        res.status(500).json({error: 'Falha ao adicionar uma série'})
    }
});

app.put ('/series/:id', async(req,res) => {
    const { id } = req.params;
    const { title, yearexhibition, gender_id, rating_id, season_id, status } = req.body;

    try {
        const series = await pool.query(
            'UPDATE series SET title = $1, yearexhibition = $2, gender_id = $3, rating_id = $4, season_id = $5, status = $6 WHERE id = $7'
            [title, yearexhibition, gender_id, rating_id, season_id, status, id]
        )
        

    if (series.rowcount === 0) {
        return res.status(404).json ({error: 'Não existe esta série na DataBase'})
    }   
        res.status(200).json(series.rows[0]);
    } catch (err) {
    console.error('Falha ao adicionar tarefa, Verifique os dados e tente novamente',err)
    res.status(500).json ({error: 'Erro ao adicionar serie no Banco' })
    }
});

app.delete ('/series/:id'), async (req, res) => {
    const { id } = req.params;

    try {
        const tarefas = await pool.query ('DELETE FROM series WHERE id = $1 RETURNING *', [id]);
        if (tarefas.rowCount === 0) {
            return res.status(404).json({ error: 'Série não está no banco, Impossivel a exclusão'});
        }
        res.status(200).json({ message: 'Série excluída do banco com sucesso'});
    } catch (err) {
        console.error ('Erro ao deletar série:', err);
        res.status(500).json({ error: 'Erro em remover a Série do banco'})
    }
};


//--//
const PORT = 3000;
app.listen(PORT, ()=> {
   console.log (`Servidor iniciado na porta ${PORT}`);
});