import { Button, Form } from "react-bootstrap";

const NULL_PLACEHOLDER = "<None>";
const defaultSearchFields = {
  pageNameQuery: "",
  citizenNameQuery: "",
  tagsQuery: "",
};

export default function SearchFields({
  onSearchClicked,
  searchFields,
  onSearchFieldsChange,
  disabled,
}) {
  onSearchClicked = onSearchClicked || (() => {});
  onSearchFieldsChange = onSearchFieldsChange || (() => {});
  searchFields = searchFields || { ...defaultSearchFields };

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
            id="citizenNameField"
          />
          <Button
            variant="link"
            className="btn-sm"
            onClick={() =>
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
            id="tagsField"
          />
          <Form.Text className="small text-muted">Separate multiple tags with commas</Form.Text>
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit" className="mr-1">
            Search
          </Button>
          <Button onClick={() => onSearchFieldsChange({ ...defaultSearchFields })}>Clear</Button>
        </div>
      </fieldset>
    </Form>
  );
}
