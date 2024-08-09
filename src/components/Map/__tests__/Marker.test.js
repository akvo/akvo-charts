import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { LeafletProvider } from '../../../context/LeafletProvider';
import Marker from '../Marker';

describe('Marker', () => {
  it('should add the marker correctly and get the popUp label', async () => {
    let instance = null;

    const { getByAltText, getByText, rerender } = render(
      <LeafletProvider
        ref={(el) => {
          instance = el;
        }}
      >
        <Marker
          latlng={[-6.170166, 106.831375]}
          label="Istiqlal Mosque"
        />
      </LeafletProvider>
    );

    rerender(
      <LeafletProvider
        ref={(el) => {
          instance = el;
        }}
      >
        <Marker
          latlng={[-6.170166, 106.831375]}
          label="Istiqlal Mosque"
        />
      </LeafletProvider>
    );
    await waitFor(async () => {
      expect(getByAltText('Marker')).toBeDefined();
    });

    act(() => {
      const elMarker = getByAltText('Marker');
      fireEvent.click(elMarker);
    });

    await waitFor(async () => {
      expect(getByText('Istiqlal Mosque')).toBeDefined();
    });
  });
});
