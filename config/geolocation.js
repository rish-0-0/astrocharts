import Geolocation, {
  requestAuthorization,
} from 'react-native-geolocation-service';
import {Platform, PermissionsAndroid} from 'react-native';

export async function requestPermissionLocation(callback) {
  try {
    if (Platform.OS === 'ios') {
      const status = await requestAuthorization('whenInUse');
      if (status === 'granted') {
        return callback(true);
      }
    } else if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'AstroCharts',
          message: 'Allow AstroCharts to access your location?',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return callback(true);
      }
    }
    return callback(false);
  } catch (e) {
    return callback(false);
  }
}

export function getCurrentLocation(state, successCallback, errorCallback) {
  let hasLocationPermission = state;
  if (hasLocationPermission) {
    Geolocation.getCurrentPosition(
      (position) => {
        successCallback({
          location: {...position.coords},
          timestamp: position.timestamp,
        });
      },
      (error) => {
        errorCallback(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  }
}
