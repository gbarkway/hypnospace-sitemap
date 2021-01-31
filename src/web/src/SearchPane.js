import {Card } from "react-bootstrap";
import SearchFields from "./SearchFields";
import SearchResults from "./SearchResults";

export default function SearchPane() {
    return (
        <div id="search">
            <Card className="square">
                <Card.Header>
                    <b>Search</b>
                </Card.Header>
                <Card.Body>
                    <SearchFields onSearchClicked={(fields) => console.log(fields)}/>
                    <hr></hr>
                    <SearchResults />
                </Card.Body>
            </Card>
        </div>
    )
}