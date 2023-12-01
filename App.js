import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
import StoreListScreen from './src/screens/StoreListScreen';
import SelectStoreScreen from './src/screens/SelectStoreScreen';

const Stack = createNativeStackNavigator();

function App({ props }) {
  const [, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);

    });
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SelectStore" component={SelectStoreScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StoreList" component={StoreListScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
