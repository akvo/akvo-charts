import React from 'react';
import { render, screen } from '@testing-library/react';
import Pie from './Pie';

test('renders Pie component', () => {
  const data = [
    { label: 'Category A', value: 30 },
    { label: 'Category B', value: 70 }
  ];

  const config = {
    title: 'Pie Chart Example'
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
