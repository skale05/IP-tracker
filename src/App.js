import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
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
        <MapContainer
          center={[ipInfo.latitude, ipInfo.longitude]}
          zoom={12}
          style={{ height: '600px', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[ipInfo.latitude, ipInfo.longitude]}>
            <Popup>
              <div>
                <h4>Your Location</h4>
                <p>IP Address: {ipInfo.ip}</p>
                <p>Location: {ipInfo.city}, {ipInfo.region}</p>
                <p>Country: {countryInfo?.name?.common}</p>
                {countryInfo && (
                  <img src={countryInfo.flags.svg} alt="Flag" className="flag" />
                )}
              </div>
              <div>
                <h4>Your Local Time</h4>
                <p>Date and Time: {DateTime.now().toLocaleString(DateTime.DATETIME_FULL)}</p>
                {ipInfo.timezone && (
                  <>
                    <h4>Time in {ipInfo.timezone}</h4>
                    <p>Date and Time: {DateTime.now().setZone(ipInfo.timezone).toLocaleString(DateTime.DATETIME_FULL)}</p>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default App;
