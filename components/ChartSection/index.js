import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

export default function ({style, onPress, grahas, rashi, ...rest}) {
  return (
    <TouchableOpacity
      style={{...style, minHeight: rest.height || 80}}
      onPress={onPress}>
      <View
        style={{...styles.container, backgroundColor: style.backgroundColor}}>
        <Text style={styles.label}>{rashi}</Text>
        <View style={{...styles.flexContainer}}>
          {Array.isArray(grahas) &&
            grahas.map(({graha}) => (
              <View style={styles.flexItem}>
                <Text style={styles.flexItemContent}>{graha}</Text>
              </View>
            ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    width: '100%',
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  flexItem: {
    flex: 1,
  },
  flexItemContent: {
    textAlign: 'center',
  },
});
