import React from "react";
import PlacesAutocomplete from "react-places-autocomplete";

//React Places Autocomplete = https://github.com/hibiken/react-places-autocomplete

export default function LocationSearch({
  address,
  setAddress,
  coordinates,
  handleSelect,
}) {
  return (
    <>
      {coordinates ? (
        <div>
          <p>lat: {coordinates.lat}</p>
          <p>long: {coordinates.lng}</p>
          <p>Address: {address}</p>
        </div>
      ) : null}

      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    key={suggestion.description}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </>
  );
}
