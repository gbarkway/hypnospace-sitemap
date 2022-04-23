import React from "react";
import ReactDOM from "react-dom";
import SearchPane from "../SearchModal/SearchPane";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <SearchPane searchFields={{ pageNameQuery: "", citizenNameQuery: "", tagsQuery: "" }} />,
    div
  );
});
