import React, { useEffect, useState } from 'react';
import { DateTime } from "luxon";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import iconUrl from 'leaflet/dist/images/marker-icon.png';



import 'leaflet/dist/leaflet.css';
import './App.css';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

function App() {
  const [ipInfo, setIpInfo] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => {
        const ipAddress = data.ip;
        fetch(`https://ipapi.co/${ipAddress}/json/`)
          .then((response) => response.json())
          .then((data) => setIpInfo(data))
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (ipInfo && ipInfo.country_name) {
      axios
        .get(`https://restcountries.com/v3.1/name/${ipInfo.country_name}`)
        .then((response) => setCountryInfo(response.data[0]))
        .catch((error) => console.log(error));
    }
  }, [ipInfo]);

const defaultIcon = L.icon({
  iconUrl: iconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;


return (
  <div className="App">
    <h1>What is my IP</h1>
    {ipInfo && (
      <div>
        <h2>Your IP Address: {ipInfo.ip}</h2>
        {countryInfo && (
          <div>
            <h3>Country: {countryInfo.name.common}</h3>
            <img src={countryInfo.flags.svg} alt="Flag" className="flag" />
            {/* <p>Capital: {countryInfo.capital}</p>
            <p>Population: {countryInfo.population}</p>
            <p>Area: {countryInfo.area} km²</p>
            <p>Languages: {Object.values(countryInfo.languages).join(", ")}</p> */}
          </div>
        )}
        <MapContainer
          center={[ipInfo.latitude, ipInfo.longitude]}
          zoom={6}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[ipInfo.latitude, ipInfo.longitude]}>
            <Popup>Your Location</Popup>
          </Marker>
        </MapContainer>

        <div>
          <h3>Your Local Time</h3>
          <p>Date and Time: {DateTime.now().toLocaleString(DateTime.DATETIME_FULL)}</p>
          <p>Timezone: {DateTime.now().zoneName}</p>
        </div>

        {ipInfo.timezone && (
          <div>
            <h3>Time in {ipInfo.timezone}</h3>
            <p>Date and Time: {DateTime.now().setZone(ipInfo.timezone).toLocaleString(DateTime.DATETIME_FULL)}</p>
          </div>
        )}
      </div>
    )}
  </div>
);
        }
export default App;
