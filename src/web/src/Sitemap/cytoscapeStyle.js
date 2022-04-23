const cytoscapeStyle = [
  {
    selector: "node",
    style: {
      "border-color": "black",
      "border-width": 1,
    },
  },
  {
    selector: 'node[parent="The Cafe"]',
    style: {
      "background-gradient-stop-colors": "rgb(207,172,76) rgb(122,56,61)",
    },
  },
  {
    selector: 'node[parent="Goodtime Valley"]',
    style: {
      "background-gradient-stop-colors": "rgb(182,164,152) rgb(165,38,42)",
    },
  },
  {
    selector: 'node[parent="Teentopia"]',
    style: {
      "background-gradient-stop-colors": "rgb(252,233,23) rgb(214,17,60) rgb(33,59,191)",
    },
  },
  {
    selector: 'node[parent="Coolpunk Paradise"],node[parent="The Venue"]',
    style: {
      "background-gradient-stop-colors": "rgb(212,87,166) rgb(97,66,184)",
    },
  },
  {
    selector: 'node[parent="Starport Castle Dreamstation"]',
    style: {
      "background-gradient-stop-colors": "rgb(45,196,58) rgb(107,118,124)",
    },
  },
  {
    selector: 'node[parent="Open Eyed"],node[parent="The Stadium"]',
    style: {
      "background-gradient-stop-colors": "rgb(199,171,45) rgb(77,146,171) rgb(146,4,212)",
    },
  },
  {
    selector:
      'node[parent="FLIST DIRECTORY MASTER"],node[parent="Hypnospace Central"],node[parent="HSPD Enforcer Handbook"],node[parent="Hypnospace Page"],node[parent="The Y2000 Mindcrash"]',
    style: {
      "background-gradient-stop-colors": "rgb(176,164,149) rgb(107,96,94)",
    },
  },
  {
    selector: "node:child",
    style: {
      width: 70,
      height: 70,
      "text-outline-color": "white",
      "text-outline-width": 3,
      "text-valign": "center",
      "font-weight": "bold",
      "font-size": 24,
      // there are text rendering issues if this is too small
      "min-zoomed-font-size": 10,
      "background-gradient-stop-positions": "0% 33% 66%",
      "background-fill": "linear-gradient",
      "background-gradient-direction": "to-bottom-right",
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
      width: "80",
      height: "80",
      "z-index": "21",
      "border-color": "white",
      "border-width": 8,
      content: "data(label)",
    },
  },
  {
    selector: "node:child.hover.highlighted",
    style: {
      "z-index": "22",
      "text-background-color": "white",
      "text-background-shape": "round-rectangle",
      "text-background-opacity": 0.9,
      "text-background-padding": "5px",
    },
  },
  {
    selector: "node:parent",
    style: {
      "background-color": "lightgray",
      "background-opacity": 0.5,
      "border-color": "black",
      content: "data(label)",
      "font-size": 128,
      "font-weight": "bold",
    },
  },
  {
    selector: "node:parent.highlighted",
    style: {
      "border-color": "white",
      "border-width": 10,
      "z-index": 30,
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
