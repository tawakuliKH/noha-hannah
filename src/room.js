import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
export const sofaTones={Ivory:'#d8c9af',Clay:'#a86d55',Charcoal:'#464742'};
// Original, illustrative geometry; not models of the store's inventory.
export function buildRoom(tone='Ivory'){
 const room=new THREE.Group();room.name='Illustrative living room';
 const weave=new Uint8Array(64*64*4);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const i=(y*64+x)*4,v=165+((x%3===0||y%3===0)?45:0)+Math.floor(12*Math.sin(x*17+y*31));weave.set([v,v,v,255],i)}
 const texture=new THREE.DataTexture(weave,64,64);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(12,12);texture.needsUpdate=true;
 const fabric=new THREE.MeshStandardMaterial({color:sofaTones[tone],roughness:1,bumpMap:texture,bumpScale:.018});
 const linen=new THREE.MeshStandardMaterial({color:'#eee3d0',roughness:1,bumpMap:texture,bumpScale:.02});
 const olive=new THREE.MeshStandardMaterial({color:'#727562',roughness:1,bumpMap:texture,bumpScale:.02});
 const oak=new THREE.MeshStandardMaterial({color:'#9e724b',roughness:.65});
 const dark=new THREE.MeshStandardMaterial({color:'#35332b',roughness:.5});
 const gold=new THREE.MeshStandardMaterial({color:'#b79a63',metalness:.72,roughness:.3});
 const stone=new THREE.MeshStandardMaterial({color:'#e6d6ba',roughness:.85});
 function add(geometry,material,x,y,z,name){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;m.name=name;room.add(m);return m}
 function box(w,h,d,mat,x,y,z,name,r=.06){return add(new RoundedBoxGeometry(w,h,d,3,r),mat,x,y,z,name)}
 // Individual floor planks make depth and perspective apparent while orbiting.
 for(let i=0;i<20;i++){const mat=new THREE.MeshStandardMaterial({color:new THREE.Color('#b39470').multiplyScalar(.92+(i%4)*.045),roughness:.9});box(.275,.1,4.7,mat,-2.75+i*.285,-.055,0,'Oak floor plank',.008)}
 box(5.75,.16,4.85,dark,-.04,-.18,0,'Room platform',.03);
 box(3.7,.045,2.65,linen,0,.018,.5,'Woven rug',.018);
 // Rug border.
 const border=new THREE.MeshStandardMaterial({color:'#b9a58b',roughness:1});for(const x of [-1.74,1.74])box(.025,.008,2.35,border,x,.047,.5,'Rug border',.002);
 // Three-seat sofa: rounded base, seat pads, back cushions and armrests.
 box(3.3,.35,1.08,fabric,0,.42,-1,'Upholstered sofa base',.13);
 for(const x of [-1.3,1.3])for(const z of [-1.35,-.65])add(new THREE.CylinderGeometry(.055,.045,.27,16),oak,x,.15,z,'Sofa foot');
 for(let i=-1;i<=1;i++){box(.96,.21,.86,fabric,i*1.01,.69,-.93,'Individual seat cushion',.09);const back=box(.98,.72,.24,fabric,i*1.01,1.08,-1.42,'Back cushion',.11);back.rotation.x=-.12;}
 for(const x of [-1.65,1.65])box(.23,.65,1.15,fabric,x,.72,-1,'Rounded armrest',.1);
 const p1=box(.5,.5,.19,olive,-1.04,.99,-1.12,'Olive scatter cushion',.085);p1.rotation.set(-.18,0,-.2);
 const p2=box(.47,.47,.2,linen,1.08,.98,-1.1,'Linen scatter cushion',.085);p2.rotation.set(-.22,0,.21);
 // Travertine-style coffee table with sculptural pedestal.
 add(new THREE.CylinderGeometry(.79,.79,.12,80),stone,.12,.59,.65,'Round coffee table');
 add(new THREE.CylinderGeometry(.28,.36,.5,48),oak,.12,.28,.65,'Coffee table pedestal');
 const book=box(.42,.045,.3,olive,.32,.68,.55,'Book cover',.008);book.rotation.y=.23;
 box(.39,.032,.28,linen,.32,.713,.55,'Book pages',.003).rotation.y=.23;
 const ceramic=new THREE.MeshStandardMaterial({color:'#bba082',roughness:.72});
 const curve=[[0,0],[.12,0],[.15,.08],[.13,.22],[.065,.3],[.06,.43],[.045,.43],[.045,.29],[.1,.2],[.1,.07],[0,.04]].map(p=>new THREE.Vector2(...p));
 add(new THREE.LatheGeometry(curve,40),ceramic,-.2,.66,.7,'Ceramic vase');
 // Floor lamp: metal base, stem, shade and warm bulb.
 add(new THREE.CylinderGeometry(.3,.32,.045,40),gold,2.1,.03,-1.2,'Lamp base');
 add(new THREE.CylinderGeometry(.025,.025,1.75,16),gold,2.1,.91,-1.2,'Lamp stem');
 const shade=new THREE.MeshStandardMaterial({color:'#eee2c7',roughness:.85,side:THREE.DoubleSide});
 add(new THREE.CylinderGeometry(.23,.43,.5,48,1,true),shade,2.1,1.95,-1.2,'Linen lamp shade');
 const bulb=add(new THREE.SphereGeometry(.085,16,16),new THREE.MeshStandardMaterial({color:'#fff6dc',emissive:'#ffcf88',emissiveIntensity:1.4}),2.1,1.8,-1.2,'Warm light bulb');
 const lamp=new THREE.PointLight('#ffd7a0',2,4,2);lamp.position.copy(bulb.position);room.add(lamp);
 // Plant in a stone pot, opposite the lamp.
 add(new THREE.CylinderGeometry(.25,.19,.48,40),stone,-2.25,.24,-1.3,'Plant pot');
 for(let i=0;i<9;i++){const angle=i*2.4,y=.65+i*.075;const leaf=add(new THREE.SphereGeometry(1,20,16),olive,-2.25+Math.cos(angle)*.19,y,-1.3+Math.sin(angle)*.19,'Leaf');leaf.scale.set(.12,.35,.055);leaf.rotation.set(.25,angle,Math.sin(angle)*.45)}
 return {room,fabric,texture};
}
