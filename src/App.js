import React, { useState, useEffect } from 'react';
import "./App.css";

function LocationSelector() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [locationMessage, setLocationMessage] = useState(null);

  // Fetch all countries on initial render
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch('https://crio-location-selector.onrender.com/countries');
        if (!response.ok) throw new Error('Error fetching countries');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error:', error);
        setCountries([{ country: "Error fetching data" }]);
      }
    }
    fetchCountries();
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    async function fetchStates() {
      if (selectedCountry) {
        try {
          const response = await fetch(
            `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
          );
          if (!response.ok) throw new Error('Error fetching states');
          const data = await response.json();
          setStates(data);
          setCities([]);
          setSelectedState('');
        } catch (error) {
          console.error('Error:', error);
          setStates([{ state: "Error fetching data" }]);
        }
      }
    }
    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    async function fetchCities() {
      if (selectedCountry && selectedState) {
        try {
          const response = await fetch(
            `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
          );
          if (!response.ok) throw new Error('Error fetching cities');
          const data = await response.json();
          setCities(data);
        } catch (error) {
          console.error('Error:', error);
          setCities([{ city: "Error fetching data" }]);
        }
      }
    }
    fetchCities();
  }, [selectedCountry, selectedState]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedState('');
    setSelectedCity('');
    setLocationMessage(null);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
    setLocationMessage(null);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setLocationMessage({
      city: e.target.value,
      state: selectedState,
      country: selectedCountry,
    });
  };

  return (
    <div className="container">
      <h2>Select Location</h2>
      <div className="inputContainer">
        <div className="country">
          <select value={selectedCountry} onChange={handleCountryChange}>
            <option value="">Select Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div className="state_city">
          <div className="state">
            <select
              value={selectedState}
              onChange={handleStateChange}
              disabled={!selectedCountry}
            >
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="city">
            <select
              value={selectedCity}
              onChange={handleCityChange}
              disabled={!selectedState}
            >
              <option value="">Select City</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Display selected location message */}
      {locationMessage && (
        <div className="locationMessage">
          <p>
            You selected <strong>{locationMessage.city}</strong>, {locationMessage.state}, {locationMessage.country}
          </p>
        </div>
      )}
    </div>
  );
}

export default LocationSelector;
