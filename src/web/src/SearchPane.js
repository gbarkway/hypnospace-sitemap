import {Card, Form, Button} from "react-bootstrap";

export default function SearchPane() {
    return (
        <div id="search">
            <Card className="square">
                <Card.Header>
                    <b>Search</b>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Page name:</Form.Label>
                            <Form.Control type="text" placeholder="Page name"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>User:</Form.Label>
                            <Form.Control type="text" placeholder="User name" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tags:</Form.Label>
                            <Form.Control type="text" placeholder="tag1,tag2,tag3" />
                        </Form.Group>
                        <Button variant="primary">Search Now</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}