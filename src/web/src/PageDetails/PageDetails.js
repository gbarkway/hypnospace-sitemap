import { Card, Button, ListGroup } from "react-bootstrap";

import MutedNoneText from "./MutedNoneText";
import PageDetailsPlaceholder from "./PageDetailsPlaceholder";
import SpecialLinksListGroupItem from "./SpecialLinksListGroupItem";
import Spinner from "../Spinner";
import Tags from "./Tags";
import usePageDetails from "./usePageDetails";

export default function PageDetails({
  date,
  path,
  onTagClick = (f) => f,
  onCitizenNameClick = (f) => f,
}) {
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
