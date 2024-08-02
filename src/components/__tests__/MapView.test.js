import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MapView from '../MapView';

describe('MapView chart', () => {
  test('renders MapView correctly', async () => {
    const props = {
      data: [
        {
          point: [39.61, -105.02],
          label: 'This is Littleton, CO.'
        }
      ],
      config: {
        center: [39.73, -104.99],
        zoom: 10
      },
      layers: [
        {
          tile: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }
      ]
    };
    let instance = null;
    render(
      <MapView
        {...props}
        ref={(el) => {
          instance = el;
        }}
      />
    );

    await waitFor(() => {
      const chartContainer = screen.getByTestId('map-view');
      expect(chartContainer).toBeInTheDocument();
      expect(instance.getCenter()).toEqual({
        lat: 39.73,
        lng: -104.99
      });
    });
  });

  test('matches MapView snapshot', async () => {
    const props = {
      data: [
        {
          point: [39.61, -105.02],
          label: 'This is Littleton, CO.'
        }
      ],
      config: {
        center: [39.73, -104.99],
        zoom: 10
      },
      layers: [
        {
          tile: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }
      ]
    };

    let instance = null;
    const { container } = render(
      <MapView
        {...props}
        ref={(el) => {
          instance = el;
        }}
      />
    );
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
