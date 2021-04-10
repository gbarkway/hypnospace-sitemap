import { Col, Button, Modal, Row } from "react-bootstrap";
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
  onResultClick = onResultClick || (() => {});
  onSearchFieldsChange = onSearchFieldsChange || (() => {});
  onSearchClick = onSearchClick || (() => {});
  show = show || false;
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
        <Row>
          <Col lg={5} xs={12}>
            <SearchFields
              onSearchClicked={onSearchClick}
              searchFields={searchFields}
              onSearchFieldsChange={onSearchFieldsChange}
              disabled={disabled}
            />
          </Col>
          <Col lg={7} xs={12}>
            <SearchResults
              date={date}
              searchRequest={searchRequest}
              onResultClick={onResultClick}
              onLoadingStart={loadingStart}
              onLoadingEnd={loadingEnd}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCloseButtonClick}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
