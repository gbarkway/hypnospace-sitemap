import { useEffect, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";

const defaultPage = {
  tags: [],
  path: "",
  zone: "",
  date: "",
  name: "Welcome!",
  description: "",
  citizen: "",
};

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
              <Card.Text>
                <b>{page.name}</b>
              </Card.Text>
              <Spinner
                size="sm"
                animation="border"
                role="status"
                style={{
                  display: loading ? "block" : "none",
                }}
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
            <Card.Subtitle className="text-muted">{page.path}</Card.Subtitle>
            <Card.Text>
              <b>Zone:</b> {page.zone || "<None>"}
            </Card.Text>
            <Card.Text>
              <b>Citizen:</b>
              <Button onClick={() => onCitizenNameClick(page.citizenName)} variant="link">
                {page.citizenName || "<None>"}
              </Button>
            </Card.Text>
            <Card.Text>
              <b>Description:</b> {page.description || "<None>"}
            </Card.Text>
            <Card.Text>
              {page.tags.map((t, i) => (
                <Button onClick={() => onTagClick(t)} variant="link" key={`tag-${i}`}>
                  &gt;{t}
                </Button>
              ))}
            </Card.Text>
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
