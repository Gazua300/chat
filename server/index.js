const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const { Server } = require('socket.io')
const con = require('./src/connection/connection')


//SOCKET CONNECTION
const options = {
    cors: true,
    origin: ['http://localhost:3003']
}

const server = app.listen(3003, ()=>{
    console.log('Servidor rondando em http://localhost:3003')
})

const io = new Server(server, options)


//ENDPOINTS
app.post('/signup', (req, res)=>{
    const { nickname } = req.body
    const getuser = `SELECT * FROM chat_users WHERE nickname = '${nickname}'`
    const id = Date.now().toString(18)
    const sql = `INSERT INTO chat_users VALUES(?,?)`

    con.query(getuser, (error, user)=>{
        if(error){
            res.status(404).send(error)
        }else if(user.length > 0){
            res.status(403).send('Já existe um usuário com esse nome')
        }else{
            con.query(sql, [id, nickname], error=>{
                if(error){
                    res.status(500).send(`Falha ao registrar usuário: ${error}`)
                }else{
                    res.status(201).send({id, nickname})
                }
            })
        }
    })
})

app.get('/users', (req, res)=>{
    con.query('SELECT * FROM chat_users', (error, users)=>{
        if(error){
            res.status(404).send(`Erro ao buscar usuários: ${error}`)
        }else{
            res.send(users)
        }
    })
})

app.post('/messages', (req, res)=>{
    const { sender, message } = req.body
    const getuser = `SELECT * FROM chat_users WHERE nickname = '${sender}'`
    const sql = `INSERT INTO chat_messages VALUES(?,?,?)`
    const id = Date.now().toString(18)


    con.query(getuser, (error, user)=>{
        if(error){
            res.status(404).send(`Usuário não encontrado: ${error}`)
        }else{
            if(user.length > 0){
                con.query(sql, [id, user[0].nickname, message], error=>{
                    if(error){
                        res.status(500).send(`Falha ao enviar messagem: ${error}`)
                    }else{
                        res.send('Mensagem enviada')
                    }
                })
            }else{
                res.status(404).send(`Usuário não encontrado ${error}`)
            }
        }
    })
})

app.delete('/signout/:id', (req, res)=>{
    const getuser = `SELECT * FROM chat_users WHERE id = '${req.params.id}'`
    const sql = `
        DELETE FROM chat_users WHERE id = '${req.params.id}'
    `

    con.query(getuser, (error, user)=>{
        if(error){
            res.status(404).send(`Usuário não encontrado: ${error}`)
        }else if(user.length > 0){
            con.query(sql, error=>{
                if(error){
                    res.status(500).send(`Erro ao deslogar usuário: ${error}`)
                }else{
                    res.send(`${user[0].nickname} deslogado`)
                }
            })
        }else{
            res.status(404).send(`Usuário não encontrado ${error}`)
        }
    })    
})
