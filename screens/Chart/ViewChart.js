/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import db from '../../config/mongodb';
import API from '../../config/axios';
import ChartSection from '../../components/ChartSection';
import {RASHIS} from '../../config/constants';

function ChartView({birthChart}) {
  return (
    <>
      <View style={styles.bcr}>
        <ChartSection
          grahas={birthChart.pisces.signs}
          rashi="Pisces"
          onPress={() => {}}
          style={{backgroundColor: 'turquoise', flex: 1}}
        />
        <ChartSection
          grahas={birthChart.aries.signs}
          rashi="Aries"
          style={{backgroundColor: 'lightcoral', flex: 1}}
        />
        <ChartSection
          grahas={birthChart.taurus.signs}
          rashi="Taurus"
          style={{backgroundColor: 'gold', flex: 1}}
        />
        <ChartSection
          grahas={birthChart.gemini.signs}
          rashi="Gemini"
          style={{backgroundColor: 'yellow', flex: 1}}
        />
      </View>
      <View style={styles.bcr}>
        <ChartSection
          grahas={birthChart.aquarius.signs}
          rashi="Aquarius"
          style={{backgroundColor: 'aqua', flex: 1}}
        />
        <View style={{flex: 2, minHeight: 80}}>
          <Text style={styles.inchartheading}>Chart Rashi</Text>
          <Text style={styles.inchart}>{RASHIS[birthChart.meta.Mo.rashi]}</Text>
        </View>
        <ChartSection
          grahas={birthChart.cancer.signs}
          rashi="Cancer"
          style={{backgroundColor: 'lightgreen', flex: 1}}
        />
      </View>
      <View style={styles.bcr}>
        <ChartSection
          grahas={birthChart.capricorn.signs}
          rashi="Capricorn"
          style={{backgroundColor: 'mediumslateblue', flex: 1}}
        />
        <View style={{flex: 2, minHeight: 80}}>
          <Text style={styles.inchartheading}>Chart Nakshatra</Text>
          <Text style={styles.inchart}>
            {birthChart.meta.Mo.nakshatra.name}
          </Text>
        </View>
        <ChartSection
          grahas={birthChart.leo.signs}
          rashi="Leo"
          style={{backgroundColor: 'coral', flex: 1}}
        />
      </View>
      <View style={styles.bcr}>
        <ChartSection
          grahas={birthChart.sagittarius.signs}
          rashi="Sagittarius"
          style={{backgroundColor: 'orangered', flex: 1}}
        />
        <ChartSection
          grahas={birthChart.scorpio.signs}
          rashi="Scorpio"
          style={{backgroundColor: 'greenyellow', flex: 1}}
        />
        <ChartSection
          grahas={birthChart.libra.signs}
          rashi="Libra"
          style={{backgroundColor: 'lightskyblue', flex: 1}}
        />
        <ChartSection
          grahas={birthChart.virgo.signs}
          rashi="Virgo"
          style={{backgroundColor: 'plum', flex: 1}}
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
            const {
              birthChart: birth,
              navamsa,
              housesCached,
              nakshatra,
            } = docs[0];
            setBirthChart(birth);
            setNakshatra(nakshatra);
            setHouses(housesCached);
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
    console.log(JSON.stringify(nakshatra, null, 4));
    console.log(JSON.stringify(houses, null, 4));
    console.log(JSON.stringify(birthChart, null, 4));
  }, [birthChart, navamsaChart, houses, nakshatra]);
  return (
    <ScrollView>
      <Text style={styles.headings}>Birth Chart</Text>
      {loading && <Text style={styles.loading}>Calculating...</Text>}
      {!loading && ready && <ChartView birthChart={birthChart} />}
      <Text style={styles.headings}>Navamsa Chart</Text>
      {loading && <Text style={styles.loading}>Calculating...</Text>}
      {!loading && ready && <ChartView birthChart={navamsaChart} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bcr: {
    display: 'flex',
    flexDirection: 'row',
  },
  headings: {
    textAlign: 'center',
    padding: 18,
    fontSize: 24,
    lineHeight: 24,
    textTransform: 'uppercase',
    letterSpacing: 3.5,
  },
  inchart: {
    textTransform: 'capitalize',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  inchartheading: {
    textAlign: 'center',
    padding: 4,
    lineHeight: 18,
    fontSize: 16,
    letterSpacing: 1.5,
  },
  loading: {
    textAlign: 'center',
    padding: 18,
    fontSize: 18,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 3.5,
  },
});
