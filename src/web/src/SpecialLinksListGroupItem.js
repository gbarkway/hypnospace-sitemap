import { ListGroup } from "react-bootstrap";

import mailIcon from "./win95-bootstrap/icons/message_envelope_open-0.png";
import adIcon from "./win95-bootstrap/icons/accessibility_two_windows.png";

export default function SpecialLinksListGroupItem({ linkedByAd, linkedByMail }) {
  if (!linkedByAd && !linkedByMail) {
    return null;
  }

  return (
    <ListGroup.Item className="p-2">
      {linkedByAd ? (
        <div>
          <img src={adIcon} className="mx-1" alt="" />
          Linked by ad or popup
        </div>
      ) : null}
      {linkedByMail ? (
        <div>
          <img src={mailIcon} className="mx-1" alt=""></img>Linked by HypnoMail
        </div>
      ) : null}
    </ListGroup.Item>
  );
}
