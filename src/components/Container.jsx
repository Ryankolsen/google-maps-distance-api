import React, { useEffect, useState } from "react";
import LocationSearch from "./LocationSearch";
import scriptLoader from "react-async-script-loader";
import { Card, Button } from "react-bootstrap";
import { CalculateDistance } from "./CalculateDistance";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
export const LOCAL_STORAGE_KEY = "distanceApp.storage";

const Container = ({ isScriptLoaded, isScriptLoadSucceed }) => {
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");

  const [startCoordinates, setStartCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [endCoordinates, setEndCoordinates] = useState({
    lat: null,
    lng: null,
  });

  //"State to manage saved trips"
  const [savedTrips, setSavedTrips] = useState([]);
  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    if (storedTrips) {
      setSavedTrips(storedTrips);
    }
  }, []);

  const handleSelectStart = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);

    setStartAddress(value);
    setStartCoordinates(ll);
  };
  const handleSelectEnd = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);

    setEndAddress(value);
    setEndCoordinates(ll);
  };

  if (isScriptLoaded && isScriptLoadSucceed) {
    return (
      <div>
        <Card style={{ width: "50%" }}>
          <Card.Title>Calculate Distance With Google!</Card.Title>
          <Card.Body>
            {/* Start Search */}
            <LocationSearch
              handleSelect={handleSelectStart}
              address={startAddress}
              setAddress={setStartAddress}
              coordinates={startCoordinates}
              setCoordinates={setStartCoordinates}
            />
          </Card.Body>
          <Card.Body>
            {/* Destination Search */}
            <LocationSearch
              handleSelect={handleSelectEnd}
              address={endAddress}
              setAddress={setEndAddress}
              coordinates={endCoordinates}
              setCoordinates={setEndCoordinates}
            />
          </Card.Body>
          <Button variant="primary">Calculate</Button>
        </Card>
        {startCoordinates.lat && endCoordinates.lat ? (
          <CalculateDistance
            savedTrips={savedTrips}
            setSavedTrips={setSavedTrips}
            originLat={startCoordinates.lat}
            originLng={startCoordinates.lng}
            destLat={endCoordinates.lat}
            destLng={endCoordinates.lng}
          />
        ) : null}

        {/* Diaplay trips saved to localStorage */}
        <div>
          <h2>Saved Trips</h2>
          <div>
            {savedTrips.map((trip) => {
              return (
                <div key={trip.id}>
                  <p>name: {trip.name.name}</p>
                  <p>Distance: {trip.distance}</p>
                  <p>Travel Time: {trip.distance}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  return <div>Loading...</div>;
};
export default scriptLoader([
  `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`,
])(Container);
