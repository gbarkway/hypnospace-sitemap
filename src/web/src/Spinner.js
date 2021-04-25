import { Spinner as BootstrapSpinner } from "react-bootstrap";

export default function Spinner ({visible}) {
    return (
        <BootstrapSpinner
        size="sm"
        animation="border"
        role="status"
        style={{
          visibility: visible ? "visible" : "hidden",
        }}
      >
        <span className="sr-only">Loading...</span>
      </BootstrapSpinner>
    );
}
