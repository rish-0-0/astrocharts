import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  Button,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const {width, height} = Dimensions.get('window');

export default function (props) {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [date, setDate] = useState(new Date());
  return (
    <ScrollView style={styles.view}>
      <Text>Birth Date</Text>
      <Button
        onPress={() => {
          setShow(true);
          setMode('date');
        }}
        title="Open Date Picker"
      />
      <Text>Birth Time</Text>
      <Button
        onPress={() => {
          setShow(true);
          setMode('time');
        }}
        title="Open Time Picker"
      />
      {show && (
        <DateTimePicker
          mode={mode}
          value={date}
          is24Hour={true}
          display="spinner"
          onChange={(ev, val) => {
            setDate(val);
            setShow(false);
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
});
