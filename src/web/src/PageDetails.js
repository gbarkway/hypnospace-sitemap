import { useEffect, useState } from "react";
import { Card, Button, ListGroup } from "react-bootstrap";

import Spinner from "./Spinner";
import mailIcon from "./win95-bootstrap/icons/message_envelope_open-1.png"
import adIcon from "./win95-bootstrap/icons/no2-1.png"

const defaultPage = {
  tags: [],
  path: "",
  zone: "",
  date: "",
  name: "Welcome!",
  description: "",
  citizen: "",
  linkedByAd: false,
  linkedByMail: false,
};

function MutedNoneText() {
  return <span className="text-muted">None</span>;
}

function Tags({tags, onTagClick}) {
  return (
    <>
    <b>Tags: </b>
    {tags.length ? (
      tags.map((t, i) => (
        <Button onClick={() => onTagClick(t)} variant="link" key={`tag-${i}`}>
          &gt;{t}
        </Button>
      ))
    ) : (
      <MutedNoneText />
    )}
    </>
  )
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
              <Spinner visible={loading} />
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
                <Tags tags={page.tags} onTagClick={onTagClick}/>
              </ListGroup.Item>
              { page.linkedByAd || page.linkedByMail ? (
                              <ListGroup.Item className="p-2">
                              { page.linkedByAd ? <div><img src={adIcon} width="16" height="16" className="mx-1" />Linked by ad or popup</div> : null }
                              { page.linkedByMail ? <div><img src={mailIcon} className="mx-1"></img>Linked by HypnoMail</div> : null }
                          </ListGroup.Item>
              ) : null}
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
