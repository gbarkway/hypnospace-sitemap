import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

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

export default function SearchResults({date, searchFields, onResultClick}){
    const [searchResults, setSearchResults] = useState([]);
    const [errorVisible, setErrorVisible] = useState(false);

    onResultClick = onResultClick || (() => {});
    useEffect(() => {
        if (!searchFields) return;
        fetch(buildUrl(date, searchFields))
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error('Search error');
                }
            })
            .then(setSearchResults)
            .then(setErrorVisible(false))
            .catch(() => setErrorVisible(true));
    }, [searchFields, date]);

    return (
        <div>
            <h5>Search Results</h5>
            <p className="text-error">{errorVisible ? "Error!" : ""}</p>
            <p>{searchResults.length} results</p>
            <div className="search-results">
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO: "link" variant buttons in win95 theme look like buttons, not links
                        TODO: text should be left-justified 
                        TODO: each row takes up too much space (font too big, too much padding)*/}
                        {searchResults.map((r, i) => <tr key={`searchresult-${i}`}><td><Button variant="link" onClick={() => onResultClick(r.path)}>{r.name}</Button></td></tr>)}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}