import { render } from 'vitest-browser-react';
import Spinner from "../Spinner";
import { it } from 'vitest';

it("renders without crashing", () => {
  render(<Spinner />);
});
