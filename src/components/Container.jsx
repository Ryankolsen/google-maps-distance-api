import React, { useEffect, useState } from "react";
import LocationSearch from "./LocationSearch";
import scriptLoader from "react-async-script-loader"; //script is used to access environmental variable and load API KEY
import { Card, Button } from "react-bootstrap";
import { CalculateDistance } from "./CalculateDistance";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete"; //https://www.npmjs.com/package/react-places-autocomplete

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
        <div className="container__container">
          <Card>
            <Card.Title className="container__Card-title">
              <h2> Calculate Distance With Google!</h2>
            </Card.Title>
            <Card.Body className="container__body">
              {/* Start Search */}
              <h3>Starting Location</h3>
              <LocationSearch
                handleSelect={handleSelectStart}
                address={startAddress}
                setAddress={setStartAddress}
                coordinates={startCoordinates}
                setCoordinates={setStartCoordinates}
              />
            </Card.Body>

            <Card.Body className="container__body">
              {/* Destination Search */}
              <h3>Destination</h3>

              <LocationSearch
                handleSelect={handleSelectEnd}
                address={endAddress}
                setAddress={setEndAddress}
                coordinates={endCoordinates}
                setCoordinates={setEndCoordinates}
              />
            </Card.Body>
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

          {/* Display trips saved to localStorage */}
          <div>
            <h2 className="location-search-saved-trips__h2">Saved Trips</h2>
            {savedTrips.map((trip) => {
              return (
                <div
                  key={trip.id}
                  className="location-search-saved-trips-container"
                >
                  <p className="location-search-saved-trips__p-name">
                    {trip.name.name}
                  </p>
                  <p className="location-search-saved-trips__p">
                    Distance: {trip.distance}
                  </p>
                  <p className="location-search-saved-trips__p">
                    Travel Time: {trip.distance}
                  </p>
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
