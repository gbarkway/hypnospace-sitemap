import React from "react";
import ReactDOM from "react-dom";
import SearchResults from "../SearchResults";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Spinner />, div);
});
