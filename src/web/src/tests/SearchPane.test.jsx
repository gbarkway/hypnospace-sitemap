import { render } from 'vitest-browser-react';
import SearchPane from "../SearchModal/SearchPane";
import { it } from 'vitest';

it("renders without crashing", () => {
  render(
    <SearchPane searchFields={{ pageNameQuery: "", citizenNameQuery: "", tagsQuery: "" }} />
  );
});
