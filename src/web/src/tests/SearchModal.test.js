import React from "react";
import ReactDOM from "react-dom";
import SearchModal from "../SearchModal";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SearchModal />, div);
});
