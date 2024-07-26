import React from 'react';
import { render, screen } from '@testing-library/react';
import Line from '../Line';
import renderer from 'react-test-renderer';

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

test('matches Line snapshot', () => {
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

  const tree = renderer
    .create(
      <Line
        config={config}
        data={data}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
