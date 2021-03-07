import { Modal, Button } from "react-bootstrap";
import searchIcon from "./win95-bootstrap/icons/search_file-2.png";
import calIcon from "./win95-bootstrap/icons/time_and_date-1.png"
import helpIcon from "./win95-bootstrap/icons/help_book_small-1.png"

export default function TutorialModal({ show, onCloseButtonClick }) {
    onCloseButtonClick = onCloseButtonClick || (() => { })

    return (
        <Modal show={show} onHide={onCloseButtonClick} animation={false} centered>
            <Modal.Header>
                <Modal.Title>Welcome!</Modal.Title>
                <Button variant="secondary" className="win95-close" onClick={onCloseButtonClick}>
                    <span>×</span>
                </Button>
            </Modal.Header>
            <Modal.Body>
                <h5>Introduction</h5>
                <p>This is an interactive map of Hypnospace, the alternate-reality Internet from the wonderful 2019 game <a target="_blank" rel="noreferrer" href="http://www.hypnospace.net/">Hypnospace Outlaw</a></p>
                <h5>Controls</h5>
                <ul>
                    <li><b>Click and drag</b> to pan. <b>Scroll</b> (mouse) or pinch and zoom (touchscreen) to zoom.</li>
                    <li>Big rectangles are zones, and circles are pages. Tap one to see more information about it</li>
                </ul>
                <h5>Other features</h5>
                <ul>
                    <li>Use the <img src={calIcon} alt="calendar"></img> dropdown to switch to a different date, and use the <img src={searchIcon} alt="search"></img> button to search.</li>
                    <li>Click on a tag or user to see other pages with the same tag or username</li>
                    <li>Click on a page name in search results to jump to it</li>
                    <li>Click the <img src={helpIcon} alt="help"></img> button to see this dialog again</li>
                </ul>
                <h5>About</h5>
                <p>See <a target="_blank" rel="noreferrer" href="/licenses">here</a> for open source licenses and <a target="_blank" rel="noreferrer" href="https://github.com/gbarkway/hypnospace-sitemap">here</a> for this project's GitHub</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onCloseButtonClick}>OK</Button>
            </Modal.Footer>
        </Modal>
    );
}