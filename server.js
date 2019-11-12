require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
const POKEDEX = require('./pokedex.json')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
      }
    next()
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

function handlGetTypes(req, res) {
    res.json(validTypes)
}
app.get('/types', handlGetTypes)

app.get('/pokemon', function handleGetPokemon (req, res) {
    let response = POKEDEX.pokemon;
    if(req.query.name) {
        response = response.filter(pokemon => 
            pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
        )
    }
    if (req.query.type) {
        response = response.filter(pokemon => 
            pokemon.type.includes(req.query.type)
            )
    }
    res.json(response)
})

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})

