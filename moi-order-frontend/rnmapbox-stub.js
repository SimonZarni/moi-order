// @rnmapbox/maps has no web build — stub it out on web.
module.exports = {
  default: () => null,
  MapView: () => null,
  Camera: () => null,
  UserLocation: () => null,
  ShapeSource: () => null,
  SymbolLayer: () => null,
  LineLayer: () => null,
  FillLayer: () => null,
  CircleLayer: () => null,
  MarkerView: () => null,
  Mapbox: { setAccessToken: () => {} },
};
