import React from 'react';
import { render, screen } from '@testing-library/react';
import Line from '../Line';

test('renders Line component', () => {
  const data = [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: 30 }
  ];

  const config = {
    title: 'Line Chart Example',
    xAxisLabel: 'Categories',
    yAxisLabel: 'Values'
  };

  render(
    <Line
      config={config}
      data={data}
    />
  );

  const chartContainer = screen.getByRole('figure');
  expect(chartContainer).toBeInTheDocument();
});
