import { Button, Form } from "react-bootstrap";

const NULL_PLACEHOLDER = "<None>";
export default function SearchFields({
  onSearchClicked,
  searchFields,
  onSearchFieldsChange,
  disabled,
}) {
  onSearchClicked = onSearchClicked || (() => {});
  onSearchFieldsChange = onSearchFieldsChange || (() => {});
  searchFields = searchFields || {
    pageNameQuery: "",
    citizenNameQuery: "",
    tagsQuery: "",
  };

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
            value={searchFields?.pageNameQuery ?? ""}
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
          <Form.Label htmlFor="citizenNameField">Citizen Name:</Form.Label>
          <Form.Control
            value={searchFields.citizenNameQuery ?? NULL_PLACEHOLDER}
            onChange={(e) =>
              onSearchFieldsChange({
                ...searchFields,
                citizenNameQuery: e.target.value === NULL_PLACEHOLDER ? null : e.target.value,
              })
            }
            type="text"
            placeholder="Citizen"
            id="citizenNameField"
          />
          <Button 
            variant="link"
            className="btn-sm"
            onClick = {() => 
              onSearchFieldsChange({
                ...searchFields,
                citizenNameQuery: null,
              })
            }
          >
            Use {NULL_PLACEHOLDER} to search anonymous pages
          </Button>
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
