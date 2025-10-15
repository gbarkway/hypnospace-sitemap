import SearchResults from "../SearchModal/SearchResults";
import { it } from 'vitest';
import { render } from 'vitest-browser-react';

it("renders without crashing", () => {
  render(<SearchResults />);
});
