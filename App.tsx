import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Text} from 'react-native';
import {oulunPysakointiApi}  from './src/apicalls/oulunPysakointiApi';
import { Marker } from 'react-native-maps';
import { ParkingSpot } from './src/types/parkingSpot';

export default function App() {

  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await oulunPysakointiApi.fetchParkingSpots();
        console.log('Parking data:', data);
        setParkingSpots(data);
      } catch (error) {
        console.error('Error fetching parking data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchUpdatedData = async (id: number) => {
    try {
      const data = await oulunPysakointiApi.fetchParkingSpotById(id);
      console.log('Updated parking spot data:', data);
      if (data) {
        setParkingSpots((prevSpots) =>
          prevSpots.map((spot) =>
            spot.carParkId === id ? { ...spot, ...data } : spot
          )
        );
      }
    } catch (error) {
      console.error('Error fetching updated parking spot data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView initialRegion={{
          latitude: 65.0121,
          longitude: 25.4651,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }} style={styles.map}>
        {parkingSpots.map((spot, index) => (
          <Marker
            key={spot.name + index}
            coordinate={{ latitude: spot.lat, longitude: spot.lon }}
            title={spot.name}
            onPress={() => spot.spacesAvailable !== null && fetchUpdatedData(spot.carParkId)}
            description={`Available spaces: ${spot.spacesAvailable}${spot.maxCapacity ? ` / ${spot.maxCapacity}` : ''}`}
            />
          
          
        ))

        }
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
 
});
