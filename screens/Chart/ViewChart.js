import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import db from '../../config/mongodb';
import API from '../../config/axios';
import ChartSection from '../../components/ChartSection';
// import astroreha from 'astroreha';
// const astroreha = require('astroreha');

function ChartView({birthChart}) {
  return (
    <>
      <View style={styles.bcr}>
        <ChartSection
          grahas={birthChart.pisces.signs}
          rashi="Pisces"
          style={{backgroundColor: 'lavender', flex: 1}}
        />
        <ChartSection
          grahas={birthChart.aries.signs}
          rashi="Aries"
          style={{backgroundColor: 'indianred', flex: 1}}
        />
        <ChartSection
          grahas={birthChart.taurus.signs}
          rashi="Taurus"
          style={{backgroundColor: 'navy', flex: 1}}
        />
        <ChartSection
          grahas={birthChart.gemini.signs}
          rashi="Gemini"
          style={{backgroundColor: 'palevioletred', flex: 1}}
        />
      </View>
      <View style={styles.bcr}>
        <ChartSection
          grahas={birthChart.aquarius.signs}
          rashi="Aquarius"
          style={{backgroundColor: 'cyan', flex: 1}}
        />
        <View style={{flex: 2, minHeight: 80}}></View>
        <ChartSection
          grahas={birthChart.cancer.signs}
          rashi="Cancer"
          style={{backgroundColor: 'plum', flex: 1}}
        />
      </View>
      <View style={styles.bcr}>
        <ChartSection
          grahas={birthChart.capricorn.signs}
          rashi="Capricorn"
          style={{backgroundColor: 'turquoise', flex: 1}}
        />
        <View style={{flex: 2, minHeight: 80}}></View>
        <ChartSection
          grahas={birthChart.leo.signs}
          rashi="Leo"
          style={{backgroundColor: 'sandybrown', flex: 1}}
        />
      </View>
      <View style={styles.bcr}>
        <ChartSection
          grahas={birthChart.sagittarius.signs}
          rashi="Sagittarius"
          style={{backgroundColor: 'gold', flex: 1}}
        />
        <ChartSection
          grahas={birthChart.scorpio.signs}
          rashi="Scorpio"
          style={{backgroundColor: 'darkcyan', flex: 1}}
        />
        <ChartSection
          grahas={birthChart.libra.signs}
          rashi="Libra"
          style={{backgroundColor: 'dodgerblue', flex: 1}}
        />
        <ChartSection
          grahas={birthChart.virgo.signs}
          rashi="Virgo"
          style={{backgroundColor: 'fuchsia', flex: 1}}
        />
      </View>
    </>
  );
}

export default function ({navigation, route}) {
  const {dateString, timeString, lat, lng, timezone} = route.params;
  const [loading, setLoading] = useState(false);
  const [birthChart, setBirthChart] = useState(null);
  const [navamsaChart, setNavamsaChart] = useState(null);
  const [nakshatra, setNakshatra] = useState(null);
  const [rashi, setRashi] = useState(null);
  const [houses, setHouses] = useState(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
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
            setReady(true);
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
                      setReady(true);
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
      <Text>Birth Chart</Text>
      {/* <ActivityIndicator
        animating={true}
        size="large"
        style={{
          opacity: loading ? 1 : 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      /> */}
      {!loading && ready && <ChartView birthChart={birthChart} />}
      <Text>Navamsa Chart</Text>
      {!loading && ready && <ChartView birthChart={navamsaChart} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bcr: {
    display: 'flex',
    flexDirection: 'row',
  },
});
