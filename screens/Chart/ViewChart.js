import React, {useEffect} from 'react';
import {ScrollView, Text} from 'react-native';

// const astroreha = require('astroreha');

export default function ({navigation}) {
  const {dateString, timeString, lat, lng, timezone} = navigation.state.params;
  // const birthChart = astroreha.compatibility.getBirthChart(
  //   dateString,
  //   timeString,
  //   Number(lat),
  //   Number(lng),
  //   Number(timezone),
  // );
  // const nakshatra = astroreha.compatibility.calculateNakshatra(birthChart);
  useEffect(() => {
    // console.log(nakshatra, navigation.state.params);
  }, []);
  return (
    <ScrollView>
      <Text>Birth Chart and Navamsa Chart</Text>
    </ScrollView>
  );
}
