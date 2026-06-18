import React, { useState, useMemo, useRef } from 'react';
import './background.css';
import './App.css';

// Core Skyscanner styling tokens
import '@skyscanner/backpack-web/bpk-stylesheets/base.css';
import '@skyscanner/backpack-web/bpk-stylesheets/font.css';

const AIRPORTS = [
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International Airport' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International Airport' },
  { code: 'BOM', city: 'Mumbai', name: 'Bombay International Airport' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International Airport' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport' },
];

const SPECIAL_FARES = [
  { id: 'regular', label: 'Regular', desc: 'Regular fares' },
  { id: 'student', label: 'Student', desc: 'Extra discounts/baggage' },
  { id: 'armed', label: 'Armed Forces', desc: 'Up to ₹600 off' },
  { id: 'gst', label: 'Have a GST number?', desc: 'Upto 10% Extra Savings!' },
  { id: 'senior', label: 'Senior Citizen', desc: 'Up to ₹600 off' },
  { id: 'doctor', label: 'Doctor and Nurses', desc: 'Upto ₹600 off' },
];

const BASE_FLIGHT_TEMPLATES = [
  { id: 'f1', airline: 'Indigo', departure: '06:00', arrival: '08:45', basePrice: 5200, duration: '2h 45m' },
  { id: 'f2', airline: 'Air India', departure: '09:15', arrival: '12:00', basePrice: 6100, duration: '2h 45m' },
  { id: 'f3', airline: 'Vistara', departure: '14:30', arrival: '17:20', basePrice: 7300, duration: '2h 50m' },
  { id: 'f4', airline: 'Akasa Air', departure: '18:45', arrival: '21:30', basePrice: 4800, duration: '2h 45m' },
  { id: 'f5', airline: 'SpiceJet', departure: '21:00', arrival: '23:55', basePrice: 4500, duration: '2h 55m' },
];

