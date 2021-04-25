import { useEffect, useState } from "react";
import { Card, Button, ListGroup, Spinner } from "react-bootstrap";

const defaultPage = {
  tags: [],
  path: "",
  zone: "",
  date: "",
  name: "Welcome!",
  description: "",
  citizen: "",
};

function MutedNoneText() {
  return <span className="text-muted">None</span>;
}

//TODO: indicate if a page is linked to by hypnomail or by an ad
export default function PageDetails({ date, path, onTagClick, onCitizenNameClick }) {
  onTagClick = onTagClick || (() => {});
  onCitizenNameClick = onCitizenNameClick || (() => {});

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!path) return;

    setLoading(true);
    if (!process.env.REACT_APP_PAGE_SERV_URL && process.env.NODE_ENV === "development") {
      console.error("Env variable REACT_APP_PAGE_SERV_URL is unset");
    }
    fetch(
      `${process.env.REACT_APP_PAGE_SERV_URL}/captures/${date}/pages/${encodeURIComponent(path)}`
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 404) {
          return { ...defaultPage, ...{ date, path, name: "Page not Found" } };
        } else {
          throw new Error(
            `Error fetching page details. Url: ${res.url}, status code: ${res.status}, status text: ${res.statusText}`
          );
        }
      })
      .then(setPage)
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }

        setError("Error getting page details");
        setPage(null);
      })
      .finally(() => setLoading(false));
  }, [date, path]);

  if (page) {
    return (
      <div className="pageDetails h-100">
        <Card className="square h-100">
          <Card.Header>
            <h5>Page Details - {page.name}</h5>
          </Card.Header>
          <Card.Body style={{ overflowY: "scroll" }}>
            <div className="d-flex justify-content-between">
              <b>{page.name}</b>
              <Spinner
                size="sm"
                animation="border"
                role="status"
                style={loading ? { visibility: "visible" } : { visibility: "hidden" }}
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
            {/* If viewed on platform that doesn't display scrollbars, and card too short to display all info at once, 
              cut-off listbox provides visual indication that users should scroll to see more */}
            <ListGroup className="my-2">
              <ListGroup.Item className="p-2">{page.path}</ListGroup.Item>
              <ListGroup.Item className="p-2">
                <b>Zone:</b> {page.zone || <MutedNoneText />}
              </ListGroup.Item>
              <ListGroup.Item className="p-2">
                <b>Citizen:</b>
                <Button onClick={() => onCitizenNameClick(page.citizenName)} variant="link">
                  {page.citizenName || "???"}
                </Button>
              </ListGroup.Item>
              <ListGroup.Item className="p-2">
                <b>Description:</b> {page.description || <MutedNoneText />}
              </ListGroup.Item>
              <ListGroup.Item className="p-2">
                <b>Tags: </b>
                {page.tags.length ? (
                  page.tags.map((t, i) => (
                    <Button onClick={() => onTagClick(t)} variant="link" key={`tag-${i}`}>
                      &gt;{t}
                    </Button>
                  ))
                ) : (
                  <MutedNoneText />
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    );
  } else {
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
}
