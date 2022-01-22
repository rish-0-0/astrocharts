import React, {useEffect, useState} from 'react';
import db from '../../config/mongodb';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';

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
      });
  }, [shouldRefresh]);

  const goToCharts = (doc) => {
    navigation.navigate('Charts', doc);
  };
  const renderItem = ({item}) => {
    const {dateString, timeString, lat, lng, timezone} = item;
    return (
      <Text style={styles.itemContainer} onPress={() => goToCharts(item)}>
        <Text style={styles.item}>
          {dateString}
          {'\n'}
          {timeString}
          {'\t'}
          {timezone}
          {'\n'}
          {lat}
          {'\t'}
          {lng}
        </Text>
      </Text>
    );
  };

  if (error) {
    return (
      <SafeAreaView>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView>
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        data={charts}
        renderItem={renderItem}
        onRefresh={() => {
          setShouldRefresh(!shouldRefresh);
        }}
        style={styles.list}
        keyExtractor={(item) => item.timeString}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    ...StyleSheet.absoluteFillObject,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  itemContainer: {
    marginVertical: 5,
  },
  item: {},
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default SavedCharts;