export default function App() {
  const today = new Date().toISOString().split('T')[0];
  const [tripType, setTripType] = useState('oneWay');
  const [fromAirport, setFromAirport] = useState('DEL');
  const [toAirport, setToAirport] = useState('BLR');
  const [departureDate, setDepartureDate] = useState('2026-06-20');
  const [returnDate, setReturnDate] = useState('2026-06-27');
  const [travelers, setTravelers] = useState(1);
  const [travelClass, setTravelClass] = useState('economy');
  const [selectedFare, setSelectedFare] = useState('regular');
  const [selectedFlight, setSelectedFlight] = useState(null);
  
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); 
  
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const resultsRef = useRef(null);
  const iconFontFix = { fontFamily: '"Font Awesome 6 Free", "Font Awesome 6 Brands"' };

  const availableFlights = useMemo(() => {
    if (fromAirport === toAirport) return [];

    return BASE_FLIGHT_TEMPLATES.map((flight) => {
      let finalPrice = flight.basePrice * travelers;

      if (travelClass === 'premium') finalPrice = Math.round(finalPrice * 1.35);
      if (travelClass === 'business') finalPrice = Math.round(finalPrice * 2.10);

      if (selectedFare === 'student') finalPrice = Math.round(finalPrice * 0.94);
      else if (selectedFare === 'gst') finalPrice = Math.round(finalPrice * 0.90);
      else if (['armed', 'senior', 'doctor'].includes(selectedFare)) {
        finalPrice = Math.max(2000, finalPrice - (600 * travelers));
      }

      return { ...flight, price: finalPrice };
    });
  }, [fromAirport, toAirport, departureDate, travelers, travelClass, selectedFare]);

  const getCityName = (code) => AIRPORTS.find(a => a.code === code)?.city || code;
  const getAirportFullName = (code) => AIRPORTS.find(a => a.code === code)?.name || '';

  const handleInputChange = (callback) => {
    setHasSearched(false);
    callback();
  };

  const handleSearch = () => {
    setSelectedFlight(null);
    setHasSearched(true);
    setShowResults(true);
    
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSwapAirports = () => {
    setHasSearched(false);
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  return (
    <div className="travel-page">
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <i className="fa-solid fa-plane-departure" style={{ color: '#0066ee', marginRight: '8px', ...iconFontFix }}></i>
            Skyscanner
          </div>
          <nav className="nav-tabs">
            <div className="nav-tab active">
              <i className="fa-solid fa-plane" style={iconFontFix}></i> Flights
            </div>
            <div className="nav-tab">
              <i className="fa-solid fa-hotel" style={iconFontFix}></i> Hotels
            </div>
            <div className="nav-tab">
              <i className="fa-solid fa-house-chimney" style={iconFontFix}></i> Villas
            </div>
            <div className="nav-tab">
              <i className="fa-solid fa-suitcase-rolling" style={iconFontFix}></i> Holidays
            </div>
            <div className="nav-tab">
              <i className="fa-solid fa-train" style={iconFontFix}></i> Trains
            </div>
            <div className="nav-tab">
              <i className="fa-solid fa-bus" style={iconFontFix}></i> Buses
            </div>
          </nav>
          <div className="header-right">
            <button className="google-login-btn">
              <i className="fa-brands fa-google google-icon" style={iconFontFix}></i>
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="search-container">
          <div className="trip-type-selector">
            {['oneWay', 'roundTrip', 'multiCity'].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  value={type}
                  checked={tripType === type}
                  onChange={(e) => handleInputChange(() => setTripType(e.target.value))}
                />
                {type === 'oneWay' ? 'One Way' : type === 'roundTrip' ? 'Round Trip' : 'Multi City'}
              </label>
            ))}
          </div>

          <div className="search-form-container">
            <div className="from-to-section">
              <div className="airport-selector">
                <label>From</label>
                <div className="airport-input" onClick={() => { setShowFromDropdown(!showFromDropdown); setShowToDropdown(false); }}>
                  <div className="airport-code">{fromAirport}</div>
                  <div className="airport-city">{getCityName(fromAirport)}</div>
                  <small style={{ fontSize: '0.75rem', color: '#888', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {getAirportFullName(fromAirport)}
                  </small>
                </div>
                {showFromDropdown && (
                  <div className="airport-menu">
                    {AIRPORTS.map((airport) => (
                      <div
                        key={airport.code}
                        className={`airport-option ${fromAirport === airport.code ? 'active' : ''}`}
                        onClick={() => handleInputChange(() => { setFromAirport(airport.code); setShowFromDropdown(false); })}
                      >
                        <strong>{airport.code}</strong> - {airport.city}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="swap-btn" onClick={handleSwapAirports}>⇄</div>

              <div className="airport-selector">
                <label>To</label>
                <div className="airport-input" onClick={() => { setShowToDropdown(!showToDropdown); setShowFromDropdown(false); }}>
                  <div className="airport-code">{toAirport}</div>
                  <div className="airport-city">{getCityName(toAirport)}</div>
                  <small style={{ fontSize: '0.75rem', color: '#888', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {getAirportFullName(toAirport)}
                  </small>
                </div>
                {showToDropdown && (
                  <div className="airport-menu">
                    {AIRPORTS.map((airport) => (
                      <div
                        key={airport.code}
                        className={`airport-option ${toAirport === airport.code ? 'active' : ''}`}
                        onClick={() => handleInputChange(() => { setToAirport(airport.code); setShowToDropdown(false); })}
                      >
                        <strong>{airport.code}</strong> - {airport.city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="date-traveler-section">
              <div className="form-group">
                <label>Departure</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => handleInputChange(() => setDepartureDate(e.target.value))}
                  min={today}
                  className="date-input-small"
                />
              </div>

              {tripType === 'roundTrip' && (
                <div className="form-group">
                  <label>Return</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => handleInputChange(() => setReturnDate(e.target.value))}
                    min={departureDate}
                    className="date-input-small"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Travellers & Class</label>
                <select
                  value={`${travelers}-${travelClass}`}
                  onChange={(e) => handleInputChange(() => {
                    const [t, c] = e.target.value.split('-');
                    setTravelers(parseInt(t));
                    setTravelClass(c);
                  })}
                  className="dropdown-small"
                >
                  <option value="1-economy">1 Traveller - Economy</option>
                  <option value="1-premium">1 Traveller - Premium Economy</option>
                  <option value="2-economy">2 Travellers - Economy</option>
                  <option value="2-business">2 Travellers - Business</option>
                  <option value="3-economy">3 Travellers - Economy</option>
                  <option value="4-economy">4 Travellers - Economy</option>
                </select>
              </div>
            </div>

            <div className="special-fares-section">
              <p className="special-label">SPECIAL FARES</p>
              <div className="fares-grid">
                {SPECIAL_FARES.map((fare) => (
                  <button
                    key={fare.id}
                    className={`fare-btn ${selectedFare === fare.id ? 'active' : ''}`}
                    onClick={() => handleInputChange(() => setSelectedFare(fare.id))}
                  >
                    <strong>{fare.label}</strong>
                    <span>{fare.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="additional-options">
              <label className="checkbox">
                <input type="checkbox" defaultChecked /> Add Price Drop Protection - If the price drops, we'll refund the difference. <a href="#">View Details</a>
              </label>
            </div>

            <button className="search-btn-large" onClick={handleSearch}>SEARCH</button>
          </div>
        </div>

        {showResults && hasSearched && (
          <div className="results-container" ref={resultsRef}>
            <div className="results-header">
              <h2>Available Flights</h2>
              <p>
                {fromAirport} → {toAirport} • {availableFlights.length} flights found for{' '}
                {new Date(departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="flights-results">
              {availableFlights.length > 0 ? (
                availableFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className={`result-card ${selectedFlight?.id === flight.id ? 'selected' : ''}`}
                    onClick={() => setSelectedFlight(flight)}
                  >
                    <div className="result-airline">
                      <strong>{flight.airline}</strong>
                    </div>
                    <div className="result-times">
                      <div>
                        <p className="time">{flight.departure}</p>
                        <p className="label">{fromAirport}</p>
                      </div>
                      <div className="flight-duration">
                        <p>{flight.duration}</p>
                      </div>
                      <div>
                        <p className="time">{flight.arrival}</p>
                        <p className="label">{toAirport}</p>
                      </div>
                    </div>
                    <div className="result-price">
                      <p className="price">₹{flight.price.toLocaleString('en-IN')}</p>
                      <button className="book-btn">Select</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px', color: '#ea4335', ...iconFontFix }}></i>
                  Invalid Route selected. You cannot fly from and to the same airport ({fromAirport}).
                </div>
              )}
            </div>

            {selectedFlight && (
              <div className="booking-summary">
                <p>
                  <i className="fa-solid fa-circle-check" style={{ color: '#34a853', marginRight: '8px', ...iconFontFix }}></i>
                  Selected Route: <strong>{selectedFlight.airline}</strong> ({selectedFlight.departure} - {selectedFlight.arrival})
                </p>
                <button className="continue-btn">Continue to Booking</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}