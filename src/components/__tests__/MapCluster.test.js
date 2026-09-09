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

  const quantityProps = {
    tile: {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    },
    data: [
      {
        point: [-6.2251619, 106.714291],
        label: 'Jakarta',
        population: 10562088
      },
      {
        point: [-7.2574719, 112.7520883],
        label: 'Surabaya',
        population: 2874314
      },
      { point: [-6.9174639, 107.6191228], label: 'Bandung' }
    ],
    type: 'quantity',
    valueKey: 'population',
    config: {
      center: [-6.2, 106.8],
      zoom: 5,
      height: '100vh',
      width: '100%'
    }
  };

  test('renders MapCluster with type quantity', async () => {
    let instance = null;
    render(
      <MapCluster
        {...quantityProps}
        ref={(el) => {
          instance = el;
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeInTheDocument();
      expect(instance.getMap().getMaxZoom()).toEqual(19);
    });
  });

  // Bandung carries a point but no `population` field. Every path that reads a
  // value - the radius scale, the cluster sum, the leaf icon - must coerce it
  // to 0 rather than throw. The coercion itself is asserted at the unit level
  // in mapHelper.test.js; this guards the component wiring against a crash.
  test('renders without error when a row is missing the value field', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<MapCluster {...quantityProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeInTheDocument();
    });

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  test('matches MapCluster quantity snapshot', async () => {
    const { asFragment } = render(<MapCluster {...quantityProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
