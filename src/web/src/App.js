import './App.css';
import { useState, useCallback } from "react";
import PageDetails from "./PageDetails";
import DatePicker from "./DatePicker";
import Sitemap from "./Sitemap";
import TutorialModal from "./TutorialModal";
import 'bootstrap/dist/css/bootstrap.min.css';
//import './win95-bootstrap/win95.css';
import { Container, Row, Col, Button, Navbar } from "react-bootstrap";
import SearchPane from "./SearchPane";

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
  const [showModal, setShowModal] = useState(true);

  const updateFieldsAndSearch = (fieldstoUpdate) => {
    const newFields = { ...defaultSearchFields, ...fieldstoUpdate };
    setSearchFields(newFields);
    setSearchRequest(newFields);
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
  return (
    <div className="App">
      <TutorialModal show={showModal} onCloseButtonClick={() => setShowModal(false)}></TutorialModal>
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
              <Button className="mx-1" variant="light" onClick={() => setShowModal(true)}><img src="help_book_small-1.png"></img></Button>
              <Button className="mx-1" variant="light" target="_blank" href="https://github.com/gbarkway/hypnospace-sitemap"><img src="GitHub-Mark-32px.png" width="16px" height="16px"></img></Button>
            </Navbar>
          </Col>
        </Row>
        <Row>
          <Col lg={3} xs={12}>
            <div className="my-1">
              <PageDetails
                date={date}
                path={path}
                onTagClick={(t) => updateFieldsAndSearch({ tagsQuery: t })}
                onUserNameClick={(userName) => updateFieldsAndSearch({ userNameQuery: userName })} />
            </div>
          </Col>

          <Col xs={12} lg={6}>
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
          <Col xs={12} lg={3}>
            <div className="my-1">
              <SearchPane
                date={date}
                onResultClick={(path) => {
                  setPath(path);
                  setFocused(path);
                }}
                searchFields={searchFields}
                onSearchFieldsChange={setSearchFields}
                searchRequest={searchRequest}
                onSearchClick={setSearchRequest} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
