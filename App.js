/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import Chart from './screens/Chart';
import ViewChart from './screens/Chart/ViewChart';
import SavedCharts from './screens/Chart/SavedCharts';

enableScreens();
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Birth Details" component={Chart} />
          <Stack.Screen name="Charts" component={ViewChart} />
          <Stack.Screen name="History" component={SavedCharts} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
