/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../../components/PrimaryButton';
import {
  getCurrentLocation,
  requestPermissionLocation,
} from '../../config/geolocation';
const {width, height} = Dimensions.get('window');

export default function (props) {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [date, setDate] = useState(new Date());
  const [latitude, setLatitude] = useState(String(0.0));
  const [longitude, setLongitude] = useState(String(0.0));
  const [showIOSTime, setShowIOSTime] = useState(false);
  const [showIOSDate, setShowIOSDate] = useState(false);
  const [timezone, setTimezone] = useState(
    String((0 - new Date().getTimezoneOffset()) / 60),
  );

  const [error, setError] = useState(null);

  const getSuccessfulCoords = ({location}) => {
    // console.log(location);
    setLatitude(String(location.latitude));
    setLongitude(String(location.longitude));
  };
  const getFailureCoords = () => {
    setError("Couldn't get Current Location");
  };

  return (
    <ScrollView style={styles.view}>
      <Text
        style={styles.savedCharts}
        onPress={() => props.navigation.navigate('Saved Charts')}>
        History {'>'}
      </Text>
      <Text style={styles.labels}>Birth Date</Text>
      <Text style={{textAlign: 'center'}}>{date.toDateString()}</Text>
      <Button
        onPress={() => {
          setMode('date');
          setShow(true);
          if (Platform.OS === 'ios') {
            setShowIOSDate(true);
          }
        }}
        title="Open Date Picker"
      />
      {Platform.OS === 'ios' && showIOSDate && (
        <DateTimePicker
          mode="date"
          value={date}
          is24Hour={true}
          display="spinner"
          onChange={(ev, val) => {
            setShowIOSTime(false);
            setDate(val || new Date());
          }}
        />
      )}
      <Text style={styles.labels}>Birth Time</Text>
      <Text style={{textAlign: 'center'}}>
        {date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:
        {date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}
      </Text>
      <Button
        onPress={() => {
          if (Platform.OS === 'ios') {
            setShowIOSDate(false);
          }
          setMode('time');
          setShow(true);
          if (Platform.OS === 'ios') {
            setShowIOSTime(true);
          }
        }}
        title="Open Time Picker"
      />
      {Platform.OS === 'ios' && showIOSTime && (
        <DateTimePicker
          mode="time"
          value={date}
          is24Hour={true}
          display="spinner"
          onChange={(ev, val) => {
            setShowIOSDate(false);
            setDate(val || new Date());
          }}
        />
      )}
      <Text style={styles.labels}>Location Details</Text>
      <Button
        onPress={async () => {
          if (Platform.OS === 'ios') {
            setShowIOSDate(false);
            setShowIOSTime(false);
          } else {
            setShow(false);
          }
          try {
            await requestPermissionLocation((val) => {
              getCurrentLocation(val, getSuccessfulCoords, getFailureCoords);
            });
          } catch (e) {
            setError('Error ocurred while requesting Location Permission');
          }
        }}
        title="Use Current Location"
      />
      <Text style={styles.labels}>Latitude</Text>
      <Text style={styles.examples}>
        eg: 12.926 which implies 12.926{'\u00B0N'}
      </Text>
      <Text style={styles.examples}>
        eg: -33.868 which implies 33.868{'\u00B0S'}
      </Text>
      <TextInput
        keyboardType="decimal-pad"
        onFocus={() => {
          if (Platform.OS === 'ios') {
            setShowIOSDate(false);
            setShowIOSTime(false);
          } else {
            setShow(false);
          }
        }}
        onChangeText={(t) => {
          setLatitude(t);
        }}
        maxLength={6}
        style={{textAlign: 'center'}}
        value={latitude}
      />
      <Text style={styles.labels}>Longitude</Text>
      <Text style={styles.examples}>
        eg: 77.664 which implies 77.664{'\u00B0E'}
      </Text>
      <Text style={styles.examples}>
        eg: -95.369 which implies 95.369{'\u00B0W'}
      </Text>
      <TextInput
        keyboardType="decimal-pad"
        onFocus={() => {
          if (Platform.OS === 'ios') {
            setShowIOSDate(false);
            setShowIOSTime(false);
          } else {
            setShow(false);
          }
        }}
        onChangeText={(t) => {
          setLongitude(t);
        }}
        maxLength={6}
        style={{textAlign: 'center'}}
        value={longitude}
      />

      <Text style={styles.labels}>Timezone</Text>
      <Text style={styles.examples}>eg: 5.5 which implies GMT+5:30</Text>
      <Text style={styles.examples}>eg: -5 which implies GMT-5:00</Text>
      <TextInput
        keyboardType="decimal-pad"
        onFocus={() => {
          if (Platform.OS === 'ios') {
            setShowIOSDate(false);
            setShowIOSTime(false);
          } else {
            setShow(false);
          }
        }}
        onChangeText={(t) => {
          setTimezone(t);
        }}
        maxLength={5}
        style={{textAlign: 'center'}}
        value={timezone}
      />
      <Button
        onPress={() =>
          props.navigation.navigate('Charts', {
            dateString: `${date.getFullYear()}-${
              date.getMonth() + 1 < 10
                ? '0' + String(date.getMonth() + 1)
                : date.getMonth() + 1
            }-${
              date.getDate() < 10
                ? '0' + String(date.getDate())
                : date.getDate()
            }`,
            timeString: `${
              date.getHours() < 10
                ? '0' + String(date.getHours())
                : date.getHours()
            }:${
              date.getMinutes() < 10
                ? '0' + String(date.getMinutes())
                : date.getMinutes()
            }:00`,
            lat: latitude,
            lng: longitude,
            timezone: timezone,
          })
        }
        title="Generate Charts!"
      />
      {Platform.OS === 'android' && show && (
        <DateTimePicker
          mode={mode}
          value={date}
          is24Hour={true}
          display="spinner"
          onChange={(ev, val) => {
            setShow(false);
            setDate(val || new Date());
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    // ...StyleSheet.absoluteFillObject,
    // minHeight: height,
    paddingHorizontal: '5%',
  },
  labels: {
    textAlign: 'center',
    padding: 18,
    fontSize: 24,
    lineHeight: 24,
    textTransform: 'uppercase',
    letterSpacing: 3.5,
  },
  savedCharts: {
    textAlign: 'right',
    padding: 12,
    fontSize: 18,
    lineHeight: 18,
    letterSpacing: 3.5,
    color: 'deepskyblue',
  },
  examples: {
    color: 'gray',
    textAlign: 'center',
    lineHeight: 14,
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
