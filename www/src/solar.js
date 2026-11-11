export function getSunsetAsDate(...props) {
  const JD_UNIX_EPOCH = 2440587.5;
  const julianDate = getSunsetEpoch(...props);
  return new Date((julianDate - JD_UNIX_EPOCH) * 86400000);
}


// horizonAngle: -0.833 for sunset, -6.0 for civil twilight
export function getSunsetEpoch(latitude_deg, longitude_deg, elev, date=new Date(), horizonAngle=-0.833) {
  const julianTime = getJulianTime(date)
  const sme_deg = solarMeanAnomaly(julianTime)
  const sme_rad = toRadians(sme_deg)
  const eoc_deg = equationOfTheCenter(sme_rad)
  const el_deg = eclipticLongitude(sme_deg, eoc_deg)

  const latitude_rad = toRadians(latitude_deg)
  const declination_rad = declinationOfSun(el_deg)
  const effectiveAngle_deg = horizonAngle - 2.076 * Math.sqrt(elev) / 60.0
  const effectiveAngle_rad = toRadians(effectiveAngle_deg)
  const hour_rad = hourAngle(latitude_rad, declination_rad, effectiveAngle_rad)

  const mst = meanSolarTime(julianTime, longitude_deg)
  const julianTimeTransit = solarTransit(mst, sme_deg, el_deg, longitude_deg)

  return julianTimeTransit + toDegrees(hour_rad) / 360
}

function getJulianTime(date) {
  // Returns the Julian Day Number (integer) for the given date, using noon UTC
  const JD_UNIX_EPOCH = 2440587.5 // Julian Date at Unix epoch (1970-01-01T00:00:00Z)
  const noon = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  return Math.floor(JD_UNIX_EPOCH + noon / 86400000)
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
  const J2000 = 2451545.0;
  return (julianTime - J2000) + 0.0009 - longitude / 360.0
}

function solarMeanAnomaly(julianTime) {
  return (357.5291 + 0.98560028 * (julianTime - 2451545)) % 360
}


function solarTransit(meanSolarTime, sonarMeanAnomaly_deg, eclipticLongitude_deg, longitude) {
  const J200 = 2451545.0
  return J200 + meanSolarTime
         + (0.0053 * Math.sin(toRadians(sonarMeanAnomaly_deg)))
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