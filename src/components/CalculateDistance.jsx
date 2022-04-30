import React, { useState, useEffect } from "react";
import { DistanceMatrixService } from "@react-google-maps/api";
import uuid from "react-uuid";

//Calculates the distance for any trip using google api:
//https://github.com/ecteodoro/google-distance-matrix
// import LOCAL_STORAGE_KEY from "./Container";

export const CalculateDistance = (props) => {
  const { savedTrips, setSavedTrips, originLat, originLng, destLat, destLng } =
    props;
  const [currDistance, setCurrDistance] = useState("");
  const [currTravelTime, setCurrTrevelTime] = useState("");
  const [tripName, setTripName] = useState("");

  const LOCAL_STORAGE_KEY = "distanceApp.storage";

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    if (storedTrips) {
      setSavedTrips(storedTrips);
    }
  }, [setSavedTrips]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedTrips));
  }, [savedTrips]);

  function handleChange(name) {
    setTripName(name);
  }

  function handleClick(e) {
    e.preventDefault();
    const oldTrips = savedTrips;
    setSavedTrips([
      ...oldTrips,
      {
        id: uuid(),
        distance: currDistance,
        travelTime: currTravelTime,
        name: tripName,
      },
    ]);
    setTripName("");
  }

  return (
    <div>
      {originLat ? (
        //Use Google Distance Matrix Service to return distance and drive time
        <DistanceMatrixService
          options={{
            origins: [{ lat: originLat, lng: originLng }],
            destinations: [{ lat: destLat, lng: destLng }],
            travelMode: "DRIVING",
          }}
          callback={(res) => {
            // console.log("RESPONSE", res.rows[0].elements[0]);
            setCurrDistance(res.rows[0].elements[0].distance.text);
            setCurrTrevelTime(res.rows[0].elements[0].duration.text);
          }}
        />
      ) : null}

      <div>Distance: {currDistance}</div>
      <div>Travel Time: {currTravelTime}</div>

      <div>
        <form>
          <p>
            <label htmlFor="trip-name">Trip Name</label>
          </p>
          <input
            onChange={(e) => handleChange({ name: e.target.value.toString() })}
            id="trip-name"
          ></input>
          <button onClick={(e) => handleClick(e)}>Add Trip</button>
        </form>
      </div>
    </div>
  );
};
