import { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";

const buildUrl = (date, {pageNameQuery, userNameQuery, tagsQuery}) => {
    const url = new URL(`${process.env.REACT_APP_PAGE_SERV_URL}/captures/${date}/pages`, window.location.origin);
    if (pageNameQuery && pageNameQuery.length) {
        url.searchParams.append("nameOrDescription", pageNameQuery);
    }
    if (userNameQuery && userNameQuery.length) {
        url.searchParams.append("user", userNameQuery);
    }
    if (tagsQuery && tagsQuery.length) {
        url.searchParams.append("tags", tagsQuery);
    }
    return url.href;
    
}

export default function SearchResults({date, searchRequest, onResultClick}){
    const [searchResults, setSearchResults] = useState([]);
    const [errorVisible, setErrorVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    onResultClick = onResultClick || (() => {});
    useEffect(() => {
        if (!searchRequest) return;
        setLoading(true);
        fetch(buildUrl(date, searchRequest))
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error('Search error');
                }
            })
            .then(setSearchResults)
            .then(() => setErrorVisible(false))
            .catch(() => setErrorVisible(true))
            .finally(() => setLoading(false));
    }, [searchRequest, date]);

    if (!searchRequest) return null;
    return (
        <div>
            <h5>
                Search Results ({searchResults.length})
                    <Spinner
                        size="sm"
                        animation="border"
                        role="status"
                        style={
                            {
                                "visibility": (loading ? "visible" : "hidden"),
                            }
                        }>
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </h5>
            <p className="text-error">{errorVisible ? "Error!" : ""}</p>
            <div className="search-results">
                <Table size="sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Zone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.map((r, i) => (
                            <tr key={`searchresult-${i}`}>
                                <td>
                                    <Button 
                                        variant="link" 
                                        onClick={() => onResultClick(r.path)} 
                                        className="text-left">
                                            {r.name}
                                    </Button>
                                </td>
                                <td>
                                    {r.zone}
                                </td>
                            </tr>))}
                        {!searchResults.length ? <tr><td className="text-muted">No results found</td></tr> : null}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}