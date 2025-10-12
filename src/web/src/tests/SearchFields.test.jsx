import SearchFields from "../SearchModal/SearchFields";
import { it } from 'vitest';
import { render } from "vitest-browser-react";

it("renders without crashing", () => {
  const searchFields = render(
    <SearchFields searchFields={{ pageNameQuery: "", citizenNameQuery: "", tagsQuery: "" }} />,
  );
});
