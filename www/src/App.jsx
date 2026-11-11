import { useState } from 'react'
import { getSunsetEpoch, getSunsetAsDate } from './solar'

function App() {
  const [is18Holes, setIs18Holes] = useState(true)
  const [hours, setHours] = useState(4)
  const [minutes, setMinutes] = useState(0)

  let lat = 51.33162308491946; // Fallback on lat of Cuddington GC
  let lon = -0.21451649021796887; // Fallback on lon of Cuddington GC
  let elev = 85.; // fallback on elev to cuddington GC
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    if ( 'latitude' in coords
      && 'longitude' in coords) {
      lat = coords.latitude;
      lon = coords.longitude;
    }
    if ( 'altitude' in coords ) {
      elev = coords.altitude;
    }
  });
const JD_UNIX_EPOCH = 2440587.5
  const sunsetEpoch = (getSunsetEpoch(lat, lon, elev) - JD_UNIX_EPOCH) * 86400000
  const civilTwilightEpoch = (getSunsetEpoch(lat, lon, elev, new Date(), -6.0) - JD_UNIX_EPOCH) * 86400000

  const starttime = new Date(
    civilTwilightEpoch
    - (minutes * 60 * 1000)
    - (hours * 60 * 60 * 1000)
  );
  const teetime = `${starttime.toTimeString().substring(0,5)}`;
  const sunsetTime = new Date(sunsetEpoch).toTimeString().substring(0, 5);
  const civilTwilightTime = new Date(civilTwilightEpoch).toTimeString().substring(0, 5);

  const handleHolesChange = () => {
    if (is18Holes) {
      setMinutes(Math.ceil(minutes/(2*5))*5);
      setHours(hours/2);
    } else {
      setMinutes(minutes*2);
      setHours(hours*2);
    }
    setIs18Holes(!is18Holes);
  }

  const handleHoursChange = (evt) => {
    const value = Math.max(0, Math.min(24, evt.target.value));
    setHours(value);
  }

  const handleMinutesChange = (evt) => {
    let value = evt.target.value;
    if (value > 55) {
      value = 0;
    } else if (value < 0) {
      value = 55;
    }
    setMinutes(value);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-200">
          {/* Header with Golf Flag Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Can You Get a Round in?</h1>
          </div>

          {/* Duration Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How long is your round?
              </label>

              {/* Holes Slider */}
              <div className="mb-4">
                <div className="relative bg-gray-200 rounded-full p-1 flex items-center">
                  {/* Sliding Background */}
                  <div
                    className={`absolute top-1 bottom-1 w-1/2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-md transition-all duration-300 ease-in-out ${
                      is18Holes ? 'translate-x-full' : 'translate-x-0'
                    }`}
                  />

                  {/* Buttons */}
                  <button
                    onClick={() => handleHolesChange()}
                    className={`relative z-10 flex-1 py-2 px-4 rounded-full font-semibold transition-colors duration-300 ${
                      is18Holes ? 'text-gray-600' : 'text-white'
                    }`}
                  >
                    9 Holes
                  </button>
                  <button
                    onClick={() => handleHolesChange()}
                    className={`relative z-10 flex-1 py-2 px-4 rounded-full font-semibold transition-colors duration-300 ${
                      is18Holes ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    18 Holes
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Hours Input */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={hours}
                      onChange={handleHoursChange}
                      className="w-full px-4 py-3 text-2xl font-semibold text-center border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-green-50"
                    />
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-700">
                      hours
                    </span>
                  </div>
                </div>

                {/* Separator */}
                <div className="text-3xl font-bold text-gray-400">:</div>

                {/* Minutes Input */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="number"
                      step="5"
                      value={minutes}
                      onChange={handleMinutesChange}
                      className="w-full px-4 py-3 text-2xl font-semibold text-center border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-green-50"
                    />
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-700">
                      minutes
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <span>Sunset: <span className="font-semibold text-gray-800">{sunsetTime}</span></span>
              <span>Last light: <span className="font-semibold text-gray-800">{civilTwilightTime}</span></span>
            </div>
            {/* Display Total Time */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-center shadow-md">
              <p className="text-white text-sm font-medium mb-1">You need to tee off before</p>
              <p className="text-white text-3xl font-bold">
                {teetime}
              </p>
            </div>
          </div>
        </div>

        {/* Fun Stats */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Default 18-hole round: 4 hours</p>
          <p>Default 9-hole round: 2 hours</p>
        </div>
      </div>
    </div>
  )
}

export default App
