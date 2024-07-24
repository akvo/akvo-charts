import React from 'react';
import { render, screen } from '@testing-library/react';
import Pie from './Pie';

test('renders Pie component', () => {
  const data = [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: 30 }
  ];

  const config = {
    title: {
      text: 'Pie Chart Example'
    }
  };

  render(
    <Pie
      config={config}
      data={data}
    />
  );

  const chartContainer = screen.getByRole('figure');
  expect(chartContainer).toBeInTheDocument();
});
