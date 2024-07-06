const SearchFilter = ({ filter, setFilter }) => {
  return (
    <>
      filter shown with <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </>
  )
}

export default SearchFilter
