import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const buildUrl = (date, {pageNameQuery, userNameQuery, tagsQuery}) => {
    const url = new URL(`http://localhost:3000/captures/${date}/pages/`);
    if (pageNameQuery && pageNameQuery.length) {
        //TODO: page name/description

    }
    if (userNameQuery && userNameQuery.length) {
        url.searchParams.append("user", userNameQuery);
    }
    if (tagsQuery && tagsQuery.length) {
        url.searchParams.append("tags", tagsQuery);
    }
    return url.href;
    
}

export default function SearchResults({date, searchFields}){
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!searchFields) return;
        fetch(buildUrl(date, searchFields))
            .then((res) => res.json())
            .then(setSearchResults);
    }, [searchFields, date]);

    return (
        <div>
            <h5>Search Results</h5>
            <div class="search-results">
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.map((r, i) => <tr key={`searchresult-${i}`}><td>{r.name}</td></tr>)}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}