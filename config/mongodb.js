const DataStore = require('react-native-local-mongodb');
const db = new DataStore({
  timestampData: true,
});

export default db;
