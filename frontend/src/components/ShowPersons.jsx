import personService from "../services/persons"


const ShowPersons = ({ filteredPersons, persons, setPersons, setNotification }) => {
  const removePerson = (person) => {
    if (confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(person.id)
        .then(res => {
          console.log('res', res)
          const personToRemove = person
          setPersons(persons.filter(person => person.id !== personToRemove.id))
        })
        .catch(() => {

          setNotification({ type: "error", message: `${person.name} has already been removed from server.` })
          setTimeout(() => {
            setNotification({ type: "blanck" })
          }, 5000);

        })
    }
  }

  return (
    <>
      <h2>Numbers</h2>
      {filteredPersons.map(person => {
        return (
          <div key={person.id}>
            <span >{person.name} {person.number} </span>
            <button onClick={() => removePerson(person)}>delete</button>
            <br />
          </div>)
      })}
    </>
  )
}

export default ShowPersons
