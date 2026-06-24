import { useState } from 'react'
import { getSunset, getSunsetAsDate } from './solar'

function App() {
  const [is18Holes, setIs18Holes] = useState(true)
  const [hours, setHours] = useState(4)
  const [minutes, setMinutes] = useState(0)

  let lat = 51.33162308491946; // Fallback on lat of Cuddington GC
  let lon = -0.21451649021796887; // Fallback on lon of Cuddington GC
  let elev = 85.; // fallback on elev to cuddington GC
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    console.log(coords)
    if ( 'latitude' in coords 
      && 'longitude' in coords) {
      lat = coords.latitude;
      lon = coords.longitude;
    }
    if ( 'altitude' in coords ) {
      elev = coords.altitude;
    }
  });
  console.log('5, 10, 20:', getSunsetAsDate(5, 10, 20, new Date(1,6,2020)))
  console.log('30, 100, 0:', getSunsetAsDate(30, 100, 0, new Date(1,1,2020)))
  console.log('30, 100, 0:', getSunsetAsDate(30, 100, 0))
  const sunsetEpoch = getSunsetEpoch(lat, lon, elev)
  
  const starttime = new Date(
    sunsetEpoch
    - (minutes * 60 * 1000)
    - (hours * 60 * 60 * 1000)
  );
  const teetime = `${starttime.toTimeString().substring(0,5)}`;

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
    console.log(value);
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
            sunset at: {new Date(sunset).toLocaleTimeString()}
            {/* Display Total Time */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-center shadow-md">
              <p className="text-white text-sm font-medium mb-1">You need to tee off before</p>
              <p className="text-white text-3xl font-bold">
                {teetime}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" className="text-green-200"/>
                <circle cx="10" cy="10" r="3" className="text-white"/>
              </svg>
              <span>Perfect for tracking your pace</span>
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
