import { Modal, Button } from "react-bootstrap";
import { useState, useCallback } from "react";
import SearchFields from "./SearchFields";
import SearchResults from "./SearchResults";
import searchIcon from "./win95-bootstrap/icons/search_file-1.png";

export default function SearchModal({
  date,
  onResultClick,
  searchFields,
  onSearchFieldsChange,
  searchRequest,
  onSearchClick,
  show,
  onCloseButtonClick,
}) {
  onCloseButtonClick = onCloseButtonClick || (() => {});

  const [disabled, setDisabled] = useState(false);
  const loadingStart = useCallback(() => setDisabled(true), []);
  const loadingEnd = useCallback(() => setDisabled(false), []);

  return (
    <Modal show={show} onHide={onCloseButtonClick} animation={false} size="lg">
      <Modal.Header>
        <Modal.Title>
          <img className="m-1" src={searchIcon} alt="" width="24" height="24"></img>
          Search {date}
        </Modal.Title>
        <Button variant="secondary" className="win95-close" onClick={onCloseButtonClick}>
          <span aria-hidden="true">×</span>
          <span className="sr-only">Close</span>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <SearchFields
          onSearchClicked={onSearchClick}
          searchFields={searchFields}
          onSearchFieldsChange={onSearchFieldsChange}
          disabled={disabled}
        />
        <hr></hr>
        <SearchResults
          date={date}
          searchRequest={searchRequest}
          onResultClick={onResultClick}
          onLoadingStart={loadingStart}
          onLoadingEnd={loadingEnd}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCloseButtonClick}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
