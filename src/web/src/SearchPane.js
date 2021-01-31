import {Card } from "react-bootstrap";
import SearchFields from "./SearchFields";
import SearchResults from "./SearchResults";
import { useState, useEffect } from "react";

export default function SearchPane() {
    const [searchFields, setSearchFields] = useState(null);

    useEffect(() => {
        console.log(searchFields);
    }, [searchFields])

    return (
        <div id="search">
            <Card className="square">
                <Card.Header>
                    <b>Search</b>
                </Card.Header>
                <Card.Body>
                    <SearchFields onSearchClicked={setSearchFields}/>
                    <hr></hr>
                    <SearchResults />
                </Card.Body>
            </Card>
        </div>
    )
}