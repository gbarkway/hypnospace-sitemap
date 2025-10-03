import { render } from 'vitest-browser-react';
import PageDetails from "../PageDetails/PageDetails";
import { it } from 'vitest';

it("renders without crashing", () => {
  const pageDetails = render(<PageDetails />);
});
