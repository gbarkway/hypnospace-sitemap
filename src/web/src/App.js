import './App.css';
import {useState} from "react";
import PageDetails from "./PageDetails";
import DatePicker from "./DatePicker";
import Sitemap from "./Sitemap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './win95-bootstrap/win95.css';
import {Container, Row, Col} from "react-bootstrap";
import SearchPane from "./SearchPane";

function App() {
  const [date, setDate] = useState("1999-11-05"); // TODO: use context instead of storing all state in root app
  const [path, setPath] = useState("99_flist\\~f00021d_01.hsp");
  const [searchFields, setSearchFields] = useState({
    pageNameQuery: "",
    userNameQuery: "",
    tagsQuery: "",
  });
  const [searchRequest, setSearchRequest] = useState(null);

  //TODO: move page details pane to underneath so that search pane has more space?
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col>
            <DatePicker value={date} onDatePicked={setDate} />
          </Col>
        </Row>
        <Row><Col><br></br></Col></Row>
        <Row>
          <Col xs={2}>
            <SearchPane date={date} onResultClick={setPath} searchFields={searchFields} onSearchFieldsChange={setSearchFields} searchRequest={searchRequest} onSearchClick={setSearchRequest}/>
            </Col>
          <Col xs={8}>
            <Sitemap date={date} onTap={setPath} selected={path} />
          </Col>
          <Col xs={2}>
            <PageDetails date={date} path={path} onTagClick={(t) => {
              const newFields = { ...searchFields, tagsQuery: t };
              setSearchFields(newFields);
              setSearchRequest(newFields);
            }
            } />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
