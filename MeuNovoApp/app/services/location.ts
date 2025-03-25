import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

export async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
}
