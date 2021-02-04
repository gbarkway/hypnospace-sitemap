import {Form, Button} from "react-bootstrap";

//TODO: input validation
export default function SearchFields({onSearchClicked, searchFields, onSearchFieldsChange}) 
{ 
    return (
        <Form>
            <Form.Group>
                <Form.Label>Page name or description:</Form.Label>
                <Form.Control value={searchFields.pageNameQuery} onChange={(e) => onSearchFieldsChange({...searchFields, pageNameQuery: e.target.value})} type="text" placeholder="Page name"/>
            </Form.Group>
            <Form.Group>
                <Form.Label>User name:</Form.Label>
                <Form.Control value={searchFields.userNameQuery} onChange = {(e) => onSearchFieldsChange({...searchFields, userNameQuery: e.target.value})} type="text" placeholder="User name" />
            </Form.Group>
            <Form.Group>
                <Form.Label>Tags:</Form.Label>
                <Form.Control value={searchFields.tagsQuery} onChange = {(e) => onSearchFieldsChange({...searchFields, tagsQuery: e.target.value})} type="text" placeholder="tag1,tag2,tag3" />
            </Form.Group>
            <Button variant="primary" onClick={() => onSearchClicked(searchFields)}>Search Now</Button>
        </Form>
    )
}