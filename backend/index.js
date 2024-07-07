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

  if (!body.name) {
    response.status(400).json({
      error: 'name missing'
    })
    return
  }

  if (!body.number) {
    response.status(400).json({
      error: 'number missing'
    })
    return
  }

  // if (Person.find(person => person.name === body.name)) {
  //   response.status(409).json({
  //     error: 'name must be unique'
  //   })
  //   return
  // }

  // const person = {
  //   id: generateId(),
  //   name: body.name,
  //   number: body.number,
  // }

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

  const note = {
    name: request.body.name,
    number: request.body.number
  }

  Person
    .findByIdAndUpdate(id, note, { new: true })
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
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
