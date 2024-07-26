import React from 'react';
import { render, screen } from '@testing-library/react';
import Doughnut from '../Doughnut';
import renderer from 'react-test-renderer';

test('renders Doughnut component', () => {
  const data = [
    { label: 'Category A', value: 30 },
    { label: 'Category B', value: 70 }
  ];

  const config = {
    title: 'Doughnut Chart Example'
  };

  render(
    <Doughnut
      config={config}
      data={data}
      size={50}
    />
  );

  const chartContainer = screen.getByRole('figure');
  expect(chartContainer).toBeInTheDocument();
});

test('matches Doughnut snapshot', () => {
  const data = [
    { label: 'Category A', value: 30 },
    { label: 'Category B', value: 70 }
  ];

  const config = {
    title: 'Doughnut Chart Example'
  };

  const tree = renderer
    .create(
      <Doughnut
        config={config}
        data={data}
        size={50}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
