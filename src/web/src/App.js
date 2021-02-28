import './App.css';
import { useState, useCallback } from "react";
import PageDetails from "./PageDetails";
import Sitemap from "./Sitemap";
import TutorialModal from "./TutorialModal";
import 'bootstrap/dist/css/bootstrap.min.css';
import './win95-bootstrap/win95.css';
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import SearchModal from "./SearchModal";
import githubLogo from "./GitHub-Mark-32px.png";
import helpIcon from "./win95-bootstrap/icons/help_book_small-1.png"
import searchIcon from "./win95-bootstrap/icons/search_file-1.png"
import DatePickerDropdown from "./DatePickerDropdown"

const defaultSearchFields = {
  pageNameQuery: "",
  userNameQuery: "",
  tagsQuery: "",
}

function App() {
  const [date, setDate] = useState("1999-11-05"); // TODO: use context instead of storing all state in root app
  const [path, setPath] = useState(null);
  const [focused, setFocused] = useState(null);
  const [searchFields, setSearchFields] = useState({ ...defaultSearchFields });
  const [searchRequest, setSearchRequest] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const updateFieldsAndSearch = (fieldstoUpdate) => {
    const newFields = { ...defaultSearchFields, ...fieldstoUpdate };
    setSearchFields(newFields);
    setSearchRequest(newFields);
    setShowSearchModal(true);
  }

  const onNodeTap = useCallback((path, alreadySelected, zone, isParent) => {
    setPath(path);
    if (isParent) {
      setFocused(zone);
    } else if (alreadySelected) {
      setFocused(path);
    }
  }, []);

  const onPanZoom = useCallback(() => {
    setFocused(null);
  }, [])

  //TODO: link to cytoscape, win95 css, etc.
  //TODO: tooltips for links
  //TODO: accessibility properties
  //TODO: make easier to use on smaller screens
  //TODO: when navbar is too narrow, there's ugly overflow and date picker is nearly hidden
  //TODO: full height of sitemap and page description should always be visible in entirety on narrow screens
  //TODO: make navbar sticky
  return (
    <div className="App">
      <TutorialModal show={showHelpModal} onCloseButtonClick={() => setShowHelpModal(false)}></TutorialModal>
      <SearchModal 
        show={showSearchModal} 
        onCloseButtonClick={() => setShowSearchModal(false)} 
        date={date}
        onResultClick={(path) => {
          setPath(path);
          setFocused(path);
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
              <Navbar.Brand>Hypnospace Map</Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Nav>
                    <DatePickerDropdown
                      value={date}
                      onDatePicked = {(date) => {
                        setPath(null);
                        setDate(date);
                      }}
                    />
                  <Nav.Link as="button" className="mx-1 btn btn-secondary" eventKey="1" title="Search" onClick={() => setShowSearchModal(true)}><img src={searchIcon} alt="" height="16" width="16"></img></Nav.Link>
                  <Nav.Link className="mx-1 btn btn-secondary" as="button" eventKey="2" title="Help" onClick={() => setShowHelpModal(true)}><img src={helpIcon} alt=""></img></Nav.Link>
                  <Nav.Link className="mx-1 btn btn-secondary" target="_blank" eventKey="3" title="GitHub" href="https://github.com/gbarkway/hypnospace-sitemap"><img src={githubLogo} width="16px" height="16px" alt=""></img></Nav.Link>
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
                onTagClick={(t) => updateFieldsAndSearch({ tagsQuery: t })}
                onUserNameClick={(userName) => updateFieldsAndSearch({ userNameQuery: userName })} />
            </div>
          </Col>
          <Col lg={9} xs={12} className="sitemap-col">
            <div className="my-1 h-100">
              <Sitemap
                date={date}
                onTap={onNodeTap}
                selected={path}
                focused={focused}
                onZoneMenuClick={({ zone, path }) => {
                  setPath(path);
                  setFocused(zone);
                }}
                onPanZoom={onPanZoom} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
