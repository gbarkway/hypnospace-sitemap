import React from "react";
import ReactDOM from "react-dom";
import SearchPane from "../SearchPane";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SearchPane />, div);
});
