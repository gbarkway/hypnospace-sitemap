import React from 'react';
import ReactDOM from 'react-dom';
import PageDetails from '../PageDetails';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PageDetails />, div);
});
