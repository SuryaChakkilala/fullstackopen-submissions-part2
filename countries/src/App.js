import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios'

const ShowCountry = ({ country }) => {
  const [s, setS] = useState(false);

  const clickHandler = () => {
    setS(!s);
  };

  return (
    <div>
      {country.name}
      <button onClick={clickHandler}>{s ? "hide" : "show"}</button>
      {s ? <Country country={country}/> : null}
    </div>
  );
};


const Country = ({ country }) => {
  const [w, setW] = useState({});
  const API_KEY = "e33e156346e335e7ced5bd4b763e48fb";
  useEffect(() => {
    axios.get(
        `https://crossorigin.me/
         https://api.apixu.com/v1/current.json?key=${API_KEY}&q=${country.capital}`
      ).then(({ data }) => {
        const current = data.current;
        setW({
          temperature: current.temp_c,
          image: current.condition.icon,
          wind: `${current.wind_kph} kph direction ${current.wind_dir}`
        });
      });
  });
  
  return (
    <div>
      <h1>{country.name}</h1>
      <div>CAPITAL {country.capital}</div>
      <div>POPULATION {country.population}</div>
      <h2>LANGUAGES IN THE COUNTRY</h2>
      <ul>
        {country.languages.map(({ name }) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <img src={country.flag} width="150" height="100" />
      <h2>Weather in Capital ({country.capital})</h2>
      <b>Temperature :</b> {w.temperature} Degrees Celsius<br/>
      <img src={w.image} /><br/>
      <b>Wind :</b> {w.wind}
    </div>
  );
};

const CountryList = ({ cont }) => {
  if (cont.length === 0) {
    return <div>No Matches</div>;
  } 
  else if (cont.length > 10) {
    return <div>Many matches</div>;
  } else if (cont.length > 1) {
    return (
      <div>
        {cont.map(country => (
          <ShowCountry key={country.name} country={country} />
        ))}
      </div>
    );
  } else {
    return <Country country={cont[0]} />;
  }
};

function App() {
  const [s, setS] = useState("");
  const [c, setC] = useState([]);

  const searchCountries = input => {
    axios.get(`https://restcountries.eu/rest/v2/name/${input}`).then(response => {
        setC(response.data);
      }).catch(error => {
        setC([]);
      });
  };
  const searchHandle = (event) => {
    setS(event.target.value);
    searchCountries(event.target.value);
  };

  return (
    <div>
      Search for countries: <input value={s} onChange={searchHandle} />
      <CountryList cont={c} />
    </div>
  );
}

export default App;
