import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { WebView } from "react-native-webview";

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

type MapPressEvent = {
  nativeEvent: {
    coordinate: Coordinate;
  };
};

type MarkerProps = {
  coordinate: Coordinate;
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

type CircleProps = {
  center: Coordinate;
  radius: number;
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
};

type MapViewProps = {
  style?: ViewStyle;
  initialRegion?: Region;
  onPress?: (event: MapPressEvent) => void;
  children?: React.ReactNode;
  provider?: any;
};

/*
 * Kept only for compatibility with the existing screens.
 * We are NOT using Google Maps.
 */
export const PROVIDER_GOOGLE = undefined;

/*
 * These components are used as configuration objects
 * by UdyamMap. They do not render directly.
 */
export const Marker = (_props: MarkerProps) => null;

export const Circle = (_props: CircleProps) => null;

export const MapView = ({
  style,
  initialRegion,
  onPress,
  children,
}: MapViewProps) => {
  const markers: MarkerProps[] = [];
  const circles: CircleProps[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === Marker) {
      markers.push(child.props as MarkerProps);
    }

    if (child.type === Circle) {
      circles.push(child.props as CircleProps);
    }
  });

  const latitude = initialRegion?.latitude ?? 20.9374;
  const longitude = initialRegion?.longitude ?? 77.7509;

  const latitudeDelta =
    initialRegion?.latitudeDelta ?? 0.06;

  /*
   * Convert the React Native region into a reasonable
   * Leaflet zoom level.
   */
  let zoom = 14;

  if (latitudeDelta > 1) {
    zoom = 8;
  } else if (latitudeDelta > 0.5) {
    zoom = 9;
  } else if (latitudeDelta > 0.2) {
    zoom = 11;
  } else if (latitudeDelta > 0.1) {
    zoom = 12;
  } else if (latitudeDelta > 0.05) {
    zoom = 13;
  } else if (latitudeDelta > 0.02) {
    zoom = 14;
  } else {
    zoom = 15;
  }

  const markerData = markers.map((marker) => ({
    latitude: marker.coordinate.latitude,
    longitude: marker.coordinate.longitude,
    title: marker.title || "",
    description: marker.description || "",
  }));

  const circleData = circles.map((circle) => ({
    latitude: circle.center.latitude,
    longitude: circle.center.longitude,
    radius: circle.radius,
    strokeWidth: circle.strokeWidth ?? 1,
    strokeColor: circle.strokeColor || "#2E7D32",
    fillColor: circle.fillColor || "#2E7D32",
  }));

  const html = `
<!DOCTYPE html>

<html>

<head>

<meta
  name="viewport"
  content="width=device-width,
           initial-scale=1.0,
           maximum-scale=1.0,
           user-scalable=no"
/>

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

<style>

html,
body,
#map {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.leaflet-control-attribution {
  font-size: 9px;
}

.custom-marker {
  width: 38px;
  height: 38px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  font-size: 17px;

  border: 3px solid white;

  box-shadow:
    0 2px 7px rgba(0,0,0,0.35);
}

.proposed-marker {
  background: #2E7D32;
}

.competitor-marker {
  background: #555555;
}

</style>

</head>

<body>

<div id="map"></div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>

const initialLat = ${latitude};
const initialLon = ${longitude};
const initialZoom = ${zoom};

const map = L.map("map", {
  zoomControl: true,
  attributionControl: true
}).setView(
  [initialLat, initialLon],
  initialZoom
);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      "&copy; OpenStreetMap contributors"
  }
).addTo(map);


/*
 * Send map taps back to React Native.
 */
map.on("click", function(event) {

  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: "mapPress",

      latitude: event.latlng.lat,

      longitude: event.latlng.lng
    })
  );

});


/*
 * Marker icon.
 */
function createMarkerIcon(isProposed) {

  return L.divIcon({

    className: "",

    html:
      '<div class="custom-marker ' +

      (
        isProposed
          ? "proposed-marker"
          : "competitor-marker"
      ) +

      '">' +

      (
        isProposed
          ? "📍"
          : "🏪"
      ) +

      "</div>",

    iconSize: [38, 38],

    iconAnchor: [19, 19]

  });

}


/*
 * Markers
 */
const markers = ${JSON.stringify(markerData)};

markers.forEach(function(marker, index) {

  const isProposed =
    index === 0 &&
    marker.title === "Your Proposed Location";

  const leafletMarker =
    L.marker(
      [
        marker.latitude,
        marker.longitude
      ],
      {
        icon:
          createMarkerIcon(
            isProposed
          )
      }
    ).addTo(map);

  if (
    marker.title ||
    marker.description
  ) {

    leafletMarker.bindPopup(
      "<b>" +
      marker.title +
      "</b><br>" +
      marker.description
    );

  }

});


/*
 * Circles
 */
const circles = ${JSON.stringify(circleData)};

circles.forEach(function(circle) {

  L.circle(

    [
      circle.latitude,
      circle.longitude
    ],

    {
      radius: circle.radius,

      weight:
        circle.strokeWidth,

      color:
        circle.strokeColor,

      fillColor:
        circle.fillColor,

      fillOpacity: 0.08
    }

  ).addTo(map);

});

</script>

</body>

</html>
`;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html }}
      style={[styles.map, style]}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={(event) => {
        try {
          const data = JSON.parse(
            event.nativeEvent.data
          );

          if (
            data.type === "mapPress" &&
            typeof data.latitude === "number" &&
            typeof data.longitude === "number"
          ) {
            onPress?.({
              nativeEvent: {
                coordinate: {
                  latitude:
                    data.latitude,

                  longitude:
                    data.longitude,
                },
              },
            });
          }

        } catch (error) {

          console.warn(
            "Map message error:",
            error
          );

        }
      }}
    />
  );
};

const styles = StyleSheet.create({

  map: {
    flex: 1,
  },

});