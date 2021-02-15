import { Modal, Button } from "react-bootstrap";
import { useState } from "react";

export default function TutorialModal({show, onCloseButtonClick}) {
    onCloseButtonClick = onCloseButtonClick || (() => {})
    
    return (
        <Modal show={show} onHide={onCloseButtonClick} animation={false} centered>
            <Modal.Header>
                <Modal.Title>Welcome!</Modal.Title>
                <Button onClick={onCloseButtonClick}>
                    <span>×</span>
                </Button>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Click on a zone (rectangle) or a page (circle) to see more information about it.
                    All the connected pages are highlighted!
                </p>
                <p>
                    Click and drag to pan. Scroll wheel to zoom.
                </p>
                <p>
                    Use the top dropdown to switch to a different date
                </p>
                <p>
                    Try searching! Click on a search result to zoom in on it.
                </p>
                <p>
                    Click the help button in the top right to see this dialog again
                </p>
                <p>
                        <a className="text-muted" target="_blank" href="https://github.com/gbarkway/hypnospace-sitemap">GitHub</a>    
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onCloseButtonClick}>OK</Button>
            </Modal.Footer>
        </Modal>
    );
}