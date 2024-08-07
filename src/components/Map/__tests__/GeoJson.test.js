import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react';
import { LeafletProvider } from '../../../context/LeafletProvider';
import TileLayer from '../TileLayer';
import GeoJson from '../GeoJson';

describe('TileLayer', () => {
  it('should set geojson correctly and trigger onClick', async () => {
    let instance = null;
    const mRef = React.createRef();
    const geoJsonData = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-6.175414, 106.827175]
      },
      properties: {
        name: 'The National Monument'
      }
    };

    const onClickMock = jest.fn();
    const { debug, rerender, getByAltText } = render(
      <>
        <div
          width="400"
          height="400"
          ref={mRef}
        />
        <LeafletProvider
          mapContainerRef={mRef}
          ref={(el) => {
            instance = el;
          }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          <GeoJson
            data={geoJsonData}
            onClick={onClickMock}
          />
        </LeafletProvider>
      </>
    );

    rerender(
      <>
        <div
          width="400"
          height="400"
          ref={mRef}
        />
        <LeafletProvider
          mapContainerRef={mRef}
          ref={(el) => {
            instance = el;
          }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          <GeoJson
            data={geoJsonData}
            onClick={onClickMock}
          />
        </LeafletProvider>
      </>
    );

    act(() => {
      const elMarker = getByAltText('Marker');
      fireEvent.click(elMarker);
    });

    await waitFor(async () => {
      expect(onClickMock).toHaveBeenCalledTimes(1);
    });
  });
});
