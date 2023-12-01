import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get data from AsyncStorage
export const getDataFromStorage = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data !== null) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error getting data from AsyncStorage:', error);
    return null;
  }
};

// Function to save data to AsyncStorage
export const saveDataToStorage = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log('Data saved to AsyncStorage successfully.');
  } catch (error) {
    console.error('Error saving data to AsyncStorage:', error);
  }
};

 export const deleteItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Item with key ${key} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting item with key ${key}:`, error);
  }
};