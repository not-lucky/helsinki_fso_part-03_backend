const Persons = ( { filteredPersons, handleDelete } ) => {
  return (
    <>
      { filteredPersons.map( person =>
        <li key={ person.id }> { person.name } { person.number }
          <button onClick={ () => handleDelete( person.id ) }>delete</button>
        </li> ) }
    </>
  );
};

export default Persons;
