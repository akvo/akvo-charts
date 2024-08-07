import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { LeafletProvider } from '../LeafletProvider';

describe('LeafletProvider', () => {
  it('should get leaflet instance correctly', async () => {
    let instance = null;
    const mRef = React.createRef();
    render(
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
          <span />
        </LeafletProvider>
      </>
    );
    await waitFor(async () => {
      expect(instance.getMap()).not.toBeNull();
      expect(instance.getMap().getCenter()).toEqual({ lat: 0, lng: 0 });
    });
  });

  it('should render emtpy map correctly', async () => {
    let instance = null;
    const mRef = React.createRef();
    render(
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
          <p>This is Map children</p>
        </LeafletProvider>
      </>
    );
    await waitFor(async () => {
      expect(screen.getByText('Leaflet')).toBeDefined();
    });
  });
});
