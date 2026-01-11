const Filter = ( { filter, setFilter } ) => {
  return (
    <div>filter shown with a new
      <input type="text" value={ filter } onChange={ ( event ) => setFilter( event.target.value ) } />
    </div>
  );
};

export default Filter;
