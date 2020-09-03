import React from 'react';
import {FlatList, Text, TouchableOpacity} from 'react-native';

const allTheCities = require('all-the-cities');

export default function ({name, onPress, listStyle, style}) {
  return (
    <FlatList
      data={allTheCities.filter((city) => city.name.match(name))}
      style={{...listStyle}}
      renderItem={({item}) => {
        return (
          <TouchableOpacity
            style={[style]}
            onPress={() => {
              onPress(item.loc.coordinates);
            }}>
            <Text>
              {item.name}, {item.country}
            </Text>
          </TouchableOpacity>
        );
      }}
      keyExtractor={({item}) => item.cityId}
    />
  );
}
