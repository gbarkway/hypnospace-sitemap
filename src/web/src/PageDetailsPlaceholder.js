import { Card } from "react-bootstrap";

export default function PageDetailsPlaceholder({ error }) {
  return (
    <div className="pageDetails h-100">
      <Card className="square h-100">
        <Card.Header>
          <h5>Page Details</h5>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            {error.length ? error : "No page selected. Click a zone to get started."}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
