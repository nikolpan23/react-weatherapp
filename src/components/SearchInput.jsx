import { useState } from "react";
import searchicon from "../images/searchicon.png";

const SearchInput = ({ onSearch, getLocations }) => {
  const [locationText, setLocationText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = async (event) => {
    const text = event.target.value;
    setLocationText(text);

    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setSuggestions(await getLocations(text));
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    }
  };

  const submit = () => {
    setSuggestions([]);
    onSearch(locationText);
  };

  return (
    <div className="searchSection">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter a location"
          value={locationText}
          onChange={handleChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
        />

        <img
          src={searchicon}
          className="search-icon"
          alt="search icon"
          onClick={submit}
        />

        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((place) => (
              <li key={`${place.name}-${place.lat}-${place.lon}`}>
                <button
                  type="button"
                  onClick={() => {
                    setLocationText(`${place.name}, ${place.country}`);
                    setSuggestions([]);
                    onSearch(place);
                  }}
                >
                  {place.name}, {place.country}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchInput;