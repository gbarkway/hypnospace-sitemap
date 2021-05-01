import { Nav, Navbar } from "react-bootstrap";

import DatePickerDropdown from "./DatePickerDropdown";
import helpIcon from "./win95-bootstrap/icons/help_book_small-1.png";
import searchIcon from "./win95-bootstrap/icons/search_file-1.png";

export default function AppNavbar({
  date,
  onDatePicked,
  onSearchButtonClicked,
  onHelpButtonClicked,
}) {
  return (
    <Navbar className="navbar-95" expand="sm">
      <Navbar.Collapse>
        <Navbar.Brand>
          <h5>Hypnospace Map</h5>
        </Navbar.Brand>
      </Navbar.Collapse>
      {/* Below components not nested in a Nav b/c don't want the behaviour where items become vertical at Navbar's expand breakpoint*/}
      <DatePickerDropdown date={date} onDatePicked={onDatePicked} />
      <Nav.Link as="button" className="mx-1 btn" title="Search" onClick={onSearchButtonClicked}>
        <img src={searchIcon} alt="" height="16" width="16"></img>
      </Nav.Link>
      <Nav.Link className="mx-1 btn" as="button" title="Help" onClick={onHelpButtonClicked}>
        <img src={helpIcon} alt=""></img>
      </Nav.Link>
    </Navbar>
  );
}
