import "./App.css";
import { useState, useCallback } from "react";
import PageDetails from "./PageDetails";
import Sitemap from "./Sitemap";
import HelpModal from "./HelpModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./win95-bootstrap/win95.css";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import SearchModal from "./SearchModal";
import githubLogo from "./GitHub-Mark-32px.png";
import helpIcon from "./win95-bootstrap/icons/help_book_small-1.png";
import searchIcon from "./win95-bootstrap/icons/search_file-1.png";
import DatePickerDropdown from "./DatePickerDropdown";

const defaultSearchFields = {
  pageNameQuery: "",
  userNameQuery: "",
  tagsQuery: "",
};

function App() {
  const [date, setDate] = useState("1999-11-05");
  // path of selected page
  const [path, setPath] = useState(null);
  // path of focused (ie zoomed-in-on) node, if any
  const [focusedPath, setFocusedPath] = useState(null);
  const [searchFields, setSearchFields] = useState({ ...defaultSearchFields });
  const [searchRequest, setSearchRequest] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // see defaultSearchFields for possible props of arg
  const showPrefilledSearch = (fields) => {
    const newFields = { ...defaultSearchFields, ...fields };
    setSearchFields(newFields);
    setSearchRequest(newFields);
    setShowSearchModal(true);
  };

  const onNodeTap = useCallback((path, alreadySelected, zone, isParent) => {
    setPath(path);
    if (isParent) {
      setFocusedPath(zone);
    } else if (alreadySelected) {
      setFocusedPath(path);
    }
  }, []);

  const onPanZoom = useCallback(() => {
    setFocusedPath(null);
  }, []);

  return (
    <div className="App">
      <HelpModal show={showHelpModal} onCloseButtonClick={() => setShowHelpModal(false)} />
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
        onSearchFieldsChange={setSearchFields}
        searchRequest={searchRequest}
        onSearchClick={setSearchRequest}
      />
      <Container fluid className="h-100">
        <Row>
          <Col>
            <Navbar className="navbar-95" expand="sm" collapseOnSelect={true}>
              <Navbar.Brand>
                <h5>Hypnospace Map</h5>
              </Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Nav>
                  <DatePickerDropdown
                    date={date}
                    onDatePicked={(date) => {
                      setPath(null);
                      setDate(date);
                    }}
                  />
                  <Nav.Link
                    as="button"
                    className="mx-1 btn btn-light"
                    eventKey="1"
                    title="Search"
                    onClick={() => setShowSearchModal(true)}
                  >
                    <img src={searchIcon} alt="" height="16" width="16"></img>
                  </Nav.Link>
                  <Nav.Link
                    className="mx-1 btn btn-light"
                    as="button"
                    eventKey="2"
                    title="Help"
                    onClick={() => setShowHelpModal(true)}
                  >
                    <img src={helpIcon} alt=""></img>
                  </Nav.Link>
                  <Nav.Link
                    className="mx-1 btn btn-light"
                    target="_blank"
                    eventKey="3"
                    title="GitHub"
                    href="https://github.com/gbarkway/hypnospace-sitemap"
                  >
                    <img src={githubLogo} width="16px" height="16px" alt=""></img>
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Col>
        </Row>
        <Row className="main-row">
          <Col lg={3} xs={12} className="details-col">
            <div className="my-1 h-100">
              <PageDetails
                date={date}
                path={path}
                onTagClick={(t) => showPrefilledSearch({ tagsQuery: t })}
                onUserNameClick={(userName) => showPrefilledSearch({ userNameQuery: userName })}
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
                  setFocusedPath(zone);
                }}
                onPanZoom={onPanZoom}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
