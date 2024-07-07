require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


const MAX = 100000000000
const MIN = 10



const app = express()

app.use(express.static('dist'))
app.use(cors())

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// const fillDB = () => {

//   const persons = [
//     {
//       "name": "Dan Abramov",
//       "number": "12-43234345",
//       "id": "6689f9e838409ba0845350d4"
//     },
//     {
//       "name": "Mary Poppendieck",
//       "number": "39-236423122",
//       "id": "6689f9e838409ba0845350d5"
//     },
//     {
//       "name": "Ada Lovelace",
//       "number": "39-445323523",
//       "id": "6689f9e838409ba0845350d3"
//     },
//     {
//       "name": "Arto Hellas",
//       "number": "040-123456",
//       "id": "6689f9e838409ba0845350d2"
//     },
//   ]


//   app.get('/api/persons', (req, res, next) => {
//     persons.forEach(p => {
//       new Person({
//         name: p.name,
//         number: p.number
//       }).save().then(res => console.log(`${res.name} saved`))
//     })

//   })
// }

// fillDB()

app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then(res => {
      // console.log('res', res)
      response.json(res)
    })
    .catch(err => next(err))

})

app.get('/info', (request, response, next) => {
  const now = new Date()
  // console.log(now)
  Person
    .estimatedDocumentCount({})
    .then(count => response.send(`Phonebook has info for ${count} people. <br /> ${now}`))
    .catch(err => next(err))

  // response.send(`Phonebook has info for ${n} people. <br /> ${now}`)
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person
    .findById(id)
    .then((person) => {
      if (person) response.json(person)
      else response.status(404).end()
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person
    .findByIdAndDelete(id)
    .then(result => response.status(204).end())
    .catch(err => next(err))
})


const generateId = () => {
  return Math.floor((Math.random() * (MAX - MIN + 1)) + MIN).toString()
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    // id: generateId(),
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((res) => {
      console.log(`${res.name} saved successfullt`)
      response.json(res)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body

  const note = {
    name, number
  }

  Person
    .findByIdAndUpdate(
      id,
      note,
      { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(err => next(err))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
