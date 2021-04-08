import React from "react";
import ReactDOM from "react-dom";
import DatePickerDropdown from "../DatePickerDropdown";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<DatePickerDropdown />, div);
});
