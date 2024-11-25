import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MapCluster from '../MapCluster';

describe('MapCluster chart', () => {
  test('renders MapCluster correctly', async () => {
    const props = {
      tile: {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      },
      data: [
        {
          point: [39.61, -105.02],
          name: 'Basic',
          label: 'This is Littleton, CO.',
          color: 'blue'
        },
        {
          point: [39.73, -104.8],
          name: 'Limited',
          label: 'This is Aurora, CO.',
          color: 'yellow'
        }
      ],
      config: {
        center: [39.73, -104.99],
        zoom: 10,
        height: '100vh',
        width: '100%'
      }
    };
    let instance = null;
    render(
      <MapCluster
        {...props}
        ref={(el) => {
          instance = el;
        }}
      />
    );

    await waitFor(() => {
      const mapContainer = screen.getByTestId('map-view');
      expect(mapContainer).toBeInTheDocument();

      expect(instance.getMap().getPixelOrigin()).toEqual({
        x: 54621,
        y: 99498
      });
      expect(instance.getMap().getMaxZoom()).toEqual(19);
    });
  });

  test('matches MapCluster snapshot', async () => {
    const props = {
      tile: {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      },
      layer: {
        source: 'window.topoData'
      },
      data: [
        {
          point: [39.61, -105.02],
          name: 'Basic',
          label: 'This is Littleton, CO.',
          color: 'blue'
        },
        {
          point: [39.73, -104.8],
          name: 'Limited',
          label: 'This is Aurora, CO.',
          color: 'yellow'
        }
      ],
      config: {
        center: [39.73, -104.99],
        zoom: 10,
        height: '100vh',
        width: '100%'
      }
    };

    let instance = null;
    const { container } = render(
      <MapCluster
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
