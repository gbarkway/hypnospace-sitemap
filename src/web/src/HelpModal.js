import { Button, Modal } from "react-bootstrap";

import Spinner from "./Spinner";
import calIcon from "./win95-bootstrap/icons/time_and_date-1.png";
import helpIcon from "./win95-bootstrap/icons/help_book_big-0.png";
import searchIcon from "./win95-bootstrap/icons/search_file-2.png";

export default function HelpModal({ show, loading, onCloseButtonClick }) {
  onCloseButtonClick = onCloseButtonClick || (() => {});

  return (
    <Modal show={show} onHide={onCloseButtonClick} animation={false}>
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
          . <span className="text-danger">Spoilers</span> of course!
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
            <b>Change date:</b> click <img src={calIcon} alt="calendar"></img>
          </li>
          <li>
            <b>Search:</b> click <img src={searchIcon} alt="help"></img>
          </li>
        </ul>
        <p>Zones are big rectangles. Click on one to get started!</p>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <div>
          <a className="mx-2 small" target="_blank" rel="noreferrer" href="/licenses.html">
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
        <div>
          <Spinner visible={loading} />
          <Button disabled={loading} onClick={onCloseButtonClick}>
            OK
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
