import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Clinic } from "../types";

export function ClinicMap({ clinic }: { clinic: Clinic }) {
  return (
    <View style={styles.frame}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude: clinic.latitude, longitude: clinic.longitude, latitudeDelta: 0.012, longitudeDelta: 0.012 }}
        accessibilityLabel={`Map showing ${clinic.name}`}
      >
        <Marker coordinate={{ latitude: clinic.latitude, longitude: clinic.longitude }} title={clinic.name} description={clinic.address} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({ frame: { height: 220, overflow: "hidden", borderRadius: 16 } });
