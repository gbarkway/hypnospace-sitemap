import { useEffect } from "react";
import { Button, Card, Nav, Navbar } from "react-bootstrap";

import Spinner from "../Spinner";
import worldIcon from "../win95-bootstrap/icons/connected_world-1.png";
import useCyto from "./useCyto";
import useSitemapData from "./useSitemapData";
import ZoneDropdown from "./ZoneDropdown";

// Callbacks
// onTap: (path: string, alreadySelected: bool, zoneName: string, isParent: bool)
// onZoneMenuClick: (zone: {zone: string, path: string})
// onPanZoom: ()
// onSitemapReadyChanged: (ready: bool)
export default function Sitemap({
  date,
  onTap,
  selected,
  focused,
  onZoneMenuClick,
  onPanZoom,
  onSitemapReadyChanged,
}) {
  onZoneMenuClick = onZoneMenuClick || (() => {});
  onTap = onTap || (() => {});
  onPanZoom = onPanZoom || (() => {});
  onSitemapReadyChanged = onSitemapReadyChanged || (() => {});

  const { cyElements, zones, loading, error } = useSitemapData(date);
  const { containerRef, cyRef, hovered } = useCyto(cyElements, selected, focused, onTap, onPanZoom);

  useEffect(() => {
    onSitemapReadyChanged(!loading);
  }, [loading, onSitemapReadyChanged]);

  return (
    <Card className="square h-100">
      <Card.Header>
        <h5>
          <img src={worldIcon} alt=""></img> Site Graph - {date}
        </h5>
      </Card.Header>
      <Navbar className="navbar-95">
        <Nav>
          <Nav.Item>
            <Button
              className="mx-1"
              variant="secondary"
              onClick={() => cyRef.current.fit()}
              disabled={loading}
            >
              Zoom to Fit
            </Button>
          </Nav.Item>
          <Nav.Item>
            <ZoneDropdown zones={zones} onClick={onZoneMenuClick} disabled={loading} />
          </Nav.Item>
          <Nav.Item>
            <div className="d-flex h-100 align-items-center">
              <Spinner visible={loading} />
            </div>
          </Nav.Item>
          <Nav.Item style={error.length ? { display: "block" } : { display: "none" }}>
            <span className="text-danger">{error}</span>
          </Nav.Item>
        </Nav>
      </Navbar>
      <Card.Body style={{ padding: 0 }} className="h-100">
        <div
          ref={containerRef}
          style={{
            visibility: loading ? "hidden" : "visible",
            height: "100%",
          }}
        ></div>
      </Card.Body>
      <Card.Footer>
        <i>{hovered}</i>
      </Card.Footer>
    </Card>
  );
}
