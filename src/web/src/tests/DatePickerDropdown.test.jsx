import { render } from 'vitest-browser-react';
import DatePickerDropdown from "../DatePickerDropdown/DatePickerDropdown";
import { expect, test, it } from 'vitest';

test('rendering the DatePickerDropdown', async () => {
  const datePicker = render(<DatePickerDropdown />);
});
