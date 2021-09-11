import { useEffect, useState } from "react";
import { Dropdown, NavItem, NavLink } from "react-bootstrap";

import calIcon from "./win95-bootstrap/icons/time_and_date-1.png";

function useDates() {
  const [dates, setDates] = useState([]);
  useEffect(() => {
    if (!process.env.REACT_APP_CAPTURE_SERV_URL && process.env.NODE_ENV === "development") {
      console.error("Env variable REACT_APP_CAPTURE_SERV_URL is unset");
    }

    fetch(`${process.env.REACT_APP_CAPTURE_SERV_URL}/captures`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error(
            `Error fetching dates. Url: ${res.url}, status code: ${res.status}, status text: ${res.statusText}`
          );
        }
      })
      .then(setDates)
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }
      });
  }, []);

  return dates;
}

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
