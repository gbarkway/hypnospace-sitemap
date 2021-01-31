import {Form, Button} from "react-bootstrap";
import {useState} from "react";

export default function SearchFields({onSearchClicked}) 
{
    const [pageNameQuery, setPageNameQuery] = useState("");
    const [userNameQuery, setUserNameQuery] = useState("");
    const [tagsQuery, setTagsQuery] = useState("");

    return (
        <Form>
            <Form.Group>
                <Form.Label>Page name:</Form.Label>
                <Form.Control value={pageNameQuery} onChange={(e) => setPageNameQuery(e.target.value)} type="text" placeholder="Page name"/>
            </Form.Group>
            <Form.Group>
                <Form.Label>User name:</Form.Label>
                <Form.Control value={userNameQuery} onChange = {(e) => setUserNameQuery(e.target.value)} type="text" placeholder="User name" />
            </Form.Group>
            <Form.Group>
                <Form.Label>Tags:</Form.Label>
                <Form.Control value={tagsQuery} onChange = {(e) => setTagsQuery(e.target.value)} type="text" placeholder="tag1,tag2,tag3" />
            </Form.Group>
            <Button variant="primary" onClick={() => onSearchClicked({pageNameQuery, userNameQuery, tagsQuery})}>Search Now</Button>
        </Form>
    )
}