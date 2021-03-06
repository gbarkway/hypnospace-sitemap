import { Modal, Button } from "react-bootstrap";
import SearchFields from "./SearchFields"
import SearchResults from "./SearchResults"
import searchIcon from "./win95-bootstrap/icons/search_file-1.png"

export default function SearchModal({date, onResultClick, searchFields, onSearchFieldsChange, searchRequest, onSearchClick, show, onCloseButtonClick}) {
    onCloseButtonClick = onCloseButtonClick || (() => { })

    return (
        <Modal show={show} onHide={onCloseButtonClick} animation={false} size="lg">
            <Modal.Header>
                <Modal.Title>
                    <img className="m-1" src={searchIcon} alt="" width="24" height="24"></img>
                    Search {date}
                </Modal.Title>
                <Button variant="secondary" className="win95-close" onClick={onCloseButtonClick}>
                    <span>×</span>
                </Button>
            </Modal.Header>
            <Modal.Body>
                <SearchFields onSearchClicked={onSearchClick} searchFields={searchFields} onSearchFieldsChange={onSearchFieldsChange} />
                <hr></hr>
                <SearchResults date={date} searchRequest={searchRequest} onResultClick={onResultClick} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onCloseButtonClick}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}