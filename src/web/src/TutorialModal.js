import { Modal, Button } from "react-bootstrap";

export default function TutorialModal({ show, onCloseButtonClick }) {
    onCloseButtonClick = onCloseButtonClick || (() => { })

    return (
        <Modal show={show} onHide={onCloseButtonClick} animation={false} centered>
            <Modal.Header>
                <Modal.Title>Welcome!</Modal.Title>
                <Button variant="secondary" onClick={onCloseButtonClick}>
                    <span>×</span>
                </Button>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Click on a zone (big rectangle) or a page (circle) to see more information about it.
                </p>
                <p>
                    Click and drag to pan
                </p>
                <p>
                    Scroll to zoom
                </p>
                <p>
                    Use the top dropdown to switch to a different date
                </p>
                <p>
                    Note: works best on a bigger screen
                </p>
                <p>
                    Have fun!
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onCloseButtonClick}>OK</Button>
            </Modal.Footer>
        </Modal>
    );
}