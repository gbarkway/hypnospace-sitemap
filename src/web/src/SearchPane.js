import {Card } from "react-bootstrap";
import SearchFields from "./SearchFields";
import SearchResults from "./SearchResults";
import { useState, useEffect } from "react";

export default function SearchPane({date, onResultClick}) {
    const [searchFields, setSearchFields] = useState(null);

    useEffect(() => {
        console.log(searchFields);
    }, [searchFields])

    //TODO: "index" tab where all pages are listed (one zone at a time?)
    return (
        <div id="search">
            <Card className="square">
                <Card.Header>
                    <b>Search</b>
                </Card.Header>
                <Card.Body>
                    <SearchFields onSearchClicked={setSearchFields}/>
                    <hr></hr>
                    <SearchResults date={date} searchFields={searchFields} onResultClick={onResultClick}/>
                </Card.Body>
            </Card>
        </div>
    )
}