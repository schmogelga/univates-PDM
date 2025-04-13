import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { getRoutePoints } from '../storage/sqliteStorage';

const RouteMapScreen = ({ route }) => {
  const { routeId } = route.params;
  const [routePoints, setRoutePoints] = useState([]);

  useEffect(() => {
    const fetchRoutePoints = async () => {
      try {
        const pointsData = await getRoutePoints(routeId);
        setRoutePoints(pointsData);
      } catch (error) {
        console.error('Erro ao carregar pontos da rota:', error);
      }
    };

    fetchRoutePoints();
  }, [routeId]);

  const generateMapHtml = () => {
    const points = routePoints.map(
      (point) => `L.marker([${point.latitude}, ${point.longitude}]).addTo(map).bindPopup("Timestamp: ${point.timestamp}");`
    ).join('\n');

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Route Map</title>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
          <style>
            body, html { margin: 0; height: 100%; }
            #map { height: 100%; }
          </style>
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        </head>
        <body>
          <div id="map"></div>
          <script>
            var map = L.map('map').setView([${routePoints[0]?.latitude || 0}, ${routePoints[0]?.longitude || 0}], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            ${points}
          </script>
        </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mapa da Rota</Text>
      {routePoints.length > 0 ? (
        <WebView
          originWhitelist={['*']}
          source={{ html: generateMapHtml() }}
          style={styles.map}
        />
      ) : (
        <Text>Carregando mapa...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  map: {
    flex: 1,
  },
});

export default RouteMapScreen;
