import './App.css';
import {useState} from "react";
import PageDetails from "./PageDetails";
import DatePicker from "./DatePicker";
import Sitemap from "./Sitemap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from "react-bootstrap";

function App() {
  const [date, setDate] = useState("1999-11-05"); // TODO: use context
  const [path, setPath] = useState("99_flist\\~f00021d_01.hsp");
  return (
    <div className="App">
      <Container fluid>
          <Row>
            <Col>
              <DatePicker value={date} onDatePicked={setDate}/>
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              Search tools go here
            </Col>
            <Col xs={8}>
              <Sitemap date={date} onTap={setPath}/>
            </Col>
            <Col xs={2}>
              <PageDetails date={date} path={path}/>
            </Col>
          </Row>
      </Container>
    </div>
  );
}

export default App;