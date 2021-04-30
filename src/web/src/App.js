import { useCallback, useReducer, useState } from "react";
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";

import DatePickerDropdown from "./DatePickerDropdown";
import HelpModal from "./HelpModal";
import PageDetails from "./PageDetails";
import SearchModal from "./SearchModal";
import Sitemap from "./Sitemap";

import helpIcon from "./win95-bootstrap/icons/help_book_small-1.png";
import searchIcon from "./win95-bootstrap/icons/search_file-1.png";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./win95-bootstrap/win95.css";

const defaultSearchFields = {
  pageNameQuery: "",
  citizenNameQuery: "",
  tagsQuery: "",
};

function App() {
  const [date, setDate] = useState("1999-11-05");
  // path of selected page
  const [path, setPath] = useState(null);
  // path of focused (ie zoomed-in-on) node, if any
  const [focusedPath, setFocusedPath] = useState(null);
  const [searchFields, dispatchSearchFields] = useReducer(
    (fields, newFields) => ({ ...fields, ...newFields }),
    defaultSearchFields,
  )
  const [searchRequest, setSearchRequest] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [sitemapReady, setSitemapReady] = useState(false);

  // see defaultSearchFields for possible props of arg
  const showPrefilledSearch = (fields) => {
    const newFields = {...defaultSearchFields, ...fields};
    dispatchSearchFields(newFields);
    setSearchRequest(newFields);
    setShowSearchModal(true);
  };

  const onSearchClearClick = useCallback(() => {
    dispatchSearchFields(defaultSearchFields)
  }, [])

  const onNodeTap = useCallback((path, alreadySelected, zone, isParent) => {
    setPath(path);
    if (alreadySelected || isParent) {
      setFocusedPath(path);
    }
  }, []);

  const onPanZoom = useCallback(() => {
    setFocusedPath(null);
  }, []);

  const onSitemapReadyChanged = useCallback((ready) => {
    setSitemapReady(ready);
  }, []);

  return (
    <div className="App">
      <HelpModal
        show={showHelpModal}
        loading={!sitemapReady}
        onCloseButtonClick={() => setShowHelpModal(false)}
      />
      <SearchModal
        show={showSearchModal}
        onCloseButtonClick={() => setShowSearchModal(false)}
        date={date}
        onResultClick={(path) => {
          setPath(path);
          setFocusedPath(path);
          setShowSearchModal(false);
        }}
        searchFields={searchFields}
        onSearchFieldsChange={dispatchSearchFields}
        searchRequest={searchRequest}
        onSearchClick={setSearchRequest}
        onClearButtonClick={onSearchClearClick}
      />
      <Container fluid className="h-100">
        <Row>
          <Col>
            <Navbar className="navbar-95" expand="sm">
              <Navbar.Collapse>
                <Navbar.Brand>
                  <h5>Hypnospace Map</h5>
                </Navbar.Brand>
              </Navbar.Collapse>
              {/* Below components not nested in a Nav b/c don't want the behaviour where items become vertical at Navbar's expand breakpoint*/}
              <DatePickerDropdown
                date={date}
                onDatePicked={(date) => {
                  setPath(null);
                  setDate(date);
                }}
              />
              <Nav.Link
                as="button"
                className="mx-1 btn"
                title="Search"
                onClick={() => setShowSearchModal(true)}
              >
                <img src={searchIcon} alt="" height="16" width="16"></img>
              </Nav.Link>
              <Nav.Link
                className="mx-1 btn"
                as="button"
                title="Help"
                onClick={() => setShowHelpModal(true)}
              >
                <img src={helpIcon} alt=""></img>
              </Nav.Link>
            </Navbar>
          </Col>
        </Row>
        <Row className="main-row">
          <Col lg={3} xs={12} className="details-col">
            <div className="my-1 h-100">
              <PageDetails
                date={date}
                path={path}
                onTagClick={(tag) => showPrefilledSearch({ tagsQuery: tag })}
                onCitizenNameClick={(citizenName) =>
                  showPrefilledSearch({ citizenNameQuery: citizenName })
                }
              />
            </div>
          </Col>
          <Col lg={9} xs={12} className="sitemap-col">
            <div className="my-1 h-100">
              <Sitemap
                date={date}
                onTap={onNodeTap}
                selected={path}
                focused={focusedPath}
                onZoneMenuClick={({ zone, path }) => {
                  setPath(path);
                  setFocusedPath(path);
                }}
                onPanZoom={onPanZoom}
                onSitemapReadyChanged={onSitemapReadyChanged}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
