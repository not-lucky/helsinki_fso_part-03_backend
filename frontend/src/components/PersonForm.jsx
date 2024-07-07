import personService from "../services/persons";



const PersonForm = ({ persons, newName, newNum, setNewName, setNewNum, setPersons, setNotification }) => {

  const addPerson = (event) => {
    event.preventDefault();

    const tempPerson = { name: newName, number: newNum };
    console.log('tempPerson', tempPerson)

    const personInPhoneBook = persons.find(person => person.name.toLocaleLowerCase() === newName.toLocaleLowerCase())

    if (!personInPhoneBook) {
      console.log(`not in db`)
      personService
        .create(tempPerson)
        .then(response => {

          setPersons(persons.concat(response))
          setNewName("")
          setNewNum('')

          setNotification({ type: "success", message: `Added ${newName}` })
          setTimeout(() => {
            setNotification({ type: "blanck" })
          }, 5000);
        })
        .catch(err => {
          console.log('err', err.response.data.error)

          setNotification({ type: "error", message: err.response.data.error })
          setTimeout(() => {
            setNotification({ type: "blanck" })
          }, 5000);
        })
    } else {
      if (personInPhoneBook.number === newNum) {
        alert("Same name and number already in phonebook!")
      }
      else if (confirm(`${newName} is already added to phonebook, replace old number with new one?`)) {
        personService
          .update(personInPhoneBook.id, tempPerson)
          .then(res => {
            console.log('older person', personInPhoneBook)
            console.log('update person', res)
            setPersons(persons.map(person => personInPhoneBook.id !== person.id ? person : res))

            setNotification({ type: "success", message: `${newName} has been updated in the server.` })
            setTimeout(() => {
              setNotification({ type: "blanck" })
            }, 5000);

          })
          .catch((err) => {

            // setNotification({ type: "error", message: `${newName} has already been removed from server.` })
            console.log('err', err)
            setNotification({ type: "error", message: err.response.data.error })
            setTimeout(() => {
              setNotification({ type: "blanck" })
            }, 5000);

          })
      }
    }
  }

  return (
    <>
      <h2>add a new</h2>

      <form onSubmit={addPerson}>
        <div>
          name: <input onChange={(e) => setNewName(e.target.value)} value={newName} />

        </div>
        <div>
          number: <input onChange={(e) => setNewNum(e.target.value)} value={newNum} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

    </>
  )
}

export default PersonForm
