import { useEffect, useState } from "react";
import { Card, Button, ListGroup } from "react-bootstrap";

import MutedNoneText from "./MutedNoneText";
import PageDetailsPlaceholder from "./PageDetailsPlaceholder";
import SpecialLinksListGroupItem from "./SpecialLinksListGroupItem";
import Spinner from "./Spinner";
import Tags from "./Tags";

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

function usePageDetails(date, path) {
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

  return { page, loading, error };
}

export default function PageDetails({ date, path, onTagClick, onCitizenNameClick }) {
  onTagClick = onTagClick || (() => {});
  onCitizenNameClick = onCitizenNameClick || (() => {});

  const { page, loading, error } = usePageDetails(date, path);

  if (!page) {
    return <PageDetailsPlaceholder error={error} />;
  }

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
              <Tags tags={page.tags} onTagClick={onTagClick} />
            </ListGroup.Item>
            <SpecialLinksListGroupItem
              linkedByAd={page.linkedByAd}
              linkedByMail={page.linkedByMail}
            />
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
