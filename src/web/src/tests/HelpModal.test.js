import React from 'react';
import ReactDOM from 'react-dom';
import HelpModal from '../HelpModal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HelpModal />, div);
});
