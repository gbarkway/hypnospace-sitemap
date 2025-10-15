import { it } from 'vitest'
import { render } from 'vitest-browser-react';
import HelpModal from "../HelpModal";

it("renders without crashing", () => {
  const helpModal = render(<HelpModal />);
});
