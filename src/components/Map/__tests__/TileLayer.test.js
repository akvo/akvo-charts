import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { LeafletProvider } from '../../../context/LeafletProvider';
import TileLayer from '../TileLayer';

describe('TileLayer', () => {
  it('should add the tile correctly and get the attribution', async () => {
    let instance = null;
    const { getByText, rerender } = render(
      <LeafletProvider
        ref={(el) => {
          instance = el;
        }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
      </LeafletProvider>
    );

    rerender(
      <LeafletProvider
        ref={(el) => {
          instance = el;
        }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
      </LeafletProvider>
    );
    await waitFor(async () => {
      expect(getByText('© OpenStreetMap')).toBeDefined();
    });
  });
});
