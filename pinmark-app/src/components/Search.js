function Search() {

    return (
        <div className="input-group rounded">
            <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon"/>
            <span className="input-group-text-border-0" id="search-addon">
                <button type="button" className="btn btn-outline-primary">search</button>
            </span>
        </div>
    )
}

export default Search;