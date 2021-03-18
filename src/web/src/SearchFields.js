import { Form, Button } from "react-bootstrap";

export default function SearchFields({
  onSearchClicked,
  searchFields,
  onSearchFieldsChange,
  disabled,
}) {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSearchClicked(searchFields);
      }}
    >
      <fieldset disabled={disabled}>
        <Form.Group>
          <Form.Label htmlFor="nameOrDescriptionField">Page name or description:</Form.Label>
          <Form.Control
            value={searchFields.pageNameQuery}
            onChange={(e) =>
              onSearchFieldsChange({
                ...searchFields,
                pageNameQuery: e.target.value,
              })
            }
            type="text"
            placeholder="Keyword"
            id="nameOrDescriptionField"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="userNameField">Username:</Form.Label>
          <Form.Control
            value={searchFields.userNameQuery}
            onChange={(e) =>
              onSearchFieldsChange({
                ...searchFields,
                userNameQuery: e.target.value,
              })
            }
            type="text"
            placeholder="Username"
            id="userNameField"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="tagsField">Tags:</Form.Label>
          <Form.Control
            value={searchFields.tagsQuery}
            onChange={(e) =>
              onSearchFieldsChange({
                ...searchFields,
                tagsQuery: e.target.value,
              })
            }
            type="text"
            placeholder="tag1,tag2,tag3"
            id="tagsField"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
      </fieldset>
    </Form>
  );
}
