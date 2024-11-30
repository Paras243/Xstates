import { useEffect, useState } from 'react'

function App() {
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const getCountry = async() => {
    try {
      const data = await fetch("https://crio-location-selector.onrender.com/countries");
      const dataJson = await data.json();
      setCountries(dataJson);
    } catch (err) {
      console.error("Error fetching countries: ", err);
    }
  }

  const getState = async() => {
    try {
        const data = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`);
        const dataJson = await data.json();
        setStates(dataJson);
    } catch (err) {
      console.error("Error fetching state: ", err)
    }
  }

  const getCity = async() => {
    try {
      const data = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`);
      const dataJson =  await data.json();
      setCities(dataJson);    
    } catch (err) {
      console.error("Error fetching city: ", err)
    }
  }
  useEffect(() => {
    getCountry()
  }, [countries])

  useEffect(() => {
    if(selectedCountry){ 
      getState()
    }
  }, [selectedCountry]);

  useEffect(() => {
    if(selectedCountry && selectedState){
      getCity()
    }
  }, [selectedState])

  return (
    <>
      <div className='city-selector'>
          <h1>Select Location</h1>
          <div className='dropdowns'>
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className='select'
            >
              <option value="" disabled>Select Country</option>
              {countries.map((country) => <option key={country} value={country}>
              {country}
              </option>)}
            </select>
            
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className='select'
              disabled={!selectedCountry}
            >
              <option value="" >Select State</option>
              {states.map((state) => <option key={state} value={state}>
              {state}
              </option>)}
            </select>
           
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className='select'
              disabled={!selectedState}
            >
              <option value="" >Select City</option>
              {cities.map((city) => <option key={city} value={city}>
              {city}
              </option>)}
            </select>
          </div>
          {selectedCity && 
            <h2 className='text'>
              You selected <span className='highlight'>{selectedCity}</span>,
              <span className='fade'>{" "}{selectedState}, {selectedCountry}
              </span>
            </h2>}
      </div>
    </>
  )
}
 
export default App