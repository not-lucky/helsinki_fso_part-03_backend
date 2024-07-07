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

// app.use(requestLogger)


// app.get('/', (request, response) => {
//   response.send('<h1>try a valid endpoint maybe?</h1>')
// })

app.get('/api/persons', (request, response) => {
  console.log(`called`)
  Person.find({}).then(res => {
    // console.log('res', res)
    response.json(res)
  }
  )

})

app.get('/info', (request, response) => {
  const now = new Date()
  // console.log(now)
  const n = phonebook.length
  response.send(`Phonebook has info for ${n} people. <br /> ${now}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = phonebook.find(person => person.id === id)
  // console.log('id', id)
  if (person) { response.json(person) } else { response.status(404).end() }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(person => person.id !== id)
  response.status(204).end()
})


const generateId = () => {
  return Math.floor((Math.random() * (MAX - MIN + 1)) + MIN).toString()
}

app.post('/api/persons', (request, response) => {
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
    id: generateId(),
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((res) => {
      console.log(`${res.name} saved successfullt`)
      response.json(res)
    })
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
