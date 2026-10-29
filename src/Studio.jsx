import React,{useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RotateCcw,Plus,Minus,Pause,Play} from 'lucide-react';
import {buildRoom,sofaTones} from './room';
export default function Studio({tone,reduced}){
 const host=useRef(null),api=useRef(null),[failed,setFailed]=useState(false),[rotate,setRotate]=useState(true);
 useEffect(()=>{
 let renderer,raf,resize,observer,controls,scene,texture;const root=host.current;let visible=true;
 const dispose=()=>{cancelAnimationFrame(raf);resize?.disconnect();observer?.disconnect();controls?.dispose();texture?.dispose();const geometries=new Set(),materials=new Set();scene?.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of [o.material].flat())materials.add(m)});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer?.dispose();renderer?.domElement.remove();api.current=null};
 try{
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.setClearColor(0x000000,0);root.appendChild(renderer.domElement);
 renderer.domElement.setAttribute('aria-label','3D furnished room. Drag to orbit; arrow keys rotate; plus and minus buttons zoom.');renderer.domElement.tabIndex=0;
 scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(38,1,.1,60);camera.position.set(6.7,5.2,7.5);controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.55,0);controls.enablePan=false;controls.minDistance=5;controls.maxDistance=15;controls.minPolarAngle=.25;controls.maxPolarAngle=Math.PI*.46;controls.enableZoom=false;controls.enableDamping=true;controls.autoRotateSpeed=.45;
 scene.add(new THREE.HemisphereLight('#fff4dd','#8a7a61',2.3));const sun=new THREE.DirectionalLight('#fff2d9',3.8);sun.position.set(-3,7,4);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-5,right:5,top:5,bottom:-5});sun.shadow.normalBias=.035;scene.add(sun);const fill=new THREE.DirectionalLight('#e8efff',1.2);fill.position.set(4,3,-4);scene.add(fill);
 const built=buildRoom(tone);texture=built.texture;scene.add(built.room);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.18}));floor.rotation.x=-Math.PI/2;floor.position.y=-.27;floor.receiveShadow=true;scene.add(floor);
 const reset=()=>{camera.position.set(6.7,5.2,7.5);controls.target.set(0,.55,0);controls.update()};
 const zoom=factor=>{const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()*factor,5,15));camera.position.copy(controls.target).add(offset);controls.update()};
 const keyRotate=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const s=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));if(e.key==='ArrowLeft')s.theta-=.15;if(e.key==='ArrowRight')s.theta+=.15;if(e.key==='ArrowUp')s.phi=Math.max(.25,s.phi-.12);if(e.key==='ArrowDown')s.phi=Math.min(Math.PI*.46,s.phi+.12);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));controls.update()};renderer.domElement.addEventListener('keydown',keyRotate);
 resize=new ResizeObserver(()=>{const w=root.clientWidth,h=root.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()});resize.observe(root);
 observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting});observer.observe(root);
 api.current={material:built.fabric,reset,zoom,reduced,rotate:true};
 const draw=()=>{raf=requestAnimationFrame(draw);if(!visible||document.hidden)return;controls.autoRotate=api.current.rotate&&!api.current.reduced;controls.update();renderer.render(scene,camera)};draw();
 return()=>{renderer.domElement.removeEventListener('keydown',keyRotate);dispose()};
 }catch{dispose();setFailed(true);return dispose}
 },[]);
 useEffect(()=>{if(api.current)api.current.material.color.set(sofaTones[tone])},[tone]);
 useEffect(()=>{if(api.current){api.current.reduced=reduced;api.current.rotate=rotate}},[reduced,rotate]);
 return <><div className="studio-canvas" ref={host}>{failed&&<div className="room-fallback"><img src="/images/living.webp" alt="Living room inspiration photograph, not the 3D view"/><div><strong>3D needs WebGL</strong>This browser cannot display the interactive room. Open the site in a WebGL-capable browser with graphics acceleration enabled. The image behind this message is a photograph.</div></div>}</div>{!failed&&<div className="studio-toolbar" aria-label="3D room controls"><button className="icon" aria-label="Zoom in" onClick={()=>api.current?.zoom(.85)}><Plus size={17}/></button><button className="icon" aria-label="Zoom out" onClick={()=>api.current?.zoom(1.18)}><Minus size={17}/></button><button className="icon" aria-label="Reset 3D view" onClick={()=>api.current?.reset()}><RotateCcw size={17}/></button><button className="icon" aria-label={rotate?'Pause room rotation':'Start room rotation'} onClick={()=>setRotate(!rotate)}>{rotate?<Pause size={16}/>:<Play size={16}/>}</button></div>}</>;
}
