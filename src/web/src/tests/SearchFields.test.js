import React from "react";
import ReactDOM from "react-dom";
import SearchFields from "../SearchFields";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SearchFields />, div);
});
