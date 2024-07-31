import React from 'react';
import { render, screen } from '@testing-library/react';
import StackBar from '../StackBar';
import renderer from 'react-test-renderer';

describe('StackBar chart', () => {
  test('renders StackBar component with 2d array data format', () => {
    const data = [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ];

    const config = {
      title: 'StackBar Chart Example',
      xAxisLabel: 'Categories',
      yAxisLabel: 'Values'
    };

    render(
      <StackBar
        config={config}
        data={data}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('renders StackBar component with row based key-value format (object array)', () => {
    const data = [
      { product: 'Matcha Latte', count: 823, score: 95.8 },
      { product: 'Milk Tea', count: 235, score: 81.4 },
      { product: 'Cheese Cocoa', count: 1042, score: 91.2 },
      { product: 'Walnut Brownie', count: 988, score: 76.9 }
    ];

    const config = {
      title: 'StackBar Chart Example',
      xAxisLabel: 'Categories',
      yAxisLabel: 'Values'
    };

    render(
      <StackBar
        config={config}
        data={data}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('renders StackBar component with column based key-value format', () => {
    const data = {
      product: ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie'],
      count: [823, 235, 1042, 988],
      score: [95.8, 81.4, 91.2, 76.9]
    };

    const config = {
      title: 'StackBar Chart Example',
      xAxisLabel: 'Categories',
      yAxisLabel: 'Values'
    };

    const stackMapping = {
      group1: [2015, 2016],
      group2: [2017, 2018]
    };

    render(
      <StackBar
        config={config}
        data={data}
        stackMapping={stackMapping}
        horizontal={false}
      />
    );

    const chartContainer = screen.getByRole('figure');
    expect(chartContainer).toBeInTheDocument();
  });

  test('matches StackBar snapshot', () => {
    const data = [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ];

    const config = {
      title: 'StackBar Chart Example',
      xAxisLabel: 'Categories',
      yAxisLabel: 'Values'
    };

    const tree = renderer
      .create(
        <StackBar
          config={config}
          data={data}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
