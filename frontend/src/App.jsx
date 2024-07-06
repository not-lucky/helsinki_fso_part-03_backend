import { useEffect, useState } from 'react'
import SearchFilter from './components/SearchFilter'
import PersonForm from './components/PersonForm'
import ShowPersons from './components/ShowPersons'
import personService from "./services/persons"
import Notification from './components/Notification'

import "./index.css"

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ type: "blank", message: "" })

  const filteredPersons = filter === ''
    ? persons
    : persons.filter(
      person =>
        person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    )


  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])



  return (
    <div>
      <h2>Phonebook</h2>

      <Notification notification={notification} />

      <SearchFilter filter={filter} setFilter={setFilter} />


      <PersonForm persons={persons} newNum={newNum} newName={newName} setNewName={setNewName} setNewNum={setNewNum} setPersons={setPersons} setNotification={setNotification} />

      <ShowPersons filteredPersons={filteredPersons} persons={persons} setPersons={setPersons} setNotification={setNotification} />
    </div>
  )
}

export default App
