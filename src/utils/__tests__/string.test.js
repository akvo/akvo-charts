import { string2WindowObj } from '../string';

describe('utils/string', () => {
  let windowSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  it('should convert a string into a window object', () => {
    windowSpy.mockImplementation(() => ({
      mapFeature: {
        tile: {
          url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
          maxZoom: 19,
          attribution: 'Humanitarian OpenStreetMap Team'
        }
      }
    }));
    const windowString = 'mapFeature.tile';
    const res = string2WindowObj(windowString);
    expect(res).toEqual(window.mapFeature.tile);
    expect(res.attribution).toEqual('Humanitarian OpenStreetMap Team');
  });
});
