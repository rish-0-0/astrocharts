import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Text,
  View,
  Dimensions,
  FlatList,
} from 'react-native';
import {PLANETS} from '../../config/constants';

const COLUMNS = [
  'Graha',
  'Nakshatra',
  'Nakshatra Pada',
  'Degrees',
  'Retrograde',
];

const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');

function ModalSection({onClose, signData: {rashi, grahas}}) {
  return (
    <View style={styles.container}>
      <Text style={styles.rashi}>{rashi}</Text>
      <View style={styles.tableWrapper}>
        <FlatList
          data={grahas}
          renderItem={({
            item: {
              graha,
              longitude,
              isRetrograde,
              nakshatra: {name, pada},
            },
          }) => (
            <View style={styles.table} key={String(longitude)}>
              <View style={styles.main}>
                {COLUMNS.map((e, i) => (
                  <Text
                    key={`${e}-${i}`}
                    style={{...styles.mainText, ...styles.columnNames}}>
                    {e}
                  </Text>
                ))}
              </View>
              <View style={styles.main}>
                <Text style={styles.mainText}>{PLANETS[graha]}</Text>
                <Text style={styles.mainText}>{name}</Text>
                <Text style={styles.mainText}>{pada}</Text>
                <Text style={styles.mainText}>
                  {Number(longitude).toPrecision(4)}
                </Text>
                <Text style={styles.mainText}>
                  {isRetrograde ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => String(item.longitude)}
        />
      </View>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.close}>
          <Text style={styles.closeText}>Close</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tableWrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    maxHeight: HEIGHT * 0.7,
  },
  table: {
    width: '100%',
    display: 'flex',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rashi: {
    textAlign: 'center',
    paddingVertical: 5,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 16,
  },
  main: {
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    // alignContent: 'space-between',
    flex: 1,
  },
  columnNames: {
    fontWeight: '600',
  },
  mainText: {
    // flex: 1,
    textAlign: 'center',
    paddingVertical: 2,
  },
  close: {
    paddingVertical: 10,
    marginHorizontal: WIDTH * 0.25,
    borderRadius: 4,
    borderColor: 'black',
    borderWidth: 1,
  },
  closeText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 14,
  },
});

export default ModalSection;
