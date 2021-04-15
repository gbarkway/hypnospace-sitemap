import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Dropdown, DropdownButton, Nav, Navbar, Spinner } from "react-bootstrap";

import cytoscapeStyle from "./cytoscapeStyle";
import worldIcon from "./win95-bootstrap/icons/connected_world-1.png";
import infoIcon from "./win95-bootstrap/icons/msg_information-2.png";

cytoscape.use(fcose);

const fetchCapture = (date) => {
  return fetch(`${process.env.REACT_APP_CAPTURE_SERV_URL}/captures/${date}`).then((res) => {
    if (res.status !== 200) {
      throw new Error(
        `Error fetching sitemap. Url: ${res.url}, status code: ${res.status}, status text: ${res.statusText}`
      );
    }

    return res.json();
  });
};

const toZoneList = (capture) => {
  return capture.pages
    .filter((page) => page.path.includes("zone.hsp"))
    .map((page) => ({ zone: page.zone, path: page.path }));
};

const toCyElements = (capture) => {
  const zs = toZoneList(capture);
  const zoneNodes = zs.map((z) => ({
    data: { id: z.zone, label: z.zone, zone: z.zone },
    pannable: true,
  }));

  const pageNodes = capture.pages.map((page) => {
    return {
      data: {
        id: page.path,
        label: page.path.split("\\")[1],
        parent: page.zone,
        zone: page.zone,
      },
      pannable: true,
      classes: ["hidden", ...(page.path.includes("zone.hsp") ? ["zoneList"] : [])],
    };
  });

  const edges = capture.links.map((link) => ({
    data: { source: link.sourcePath, target: link.targetPath },
    classes: ["hidden"],
  }));

  return [...zoneNodes, ...pageNodes, ...edges];
};

//TODO: make zones visually distinct
//TODO: non-selected zones say "Tap me to see more" or something

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

  // cytoscape.js component integrated in a very non-React way
  // there is a react cytoscape package but I couldn't make it work
  const container = useRef();
  const cyRef = useRef();

  const [cyElements, setCyElements] = useState(null);
  const [footerText, setFooterText] = useState("");
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showZoomWarning, setShowZoomWarning] = useState(false);
  const [firstAnimationDone, setFirstAnimationDone] = useState(false);

  const selectNode = (node) => {
    if (!cyRef.current) return;
    if (!node.data("zone")) return;

    const zone = node.data("zone");
    const allNodes = cyRef.current.elements();
    const zoneNodes = cyRef.current.elements(`node[zone="${zone}"]`);
    const zoneNeighborhoodNodes = zoneNodes.closedNeighborhood();
    const zoneNeighborhoodParentNodes = zoneNeighborhoodNodes.parent();
    const myZone = node.parent();

    allNodes.not("node:parent").addClass("hidden");
    zoneNeighborhoodNodes.removeClass("hidden");
    zoneNeighborhoodParentNodes.removeClass("hidden");

    allNodes.removeClass("highlighted transparent selected");
    allNodes.difference(node.closedNeighborhood()).addClass("transparent");
    node.neighborhood().addClass("highlighted");
    node.addClass("selected");
    myZone.addClass("highlighted");
  };

  const focusNode = (node) => {
    if (!cyRef.current) return;

    cyRef.current.animate(
      {
        fit: {
          eles: node.closedNeighborhood().not("#hub").filter("node"),
        },
      },
      {
        duration: 1000,
        easing: "ease-out-quad",
        queue: false,
        complete: () => {
          setFirstAnimationDone(true);
        },
      }
    );
  };

  useEffect(() => {
    if (!cyRef.current) return;

    const node = cyRef.current.getElementById(selected);
    selectNode(node);
  }, [selected, cyElements]);

  useEffect(() => {
    if (!cyRef.current) return;
    if (!focused) return;

    const node = cyRef.current.getElementById(focused);
    if (!node.length) return;

    focusNode(node);
  }, [focused]);

  useEffect(() => {
    onSitemapReadyChanged(!loading);
  }, [loading, onSitemapReadyChanged]);

  useEffect(() => {
    setShowZoomWarning(false);
    setFirstAnimationDone(false);
    setLoading(true);
    setError("");
    fetchCapture(date)
      .then((capture) => {
        setCyElements(toCyElements(capture));
        setZones(toZoneList(capture));
      })
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }

        setError("Error loading sitemap");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [date]);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    if (!cyElements) return;

    cyRef.current = cytoscape({
      container: container.current,
      elements: cyElements,
      autounselectify: true,
      autoungrabify: true,
      layout: {
        name: "fcose",
        animate: false,
        idealEdgeLength: () => 200,
        nodeRepulsion: () => 50000, //prevent nodes from being too clustered
        randomize: true, // if randomize off, 20XX is arranged in a straight line
      },
      minZoom: 0.1,
      style: cytoscapeStyle,
    });

    cyRef.current.on("tap", "node", function (evt) {
      let node = evt.target;
      const isParent = node.isParent();
      if (isParent) {
        node = node.children(".zoneList");
      }

      onTap(node.id(), node.hasClass("selected"), node.data("zone"), isParent);
    });

    cyRef.current.on("tap", "edge", function (evt) {
      const node = evt.target.target();
      onTap(node.id(), node.hasClass("selected"), node.data("zone"));
    });

    cyRef.current.on("viewport", function () {
      setShowZoomWarning(cyRef.current.zoom() < 0.5);
      onPanZoom();
    });

    cyRef.current.on("mouseover", "node", function (e) {
      var node = e.target;
      setFooterText(node.id());
    });
  }, [cyElements, onTap, onPanZoom]); //TODO: changing onTap causes sitemap to reload, that's probably not necessary

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
              Fit
            </Button>
          </Nav.Item>
          <Nav.Item>
            <DropdownButton
              className="mx-1"
              variant="secondary"
              id="zone-dropdown-button"
              title="Go to"
              disabled={loading}
            >
              {zones.map((z, i) => (
                <Dropdown.Item
                  key={`zoneDropDown${i}`}
                  as="button"
                  onClick={() => onZoneMenuClick(z)}
                >
                  {z.zone}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Nav.Item>
          <Nav.Item style={loading ? { display: "block" } : { display: "none" }}>
            <div className="d-flex h-100 align-items-center">
              <Spinner size="sm" animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          </Nav.Item>
          <Nav.Item style={error.length ? { display: "block" } : { display: "none" }}>
            <span className="text-danger">{error}</span>
          </Nav.Item>
          <Nav.Item
            style={
              // check firstAnimationDone or element flickers before first animation
              showZoomWarning && firstAnimationDone ? { display: "block" } : { display: "none" }
            }
          >
            <img className="mx-1" src={infoIcon} alt=""></img>
            <i>Zoom to see text</i>
          </Nav.Item>
        </Nav>
      </Navbar>
      <Card.Body style={{ padding: 0 }} className="h-100">
        <div
          ref={container}
          style={{
            visibility: loading ? "hidden" : "visible",
            height: "100%",
          }}
        ></div>
      </Card.Body>
      <Card.Footer>
        <i>{footerText}</i>
      </Card.Footer>
    </Card>
  );
}
