export function getSunsetAsDate(...props) {
  const d = new Date(getSunsetEpoch(...props));
  console.log(`date: ${d} | params:: ${props}` );
  console.log('returning: ', d);
  return d;
}


export function getSunsetEpoch(latitude_deg, longitude_deg, elev, date=new Date()) {
  console.log('------start------');
  console.log('params: ', latitude_deg, longitude_deg, elev);
  // Calculate sunset time in Julian Date
  const julianTime = getJulianTime(date)
  console.log('julianTime', julianTime);
  const sme_deg = solarMeanAnomaly(julianTime)
  console.log('solarMeanAnomaly', sme_deg);
  const sme_rad = toRadians(sme_deg)
  const eoc_deg = equationOfTheCenter(sme_rad)
  const el_deg = eclipticLongitude(sme_deg, eoc_deg)

  const latitude_rad = toRadians(latitude_deg)
  const declination_rad = declinationOfSun(el_deg)
  const solarElevationAngle_deg = solarElevationAngle(elev)
  const solarElevationAngle_rad = toRadians(solarElevationAngle_deg)
  const hour_rad = hourAngle(latitude_rad, declination_rad, solarElevationAngle_rad)

  const mst = meanSolarTime(julianTime, longitude_deg)
  const julianTimeTransit = solarTransit(mst, sme_deg, el_deg, longitude_deg)
  
  const r = julianTimeTransit - toDegrees(hour_rad) / 360
  console.log('------end-----');
  return r;
}

function getJulianTime(date) {
  // Accepts a Date object
  const JD_UNIX_EPOCH = 2440587.5 // Julian Date at Unix epoch (1970-01-01)
  const millisecondsPerDay = 86400000
  return JD_UNIX_EPOCH + (date.getTime() / millisecondsPerDay)
}

function equationOfTheCenter(M_rad) {
  const EoC_EARTH_COEFFICIENT = 1.9148;
  return (EoC_EARTH_COEFFICIENT * Math.sin(M_rad)) 
         + (0.02 * Math.sin(2 * M_rad))
         + (0.0003 * Math.sin(3 * M_rad));
}

function eclipticLongitude(sonarMeanAnomaly_deg, EoC_deg) {
  const earthPerihelion = 102.9372;
  return (sonarMeanAnomaly_deg + EoC_deg + earthPerihelion + 180) % 360;
}

function meanSolarTime(julianTime, longitude) {
  return julianTime + 0.0009 - longitude / 360.0
}

function solarMeanAnomaly(julianTime) {
  return (357.5291 + 0.98560028 * (julianTime - 2451545)) % 360
}

function solarElevationAngle(elevation) {
  return -0.833 - 2.076 * Math.sqrt(elevation) / 60.0;
}

function solarTransit(meanSolarTime, sonarMeanAnomaly_deg, eclipticLongitude_deg, longitude) {
  const J200 = 2451545.0
  return J200 + meanSolarTime
         + (0.0053 * Math.sin(sonarMeanAnomaly_deg))
         - (0.0069 * Math.sin(2 * toRadians(eclipticLongitude_deg)));
}

function declinationOfSun(eclipticLongitude_deg) {
  return Math.asin(Math.sin(toRadians(eclipticLongitude_deg)) * Math.sin(toRadians(23.44)));
}

function hourAngle(latitude_rad, declination_rad, solarElevationAngle_rad) {
  // Calculate the hour angle in radians
  // some_cos = (Math.sin(radians(-0.833 - 2.076 * Math.sqrt(elevation) / 60.0)) - Math(radians(f)) * sin_d) / (Math.cos(radians(f)) * cos_d)

  const cosH = ( Math.sin(solarElevationAngle_rad) 
                 - (Math.sin(latitude_rad) * Math.sin(declination_rad))
               ) / ( Math.cos(latitude_rad) * Math.cos(declination_rad) );
  return Math.acos(cosH);
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}