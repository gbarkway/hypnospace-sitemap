const cytoscapeStyle = [
  {
    selector: "node",
    style: {
      "border-color": "black",
      "border-width": 1,
    },
  },
  {
    selector: 'node[parent="Hypnospace Central"]',
    style: {
      "background-color": "orange",
    },
  },
  {
    selector: 'node[parent="The Cafe"]',
    style: {
      "background-color": "red",
    },
  },
  {
    selector: 'node[parent="Goodtime Valley"]',
    style: {
      "background-color": "green",
    },
  },
  {
    selector: 'node[parent="Teentopia"]',
    style: {
      "background-color": "blue",
    },
  },
  {
    selector: 'node[parent="Coolpunk Paradise"],node[parent="The Venue"]',
    style: {
      "background-color": "cyan",
    },
  },
  {
    selector: 'node[parent="Starport Castle Dreamstation"]',
    style: {
      "background-color": "rgb(255,0,255)",
    },
  },
  {
    selector: 'node[parent="Open Eyed"]',
    style: {
      "background-color": "purple",
    },
  },
  {
    selector: 'node[parent="HSPD Enforcer Handbook"]',
    style: {
      "background-color": "gray",
    },
  },
  {
    selector: 'node[parent="FLIST DIRECTORY MASTER"]',
    style: {
      "background-color": "black",
    },
  },
  {
    selector: "node:child",
    style: {
      "text-outline-color": "white",
      "text-outline-width": 1.3,
      "text-valign": "center",
      "font-weight": "bold",
      "font-size": 16,
      // there are text rendering issues if this is too small
      "min-zoomed-font-size": "10",
    },
  },
  {
    selector: "node:child.highlighted",
    style: {
      "z-index": "20",
      "border-color": "black",
      content: "data(label)",
    },
  },
  {
    selector: "node:child.selected",
    style: {
      width: "50",
      height: "50",
      "z-index": "21",
      "border-color": "white",
      "border-width": 5,
      content: "data(label)",
    },
  },
  {
    selector: "node:parent",
    style: {
      "background-color": "lightgray",
      "background-opacity": 0.5,
      "border-color": "black",
      content: "data(label)",
      "font-size": 72,
      "font-weight": "bold",
    },
  },
  {
    selector: "node:parent.highlighted",
    style: {
      "border-color": "white",
      "border-width": 10,
    },
  },
  {
    selector: "edge",
    style: {
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },
  {
    selector: "edge.highlighted",
    style: {
      width: "5",
      "line-color": "black",
      "target-arrow-color": "black",
      "z-index": "10",
    },
  },
  {
    selector: "edge.transparent",
    style: {
      "line-opacity": 0.2,
      "target-arrow-shape": "none",
    },
  },
  {
    selector: "node:child.transparent",
    style: {
      "background-opacity": 0.4,
      "border-width": 0,
    },
  },
  {
    selector: ".hidden",
    style: {
      visibility: "hidden",
    },
  },
  {
    selector: "node.zoneListing",
    style: {
      shape: "star",
      "border-color": "black",
      "border-width": 5,
    },
  },
  {
    selector: "node.zoneListing.selected",
    style: {
      "border-color": "white",
    },
  },
];

export default cytoscapeStyle;
