import {AsyncStorage} from '@react-native-community/async-storage';

const DataStore = require('react-native-local-mongodb');
const db = new DataStore({
  timestampData: true,
  autoload: true,
  storage: AsyncStorage,
  filename: 'charts_data',
});

export default db;
