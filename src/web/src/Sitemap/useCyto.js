import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import { useEffect, useRef, useState } from "react";

import cytoscapeStyle from "./cytoscapeStyle";
cytoscape.use(fcose);

const useCyto = (cyElements, selected, focused, onTap, onPanZoom) => {
  // cytoscape.js component integrated in a very non-React way
  // there is a react cytoscape package but I couldn't make it work
  const containerRef = useRef();
  const cyRef = useRef();
  const [hovered, setHovered] = useState("");

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
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    if (!cyElements) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: cyElements,
      autounselectify: true,
      autoungrabify: true,
      layout: {
        name: "fcose",
        animate: false,
        idealEdgeLength: () => 200,
        nodeRepulsion: () => 20000,
        randomize: true, // if randomize off, 20XX is arranged in a straight line
      },
      minZoom: 0.08,
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
      onPanZoom();
    });

    cyRef.current.on("mouseover", "node", function (e) {
      const node = e.target;
      node.addClass("hover");
      setHovered(node.id());
    });

    cyRef.current.on("mouseout", "node", function (e) {
      const node = e.target;
      node.removeClass("hover");
    });
  }, [cyElements, onTap, onPanZoom]); //TODO: changing onTap causes sitemap to reload, that's probably not necessary

  return { containerRef, cyRef, hovered };
};

const selectNode = (node) => {
  const cy = node.cy();
  const zone = node.data("zone");
  const allNodes = cy.elements();
  const zoneNodes = cy.elements(`node[zone="${zone}"]`);
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
  node.cy().animate(
    {
      fit: {
        eles: node.closedNeighborhood().not("#hub").filter("node"),
      },
    },
    {
      duration: 1000,
      easing: "ease-out-quad",
      queue: false,
    }
  );
};
export default useCyto;
