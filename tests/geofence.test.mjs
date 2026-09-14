import test from 'node:test';
import assert from 'node:assert/strict';
import {distanceMeters,insideGeofence} from '../packages/shared/geofence.mjs';

test('same attendance position is inside a configured radius',()=>{
  assert.deepEqual(insideGeofence({latitude:13.0827,longitude:80.2707},{latitude:13.0827,longitude:80.2707},25),{inside:true,distance:0});
});

test('a distant position is rejected by the configured radius',()=>{
  const result=insideGeofence({latitude:13.0827,longitude:80.2707},{latitude:13.0840,longitude:80.2707},50);
  assert.equal(result.inside,false);
  assert.ok(result.distance>100);
});

test('invalid coordinates are rejected',()=>assert.throws(()=>distanceMeters({latitude:Number.NaN,longitude:80},{latitude:13,longitude:80}),/Valid coordinates/));
