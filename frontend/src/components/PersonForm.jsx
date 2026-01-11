const PersonForm = ( { handleSubmit, newPerson, setNewPerson } ) => {
  return (
    <form onSubmit={ handleSubmit }>
      <div>name: <input onChange={ ( event ) => setNewPerson( { ...newPerson, name: event.target.value } ) } value={ newPerson.name } /></div>
      <div>number: <input onChange={ ( event ) => setNewPerson( { ...newPerson, number: event.target.value } ) } value={ newPerson.number } /></div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );

};

export default PersonForm;
