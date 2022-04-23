import { Dropdown, DropdownButton } from "react-bootstrap";

// zones: [
//  {
//    zone: "string" // e.g. "Hypnospace Central"
//    path: "string" // path to node e.g. "01_hypnospace central\\zone.hsp"
//  }
// ]
export default function ZoneDropdown({ zones, onClick, disabled = false }) {
  zones = zones || [];
  onClick = onClick || (() => {});

  return (
    <DropdownButton
      className="mx-1"
      variant="secondary"
      id="zone-dropdown-button"
      title="Go to zone"
      disabled={disabled}
    >
      {zones.map((z, i) => (
        <Dropdown.Item key={`zoneDropDown${i}`} as="button" onClick={() => onClick(z)}>
          {z.zone}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
