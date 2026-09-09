import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import L from 'leaflet';
import MapCluster, { buildPopupContent } from '../MapCluster';

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

  // Regression test for #54: switching `type` on an already-mounted
  // MapCluster instance (same tree position, no unmount - this is what the
  // example playground does when it changes chart type without also
  // dispatching a re-render) must swap the cluster's icon-create function
  // and must not leak a second, stale marker cluster group onto the map.
  test('swapping type from circle to quantity on the same instance updates the cluster icon without leaking a layer', async () => {
    let instance = null;
    const circleProps = {
      ...quantityProps,
      type: 'circle',
      groupKey: 'label'
    };

    const { rerender } = render(
      <MapCluster
        {...circleProps}
        ref={(el) => {
          instance = el;
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeInTheDocument();
    });

    // Re-render the SAME instance (same tree position) with type="quantity",
    // mirroring the example app dispatching SET_SELECTED_CHART_TYPE without
    // RERENDER_TRUE - no unmount happens here.
    rerender(
      <MapCluster
        {...quantityProps}
        ref={(el) => {
          instance = el;
        }}
      />
    );

    await waitFor(() => {
      const map = instance.getMap();
      const clusterGroups = [];
      map.eachLayer((layer) => {
        if (typeof layer?.options?.iconCreateFunction === 'function') {
          clusterGroups.push(layer);
        }
      });

      // Exactly one cluster group must remain attached - proves the stale
      // group created for type="circle" was removed, not just emptied.
      expect(clusterGroups).toHaveLength(1);

      const fakeCluster = {
        getAllChildMarkers: () => [
          { options: { quantityValue: 10562088 } },
          { options: { quantityValue: 2874314 } }
        ],
        getChildCount: () => 2
      };
      const icon = clusterGroups[0].options.iconCreateFunction(fakeCluster);

      // The quantity icon renders the formatted summed value in a bold
      // label; the stale count-donut would instead render the bare child
      // count ("2") with no font-weight.
      expect(icon.options.html).toContain('font-weight="bold"');
      expect(icon.options.html).not.toContain(
        `>${fakeCluster.getChildCount()}</text>`
      );
    });
  });

  // Leaflet markers/popups don't render in jsdom (Leaflet needs real layout),
  // so popup content is asserted directly against the exported pure builder
  // instead of against rendered marker DOM.
  describe('buildPopupContent', () => {
    const jakarta = { label: 'Jakarta', population: 10562088 };

    test('shows the label and the exact (non-compact) value for quantity type', () => {
      const { container } = render(
        buildPopupContent(jakarta, { isQuantity: true, valueKey: 'population' })
      );

      expect(container.textContent).toContain('Jakarta');
      expect(container.textContent).toContain((10562088).toLocaleString());
      // The circle itself already shows the compact form; the popup must not
      // just repeat it.
      expect(container.textContent).not.toContain('10.6M');
    });

    test('coerces a missing or non-numeric value to zero rather than dropping it', () => {
      const { container } = render(
        buildPopupContent(
          { label: 'Bandung' },
          { isQuantity: true, valueKey: 'population' }
        )
      );

      expect(container.textContent).toContain('Bandung');
      expect(container.textContent).toContain('0');
    });

    test('shows only the label for non-quantity types', () => {
      const { container } = render(
        buildPopupContent(jakarta, {
          isQuantity: false,
          valueKey: 'population'
        })
      );

      expect(container.textContent).toBe('Jakarta');
    });

    test('lets a user-supplied renderPopup override the default completely, even for quantity type', () => {
      const renderPopup = (d) => <span>{`Custom: ${d.label}`}</span>;
      const { container } = render(
        buildPopupContent(jakarta, {
          renderPopup,
          isQuantity: true,
          valueKey: 'population'
        })
      );

      expect(container.textContent).toBe('Custom: Jakarta');
      expect(container.textContent).not.toContain('10,562,088');
    });
  });
});
