import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';

export default function ({title, onPress}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 14,
    color: 'white',
    lineHeight: 16,
  },
  container: {
    backgroundColor: 'black',
    padding: 10,
    paddingVertical: 16,
    borderRadius: 12,
    width: '80%',
    marginHorizontal: '10%',
    marginVertical: '5%',
  },
});
