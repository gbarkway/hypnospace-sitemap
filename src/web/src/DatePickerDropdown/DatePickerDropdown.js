import { Dropdown, NavItem } from "react-bootstrap";

import calIcon from "../win95-bootstrap/icons/time_and_date-1.png";
import useDates from "./useDates";

export default function DatePickerDropdown({ date, onDatePicked }) {
  const dates = useDates();
  const onChange = (e) => {
    onDatePicked(e);
  };

  return (
    <Dropdown as={NavItem} className="d-flex flex-column justify-content-center mx-1">
      <Dropdown.Toggle id="datepicker-toggle">
        <img src={calIcon} alt=""></img>
        {date}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {dates.map((d, i) => (
          // eventKey required for react-bootstrap quirk, see nav links in App.js
          <Dropdown.Item
            eventKey={`date-select${i}`}
            key={`date-select${i}`}
            onClick={() => onChange(d)}
          >
            {d}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
