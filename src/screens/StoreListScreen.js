import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Back from 'react-native-vector-icons/Ionicons';
import ModalDropdown from 'react-native-modal-dropdown';
import database from '@react-native-firebase/database';
import { getDataFromStorage } from './utils/AsyncStorage';
const StoreListScreen = ({ navigation, route }) => {
  const [storeList, setStoreList] = useState([]);
  const [filteredStoreList, setFilteredStoreList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  useEffect(() => {
    getStoreList();
  },[]);

  const getStoreList = () => {
    getDataFromStorage('token')
      .then((uid) => {
        console.log('uid', uid);
        return database().ref(`storeList/${uid}`).once('value');
      })
      .then((snapshot) => {
        const data = snapshot.val();
        console.log(data);
        const dataArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setStoreList(dataArray);
        setFilteredStoreList(dataArray);
      })
      .catch((error) => {
        console.error('Error fetching store list:', error);
      });
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onNavigateStore(item.name, item.id)} style={styles.storeItem}>
      <View style={styles.storeContainer}>
        <Text style={styles.storeName}>{item.name}</Text>
        <Text style={styles.storeInfo}>{`Type: ${item.type || 'NA'}`}</Text>
        <Text style={styles.storeInfo}>{`Area: ${item.area || 'NA'}`}</Text>
        <Text style={styles.storeInfo}>{`Location: ${item.location || 'NA'}`}</Text>
        <Text style={styles.storeInfo}>{`Route: ${item.route || 'NA'}`}</Text>
      </View>
    </TouchableOpacity>
  );

  const onNavigateStore = (name, id) => {
    navigation.navigate('SelectStore', { storeName: name , index: id});
  };

  const handleSearch = (text) => {
    const filteredData = storeList.filter(
      (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.type.toLowerCase().includes(searchText.toLowerCase()) ||
      item.area.toLowerCase().includes(searchText.toLowerCase()) ||
      item.route.toLowerCase().includes(searchText.toLowerCase()) 
    );
    console.log(filteredData);
    if(text.trim()){
      setFilteredStoreList(filteredData);
    } else {
      setFilteredStoreList(storeList)
    }
    
  };

  const goBack = () => {
    navigation.goBack();
  };

  const onSearchText = (text) => {
    setSearchText(text)
    handleSearch(text)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <Back name="arrow-back-outline" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Your Stores</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, type, or area"
            value={searchText}
            onChangeText={(text) => onSearchText(text)}
            onSubmitEditing={()=> handleSearch()}
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch()}>
            <Icon name="search" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
          <FlatList
            data={filteredStoreList}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  storeContainer: {
    backgroundColor: 'powderblue',
    padding: 16,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 20
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold', 
    marginBottom: 5,
  },
  storeInfo: {
    fontSize: 14,
    fontWeight: 'bold', 
  },
  storeInfo: {
    fontSize: 16,
    color: '#000'
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  dropdownButtonText: {
    fontWeight: 'bold',
  },
  dropdownRow: {
    padding: 10,
  },
  dropdownRowText: {
    fontWeight: 'bold',
  },
});

export default StoreListScreen;
