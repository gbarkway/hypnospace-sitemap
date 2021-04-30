import { Button, Form } from "react-bootstrap";

const NULL_PLACEHOLDER = "???";
export default function SearchFields({
  onSearchClicked,
  searchFields,
  onSearchFieldsChange,
  disabled,
  onClearButtonClick,
}) {
  onSearchClicked = onSearchClicked || (() => {});
  onSearchFieldsChange = onSearchFieldsChange || (() => {});
  onClearButtonClick = onClearButtonClick || (() => {});

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
                pageNameQuery: e.target.value,
              })
            }
            type="text"
            id="nameOrDescriptionField"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="citizenNameField">Citizen Name:</Form.Label>
          <Form.Control
            value={searchFields.citizenNameQuery ?? NULL_PLACEHOLDER}
            onChange={(e) =>
              onSearchFieldsChange({
                citizenNameQuery: e.target.value === NULL_PLACEHOLDER ? null : e.target.value,
              })
            }
            type="text"
            id="citizenNameField"
          />
          <Button
            variant="link"
            className="btn-sm text-left"
            onClick={() =>
              onSearchFieldsChange({
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
                tagsQuery: e.target.value,
              })
            }
            type="text"
            id="tagsField"
          />
          <Form.Text className="small text-muted">Separate multiple tags with commas</Form.Text>
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit" className="mr-1">
            Search
          </Button>
          <Button onClick={onClearButtonClick}>Clear</Button>
        </div>
      </fieldset>
    </Form>
  );
}
