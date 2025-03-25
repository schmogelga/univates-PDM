import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LocationData } from '../types';

type LocationItemProps = {
  location: LocationData;
};

export default function LocationItem({ location }: LocationItemProps) {
  return (
    <View style={styles.locationItem}>
      <Text style={styles.locationText}>
        {location.longitude}, {location.latitude}
      </Text>
      <Text style={styles.timestampText}>
        {new Date(location.timestamp).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  locationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
  },
});