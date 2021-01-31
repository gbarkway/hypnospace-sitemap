import { useEffect, useState } from "react";

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
            {searchResults.map((r, i) => <p key={`searchresult-${i}`}>{r.name}</p>)}
        </div>
    );
}