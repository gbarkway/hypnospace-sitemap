import {Card } from "react-bootstrap";
import SearchFields from "./SearchFields";
import SearchResults from "./SearchResults";
import searchIcon from "./win95-bootstrap/icons/search_file-2.png"

//searchFields: the text inputs
//searchRequest: query sent to web service
export default function SearchPane({date, onResultClick, searchFields, onSearchFieldsChange, searchRequest, onSearchClick}) {
    return (
        <div id="search">
            <Card className="square">
                <Card.Header>
                    <img src={searchIcon} alt=""></img>
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