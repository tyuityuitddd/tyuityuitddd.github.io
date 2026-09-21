import assert from 'node:assert/strict';
import { wrapIndex, ringDistance } from '../lib/gallery.ts';
assert.equal(wrapIndex(-1,36),35);
assert.equal(wrapIndex(36,36),0);
assert.equal(wrapIndex(3,0),0);
for(const count of [1,2,5,29,36]){
 for(let active=0;active<count;active++){
  const distances=Array.from({length:count},(_,i)=>ringDistance(i,active,count));
  assert.equal(distances[active],0);
  assert.equal(new Set(distances).size,count);
  assert(distances.every(d=>Math.abs(d)<=Math.ceil(count/2)));
  const next=wrapIndex(active+1,count);
  if(count>1)assert.equal(ringDistance(active,next,count),-1);
 }
}
console.log('Gallery wraparound and unique positions passed for empty, single, two, odd and full collections.');
