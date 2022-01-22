import {AsyncStorage} from 'react-native';

const DataStore = require('react-native-local-mongodb');
const db = new DataStore({
  timestampData: true,
  storage: AsyncStorage,
  filename: 'asyncStorageKey',
  autoload: true,
});

export default db;
