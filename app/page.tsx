'use client';

import { useEffect, useState } from 'react';
import { WeatherForecast } from './types';  
import Footer from './Footer'; 

const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error)
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};


const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const WeatherPage = () => {
  const [forecastData, setForecastData] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const { latitude, longitude } = await getUserLocation();

        const forecastResponse = await fetch(
          `http://localhost:8080/api/weather/forecast?latitude=${latitude}&longitude=${longitude}`
        );
        const forecastData = await forecastResponse.json();

        const summaryResponse = await fetch(
          `http://localhost:8080/api/weather/summary?latitude=${latitude}&longitude=${longitude}`
        );
        const summaryData = await summaryResponse.json();

        setForecastData({
          ...forecastData,
          summary: summaryData.summary,
          averagePressure: summaryData.averagePressure,
          sunshineDuration: [summaryData.averageSunshine], 
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!forecastData) return <div>Brak danych pogodowych</div>;

  return (
    <div>
      <h1><strong>Prognoza Pogody:</strong></h1>
      <table>
        <thead>
          <tr>
            <td>Data: </td>
            {forecastData.time?.map((date, index) => (
              <th style={{ padding: 10 }} key={index}>{formatDate(date)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Maksymalna temperatura: </td>
            {forecastData.temperature_2m_max?.map((tempMax, index) => (
              <td style={{ padding: 10 }} key={index}>{tempMax}°C</td>
            ))}
          </tr>
          <tr>
            <td>Minimalna temperatura: </td>
            {forecastData.temperature_2m_min?.map((tempMin, index) => (
              <td style={{ padding: 10 }} key={index}>{tempMin}°C</td>
            ))}
          </tr>
          <tr>
            <td>Wizualne przedstawienie: </td>
            {forecastData.weatherCode?.map((weatherCode, index) => (
              <td style={{ padding: 10 }} key={index}>
                <i className={`fa-solid ${getWeatherIconClass(weatherCode)}`} />
              </td>
            ))}
          </tr>
          <tr>
            <td>Szacowana energia: </td>
            {forecastData.generatedEnergy?.map((energy, index) => (
              <td style={{ padding: 10 }} key={index}>{energy} kWh</td>
            ))}
          </tr>
        </tbody>
      </table>
      
      <Footer forecastData={forecastData} />
    </div>
  );
};

const getWeatherIconClass = (weatherCode: number) => {
  switch (weatherCode) {
    case 71:
      return 'fa-sun';
    case 3:
      return 'fa-cloud';
    default:
      return 'fa-question'; 
  }
};

export default WeatherPage;
