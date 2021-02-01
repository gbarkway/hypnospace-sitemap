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
  const [date, setDate] = useState("1999-11-05"); // TODO: use context
  const [path, setPath] = useState("99_flist\\~f00021d_01.hsp");
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
            <SearchPane date={date} onResultClick={setPath}/>
            </Col>
          <Col xs={8}>
            <Sitemap date={date} onTap={setPath} selected={path} />
          </Col>
          <Col xs={2}>
            <PageDetails date={date} path={path} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
