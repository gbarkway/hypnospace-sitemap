import {Card } from "react-bootstrap";
import SearchFields from "./SearchFields";
import SearchResults from "./SearchResults";

//searchFields: the text inputs
//searchRequest: query sent to web service
export default function SearchPane({date, onResultClick, searchFields, onSearchFieldsChange, searchRequest, onSearchClick}) {

    //TODO: select zone to filter by
    //TODO: "index" tab where all pages are listed (one zone at a time?)
    return (
        <div id="search">
            <Card className="square">
                <Card.Header>
                    <b>Search</b>
                </Card.Header>
                <Card.Body>
                    <SearchFields onSearchClicked={onSearchClick} searchFields={searchFields} onSearchFieldsChange={onSearchFieldsChange}/>
                    <hr></hr>
                    <SearchResults date={date} searchRequest={searchRequest} onResultClick={onResultClick}/>
                </Card.Body>
            </Card>
        </div>
    )
}