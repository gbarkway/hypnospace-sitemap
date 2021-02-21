import './App.css';
import { useState, useCallback } from "react";
import PageDetails from "./PageDetails";
import DatePicker from "./DatePicker";
import Sitemap from "./Sitemap";
import TutorialModal from "./TutorialModal";
import 'bootstrap/dist/css/bootstrap.min.css';
import './win95-bootstrap/win95.css';
import { Container, Row, Col, Button, Navbar } from "react-bootstrap";
import SearchModal from "./SearchModal";
import githubLogo from "./GitHub-Mark-32px.png";
import helpIcon from "./win95-bootstrap/icons/help_book_small-1.png"
import searchIcon from "./win95-bootstrap/icons/search_file-1.png"

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
      <Container fluid>
        <Row>
          <Col>
            <Navbar className="navbar-95">
              <Navbar.Brand><i>Hypnospace Sitemap</i></Navbar.Brand>
              <DatePicker
                value={date}
                onDatePicked={(date) => {
                  setPath(null);
                  setDate(date);
                }} />
                <Button className="mx-1" variant="light" title="Search" onClick = {() => setShowSearchModal(true)}><img src={searchIcon} alt="" height="16" width="16"></img></Button>
              <Button className="mx-1" variant="light" title="Help" onClick={() => setShowHelpModal(true)}><img src={helpIcon} alt=""></img></Button>
              <Button className="mx-1" variant="light" target="_blank" title="GitHub" href="https://github.com/gbarkway/hypnospace-sitemap"><img src={githubLogo} width="16px" height="16px" alt=""></img></Button>
            </Navbar>
          </Col>
        </Row>
        <Row>
          <Col lg={4} xs={12}>
            <div className="my-1">
              <PageDetails
                date={date}
                path={path}
                onTagClick={(t) => updateFieldsAndSearch({ tagsQuery: t })}
                onUserNameClick={(userName) => updateFieldsAndSearch({ userNameQuery: userName })} />
            </div>
          </Col>
          <Col lg={8} xs={12}>
            <div className="my-1">
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
