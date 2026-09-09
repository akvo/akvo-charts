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

  // Regression tests for #61: `type="quantity"` hard-coded a SUM, which is
  // wrong for intensive quantities (litres per person per day, %
  // functionality, cost per connection) - two points merging on zoom-out made
  // the circle claim a figure with no meaning, and grow while claiming it.
  describe('aggregate prop', () => {
    const iconCreateFnOf = (instance) => {
      let fn = null;
      instance.getMap().eachLayer((layer) => {
        if (typeof layer?.options?.iconCreateFunction === 'function') {
          fn = layer.options.iconCreateFunction;
        }
      });
      return fn;
    };

    const clusterOfCities = {
      getAllChildMarkers: () => [
        { options: { quantityValue: 10562088 } },
        { options: { quantityValue: 2874314 } }
      ],
      getChildCount: () => 2
    };

    // Jakarta alone: the dataset maximum. Under `average` it must draw at
    // rMax (56) - a diameter of 112.
    const clusterOfMax = {
      getAllChildMarkers: () => [{ options: { quantityValue: 10562088 } }],
      getChildCount: () => 1
    };

    const renderQuantity = async (props) => {
      let instance = null;
      render(
        <MapCluster
          {...quantityProps}
          {...props}
          ref={(el) => {
            instance = el;
          }}
        />
      );
      await waitFor(() => {
        expect(screen.getByTestId('map-view')).toBeInTheDocument();
      });
      return instance;
    };

    test('labels a cluster with the mean of its children when aggregate is average', async () => {
      const instance = await renderQuantity({ aggregate: 'average' });

      const icon = iconCreateFnOf(instance)(clusterOfCities);

      // (10562088 + 2874314) / 2 = 6718201 -> 6.7M. The sum reads 13.4M.
      expect(icon.options.html).toContain('>6.7M<');
    });

    test('keeps summing when aggregate is omitted', async () => {
      const instance = await renderQuantity({});

      expect(iconCreateFnOf(instance)(clusterOfCities).options.html).toContain(
        '>13.4M<'
      );
    });

    test('keeps summing when aggregate is set to sum', async () => {
      const instance = await renderQuantity({ aggregate: 'sum' });

      expect(iconCreateFnOf(instance)(clusterOfCities).options.html).toContain(
        '>13.4M<'
      );
    });

    // The guard that fails if only the reducer is swapped and the radius
    // scale is left on the sum domain: no cluster average can then reach the
    // domain top, so every circle collapses toward rMin (here 103px instead
    // of 112px, and far worse as the dataset grows) with no error to show it.
    test('draws the dataset maximum at rMax when aggregate is average', async () => {
      const instance = await renderQuantity({ aggregate: 'average' });

      expect(iconCreateFnOf(instance)(clusterOfMax).options.iconSize.x).toEqual(
        112
      );
    });

    test('keeps the sum domain when aggregate is sum, so a single max point stays below rMax', async () => {
      const instance = await renderQuantity({ aggregate: 'sum' });

      expect(
        iconCreateFnOf(instance)(clusterOfMax).options.iconSize.x
      ).toBeLessThan(112);
    });
  });

  // Leaflet renders no marker DOM under jsdom (it needs real layout), but the
  // cluster TREE is fully computed - so clustering is asserted through each
  // marker's `__parent`: a marker that clustered hangs off a MarkerCluster,
  // while a marker that did not hangs off the group's top level.
  describe('cluster prop', () => {
    // Close enough together to cluster at the rendered zoom, plus a third
    // point exactly coincident with the first - the hardest case to
    // un-cluster, since a zero-radius grid still groups coincident points.
    const nearbyProps = {
      tile: {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      },
      data: [
        { point: [39.61, -105.02], name: 'Basic', label: 'Littleton' },
        { point: [39.62, -105.03], name: 'Basic', label: 'Near Littleton' },
        { point: [39.61, -105.02], name: 'Basic', label: 'Also Littleton' }
      ],
      config: {
        center: [39.61, -105.02],
        zoom: 10,
        height: '100vh',
        width: '100%'
      }
    };

    const getClusterGroups = (map) => {
      const groups = [];
      map.eachLayer((layer) => {
        if (typeof layer?.options?.iconCreateFunction === 'function') {
          groups.push(layer);
        }
      });
      return groups;
    };

    const renderMap = async (props) => {
      let instance = null;
      const result = render(
        <MapCluster
          {...props}
          ref={(el) => {
            instance = el;
          }}
        />
      );
      await waitFor(() => {
        expect(screen.getByTestId('map-view')).toBeInTheDocument();
      });
      return { ...result, getMap: () => instance.getMap() };
    };

    test('clusters nearby points by default', async () => {
      const { getMap } = await renderMap(nearbyProps);

      const [group] = getClusterGroups(getMap());
      const clustered = group
        .getLayers()
        .filter((m) => m.__parent !== group._topClusterLevel);

      expect(clustered).toHaveLength(nearbyProps.data.length);
    });

    test('renders every point separately when cluster is false', async () => {
      const { getMap } = await renderMap({ ...nearbyProps, cluster: false });

      const [group] = getClusterGroups(getMap());
      const clustered = group
        .getLayers()
        .filter((m) => m.__parent !== group._topClusterLevel);

      expect(clustered).toHaveLength(0);
    });

    test('passes a cluster options object through to the Leaflet cluster group', async () => {
      const { getMap } = await renderMap({
        ...nearbyProps,
        cluster: { maxClusterRadius: 200, spiderfyOnMaxZoom: false }
      });

      const [group] = getClusterGroups(getMap());

      expect(group.options.maxClusterRadius).toBe(200);
      expect(group.options.spiderfyOnMaxZoom).toBe(false);
    });

    // The cluster group is built in an effect keyed only on the map ref, so a
    // changed `cluster` value can only take effect by remounting the group.
    // Without that, toggling clustering silently keeps the old group.
    test('toggling cluster on a mounted instance rebuilds the group instead of leaving a stale one', async () => {
      let instance = null;
      const { rerender } = render(
        <MapCluster
          {...nearbyProps}
          ref={(el) => {
            instance = el;
          }}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('map-view')).toBeInTheDocument();
      });

      rerender(
        <MapCluster
          {...nearbyProps}
          cluster={false}
          ref={(el) => {
            instance = el;
          }}
        />
      );

      await waitFor(() => {
        const groups = getClusterGroups(instance.getMap());
        expect(groups).toHaveLength(1);

        const clustered = groups[0]
          .getLayers()
          .filter((m) => m.__parent !== groups[0]._topClusterLevel);
        expect(clustered).toHaveLength(0);
      });
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
