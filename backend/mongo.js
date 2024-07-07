const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

const url = `mongodb+srv://replicasizedrank:${password}@cluster0.ka6nbmh.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

// mongoose.connect(url).then(() => {
//   const personSchema = new mongoose.Schema({
//     name: String,
//     number: String,
//   })

//   const Person = mongoose.model('Person', personSchema)

//   persons.forEach((p) => {
//     const person = new Person({ name: p.name, number: p.number })
//     person.save().then((res) => { console.log('res', res) })
//   })
// })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)

if (name && number) {
  const person = new Person({
    name, number
  })

  person
    .save()
    .then(result => {
      console.log(`${name} saved successfully`)
      mongoose.connection.close()
    })
}
else {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
