import './App.css';
import {useState, useCallback} from "react";
import PageDetails from "./PageDetails";
import DatePicker from "./DatePicker";
import Sitemap from "./Sitemap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './win95-bootstrap/win95.css';
import {Container, Row, Col} from "react-bootstrap";
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
  const [searchFields, setSearchFields] = useState({...defaultSearchFields});
  const [searchRequest, setSearchRequest] = useState(null);
  
  const updateFieldsAndSearch = (fieldstoUpdate) => {
    const newFields = { ...defaultSearchFields, ...fieldstoUpdate };
    setSearchFields(newFields);
    setSearchRequest(newFields);
  }

  const onNodeTap = useCallback((path, alreadySelected, zone, isParent) => {
    setPath(path);
    if (isParent) {
      setFocused(zone);
    }else if (alreadySelected) {
      setFocused(path);
    }
  }, []);

  const onPanZoom = useCallback(() => {
    setFocused(null);
  }, [])

  //TODO: move page details pane to underneath so that search pane has more space?
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col>
            <DatePicker value={date} onDatePicked={(date) => {
              setPath(null);
              setDate(date);
            }} />
          </Col>
        </Row>
        <Row><Col><br></br></Col></Row>
        <Row>
          <Col xs={3}>
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
            </Col>
          <Col xs={7}>
            <Sitemap 
              date={date} 
              onTap={onNodeTap} 
              selected={path} 
              focused={focused}
              onZoneMenuClick={({zone, path}) => {
                setPath(path);
                setFocused(zone);
              }}
              onPanZoom={onPanZoom} />
          </Col>
          <Col xs={2}>
            <PageDetails 
              date={date} 
              path={path} 
              onTagClick={(t) => updateFieldsAndSearch({tagsQuery: t})} 
              onUserNameClick={(userName) => updateFieldsAndSearch({userNameQuery: userName})} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
