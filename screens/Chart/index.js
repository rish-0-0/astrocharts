import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  Button,
  Platform,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const {width, height} = Dimensions.get('window');

export default function (props) {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [date, setDate] = useState(new Date());
  const [latitude, setLatitude] = useState(String(0.0));
  const [longitude, setLongitude] = useState(String(0.0));
  const [timezone, setTimezone] = useState(
    String((0 - new Date().getTimezoneOffset()) / 60),
  );
  return (
    <ScrollView style={styles.view}>
      <Text style={styles.labels}>Birth Date</Text>
      <Text>{date.toDateString()}</Text>
      <Button
        onPress={() => {
          setMode('date');
          setShow(true);
        }}
        title="Open Date Picker"
      />
      <Text style={styles.labels}>Birth Time</Text>
      <Text>
        {date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:
        {date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}
      </Text>
      <Button
        onPress={() => {
          setMode('time');
          setShow(true);
        }}
        title="Open Time Picker"
      />
      <Text style={styles.labels}>Latitude</Text>
      <TextInput
        keyboardType="decimal-pad"
        onChangeText={(t) => setLatitude(t)}
        maxLength={6}
        value={latitude}
      />
      <Text style={styles.labels}>Longitude</Text>
      <TextInput
        keyboardType="decimal-pad"
        onChangeText={(t) => setLongitude(t)}
        maxLength={6}
        value={longitude}
      />
      <Text style={styles.labels}>Timezone</Text>
      <TextInput
        keyboardType="decimal-pad"
        onChangeText={(t) => setTimezone(t)}
        maxLength={5}
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
      {show && (
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
    ...StyleSheet.absoluteFillObject,
    minHeight: height,
  },
  labels: {
    textAlign: 'center',
  },
});
