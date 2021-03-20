import { Modal, Button } from "react-bootstrap";
import searchIcon from "./win95-bootstrap/icons/search_file-2.png";
import calIcon from "./win95-bootstrap/icons/time_and_date-1.png";
import helpIcon from "./win95-bootstrap/icons/help_book_big-0.png";

export default function HelpModal({ show, onCloseButtonClick }) {
  onCloseButtonClick = onCloseButtonClick || (() => {});

  return (
    <Modal show={show} onHide={onCloseButtonClick} animation={false} centered>
      <Modal.Header>
        <Modal.Title>
          <img className="m-1" src={helpIcon} alt="" width="24" height="24"></img>
          Welcome!
        </Modal.Title>
        <Button variant="secondary" className="win95-close" onClick={onCloseButtonClick}>
          <span aria-hidden="true">×</span>
          <span className="sr-only">Close</span>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <h5>Introduction</h5>
        <p>
          This is an interactive map of Hypnospace, the alternate-reality Internet from the
          wonderful 2019 game{" "}
          <a target="_blank" rel="noreferrer" href="http://www.hypnospace.net/">
            Hypnospace Outlaw
          </a>
          . Spoilers, of course!
        </p>
        <h5>Controls</h5>
        <ul>
          <li>
            <b>Pan:</b> click and drag
          </li>
          <li>
            <b>Zoom:</b> scroll (mouse) or pinch and zoom (touchscreen)
          </li>
          <li>
            <img src={calIcon} alt="calendar"></img>
            <b>:</b> change date
          </li>
          <li>
            <img src={searchIcon} alt="help"></img>
            <b>:</b> search!
          </li>
        </ul>
        <p>Zones are big rectangles. Click on one to get started!</p>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <div>
          <a className="mx-2 small" target="_blank" rel="noreferrer" href="/licenses">
            Licenses
          </a>
          <a
            className="mx-2 small"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/gbarkway/hypnospace-sitemap"
          >
            GitHub
          </a>
        </div>
        <Button onClick={onCloseButtonClick}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}