import React from 'react';
import { render, screen } from '@testing-library/react';
import Bar from '../Bar';
import renderer from 'react-test-renderer';

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

test('matches Bar snapshot', () => {
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

  const tree = renderer
    .create(
      <Bar
        config={config}
        data={data}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
