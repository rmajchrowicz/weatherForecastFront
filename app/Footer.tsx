import { WeatherForecast } from './types';

interface FooterProps {
  forecastData: WeatherForecast | null;
}

const Footer = ({ forecastData }: FooterProps) => {
  if (!forecastData) return null; 

  const minTemperature = Math.min(...forecastData.temperature_2m_min);
  const maxTemperature = Math.max(...forecastData.temperature_2m_max);
  const averagePressure = forecastData.averagePressure;
  const averageSunshineDuration =
    forecastData.sunshineDuration.reduce((acc, duration) => acc + duration, 0) / forecastData.sunshineDuration.length;

  return (
    <footer className="mt-8 p-4 border-t border-gray-200">
      <div className="text-lg font-semibold">Podsumowanie prognozy na tydzień:</div>
      <div className="mt-2">
        <p><strong>Skrajna temperatura w tygodniu:</strong> {minTemperature}°C / {maxTemperature}°C</p>
        <p><strong>Średnie ciśnienie w tygodniu:</strong> {averagePressure} Dane odnośnie cisnienia nie są dostępne dla prognozy.</p>
        <p><strong>Średni czas ekspozycji na słońce:</strong> {Math.round(averageSunshineDuration / 60)} minut</p>
        <p><strong>Podsumowanie:</strong> {forecastData.summary}</p>
      </div>
    </footer>
  );
};

export default Footer;
