import React from 'react';
import { render, screen } from '@testing-library/react';
import Pie from '../Pie';
import renderer from 'react-test-renderer';

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

test('matches Pie snapshot', () => {
  const data = [
    { label: 'Category A', value: 30 },
    { label: 'Category B', value: 70 }
  ];

  const config = {
    title: 'Pie Chart Example'
  };

  const tree = renderer
    .create(
      <Pie
        config={config}
        data={data}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
