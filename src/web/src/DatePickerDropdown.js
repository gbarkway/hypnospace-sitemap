import { useState, useEffect } from "react";
import { Dropdown, NavItem, NavLink } from "react-bootstrap";
import calIcon from "./win95-bootstrap/icons/time_and_date-1.png";

export default function DatePickerDropdown({ date, onDatePicked }) {
  const [dates, setDates] = useState([]);

  useEffect(() => {
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

  const onChange = (e) => {
    onDatePicked(e);
  };

  return (
    <Dropdown as={NavItem} className="d-flex flex-column justify-content-center mx-1">
      <Dropdown.Toggle as={NavLink} id="datepicker-toggle">
        <img src={calIcon} alt=""></img>
        {date}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {dates.map((d, i) => (
          <Dropdown.Item eventKey={`${i + 10}`} key={`date-select${i}`} onClick={() => onChange(d)}>
            {d}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
