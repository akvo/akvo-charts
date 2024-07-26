import React from 'react';
import { render, screen } from '@testing-library/react';
import Bar from '../Bar';

test('renders Bar component', () => {
  const data = [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: 30 }
  ];

  const config = {
    title: 'Bar Chart Example',
    xAxisLabel: 'Categories',
    yAxisLabel: 'Values'
  };

  render(
    <Bar
      config={config}
      data={data}
    />
  );

  const chartContainer = screen.getByRole('figure');
  expect(chartContainer).toBeInTheDocument();
});
