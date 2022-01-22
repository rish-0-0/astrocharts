import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, SafeAreaView} from 'react-native';
import db from '../../config/mongodb';

function SavedCharts({navigation}) {
  const [charts, setCharts] = useState([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    db.find({})
      .sort({createdAt: -1})
      .exec((err, docs) => {
        setLoading(false);
        if (err) {
          setError('Error while fetching saved charts');
          return;
        }
        setCharts(docs);
        setError(null);
      });
  }, [shouldRefresh]);

  const goToCharts = (doc) => {
    navigation.navigate('Charts', doc);
  };
  const renderItem = ({item}) => {
    const {dateString, timeString, lat, lng, timezone} = item;
    return (
      <Text style={styles.itemContainer} onPress={() => goToCharts(item)}>
        <Text style={styles.item}>{dateString}</Text>
        <Text style={styles.item}>
          {timeString}
          {','} {timezone > 0 ? `+${timezone}` : `-${timezone}`}
        </Text>
        <Text style={styles.item}>
          {lat}, {lng}
        </Text>
      </Text>
    );
  };

  return (
    <SafeAreaView>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={charts}
        renderItem={renderItem}
        onRefresh={() => {
          setShouldRefresh(!shouldRefresh);
        }}
        refreshing={loading}
        style={styles.list}
        keyExtractor={(item) => item.dateString}
      />
    </SafeAreaView>
  );
}

export default SavedCharts;

const styles = StyleSheet.create({
  list: {
    // ...StyleSheet.absoluteFillObject,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  itemContainer: {
    marginBottom: 15,
    paddingHorizontal: 18,
  },
  item: {
    fontSize: 16,
    paddingTop: 4,
  },
});
