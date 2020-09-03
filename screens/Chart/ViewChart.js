import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import db from '../../config/mongodb';
import API from '../../config/axios';
// import astroreha from 'astroreha';
// const astroreha = require('astroreha');

export default function ({navigation, route}) {
  const {dateString, timeString, lat, lng, timezone} = route.params;
  const [loading, setLoading] = useState(false);
  const [birthChart, setBirthChart] = useState(null);
  const [navamsaChart, setNavamsaChart] = useState(null);
  const [nakshatra, setNakshatra] = useState(null);
  const [rashi, setRashi] = useState(null);
  const [houses, setHouses] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      db.find({dateString, timeString, lat, lng, timezone}, (err, docs) => {
        if (err) {
          setError('Internal Error');
        } else {
          if (docs.length) {
            const {birthChart: birth, navamsa, houses, nakshatra} = docs[0];
            setBirthChart(birth);
            setNakshatra(nakshatra);
            setHouses(houses);
            setNavamsaChart(navamsa);
            setRashi(birth.meta.Mo.rashi);
            setLoading(false);
          } else {
            // Make the API call
            API.post('/astrodetails', {
              firstPerson: {dateString, timeString, lat, lng, timezone},
            })
              .then(({data}) => {
                const {birthChart, navamsa, houses, nakshatra} = data;
                db.insert(
                  {
                    dateString,
                    timeString,
                    lat,
                    lng,
                    timezone,
                    birthChart,
                    navamsa,
                    houses,
                    nakshatra,
                  },
                  (err, newDoc) => {
                    if (err) {
                      setError('Internal Error.');
                      setLoading(false);
                    } else {
                      setBirthChart(newDoc.birthChart);
                      setNavamsaChart(newDoc.navamsa);
                      setHouses(newDoc.houses);
                      setNakshatra(newDoc.nakshatra);
                      setError(null);
                      setLoading(false);
                    }
                  },
                );
              })
              .catch((e) => {
                if (e.response.status == 500 || e.response.status == 404) {
                  setError('Systems are down. Please try again later');
                } else {
                  setError('Network Error.');
                }
                setLoading(false);
              });
          }
        }
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log(JSON.stringify(birthChart, null, 4));
  }, [birthChart, navamsaChart, houses, nakshatra]);
  return (
    <ScrollView>
      <Text>Birth Chart and Navamsa Chart</Text>
    </ScrollView>
  );
}
