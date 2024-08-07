import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { LeafletProvider } from '../../../context/LeafletProvider';
import TileLayer from '../TileLayer';

describe('TileLayer', () => {
  it('should add the tile correctly and get the attribution', async () => {
    let instance = null;
    const mRef = React.createRef();
    const { getByText, rerender } = render(
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
        </LeafletProvider>
      </>
    );
    await waitFor(async () => {
      expect(getByText('© OpenStreetMap')).toBeDefined();
    });
  });
});
