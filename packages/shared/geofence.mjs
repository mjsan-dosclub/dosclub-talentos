const earthRadiusMeters=6371000;
const radians=value=>value*Math.PI/180;

export function distanceMeters(from,to){
  for(const value of [from.latitude,from.longitude,to.latitude,to.longitude])if(!Number.isFinite(value))throw new Error('Valid coordinates are required');
  const latitudeDelta=radians(to.latitude-from.latitude);
  const longitudeDelta=radians(to.longitude-from.longitude);
  const a=Math.sin(latitudeDelta/2)**2+Math.cos(radians(from.latitude))*Math.cos(radians(to.latitude))*Math.sin(longitudeDelta/2)**2;
  return Math.round(earthRadiusMeters*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));
}

export function insideGeofence(origin,position,radiusMeters){
  if(!Number.isInteger(radiusMeters)||radiusMeters<=0)throw new Error('A positive whole-metre radius is required');
  const distance=distanceMeters(origin,position);
  return {inside:distance<=radiusMeters,distance};
}
