import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../../services/store';

interface ChainagePoint {
  km: number;
  label: string;
  name: string;
  activityCode: string;
  status: 'COMPLETED' | 'HYDROTESTED' | 'IN_PROGRESS' | 'CRITICAL_BOTTLENECK';
  progressPct: number;
  depthMeters: number;
  soilType: string;
  contractor: string;
  cathodicVoltage: string;
  description: string;
  coordinates: { x: number; y: number; z: number };
}

const CHAINAGE_STATIONS: ChainagePoint[] = [
  {
    km: 0,
    label: 'KM 00+000',
    name: 'Digboi Initial Pump Station & Metering Header',
    activityCode: 'ACT-DGB-01',
    status: 'COMPLETED',
    progressPct: 100,
    depthMeters: 2.2,
    soilType: 'Compacted Gravel / Clay',
    contractor: 'OIL Mechanical Engineering Crew',
    cathodicVoltage: '-1.18 V DC (Optimal)',
    description: 'Header manifold connected to Digboi Oilfield gathering line. Hydrotesting certified and commissioned.',
    coordinates: { x: -80, y: 3, z: 0 }
  },
  {
    km: 18,
    label: 'KM 18+400',
    name: 'Sectional Valve Station SV-01 (Tingrai Sector)',
    activityCode: 'ACT-SV-01',
    status: 'COMPLETED',
    progressPct: 100,
    depthMeters: 1.8,
    soilType: 'Alluvial Loam',
    contractor: 'Kalpataru Power EPC',
    cathodicVoltage: '-1.15 V DC',
    description: 'Remote-operated emergency shutdown valve (ESDV) installed with solar telemetry gateway.',
    coordinates: { x: -50, y: 1.5, z: 5 }
  },
  {
    km: 42.65,
    label: 'KM 42+650',
    name: 'Spread-02 Hard Rock Bedrock Trenching Bottleneck',
    activityCode: 'ACT-TR-4290',
    status: 'CRITICAL_BOTTLENECK',
    progressPct: 48,
    depthMeters: 1.4,
    soilType: 'Hard Sandstone Bedrock (Class IV RMR)',
    contractor: 'Punj Lloyd Infrastructure',
    cathodicVoltage: '-0.92 V DC (Pre-commissioning)',
    description: 'Critical delay zone: standard excavators unable to penetrate hard sandstone. Auxiliary 35T ripper deployed.',
    coordinates: { x: -10, y: 0.5, z: -4 }
  },
  {
    km: 44.8,
    label: 'KM 44+800',
    name: 'Burhi Dihing River Subsurface HDD Directional Crossing',
    activityCode: 'ACT-HDD-104',
    status: 'IN_PROGRESS',
    progressPct: 62,
    depthMeters: 14.5,
    soilType: 'Sub-riverbed Silt & Cobbles',
    contractor: 'Corrtech Energy HDD Division',
    cathodicVoltage: '-1.05 V DC',
    description: 'Horizontal Directional Drilling under active riverbed. Siltation monitoring active due to monsoon swell.',
    coordinates: { x: 5, y: -2.5, z: 2 }
  },
  {
    km: 86,
    label: 'KM 86+200',
    name: 'Sectional Valve Station SV-03 (Naharkatia Sector)',
    activityCode: 'ACT-WLD-102',
    status: 'HYDROTESTED',
    progressPct: 88,
    depthMeters: 1.8,
    soilType: 'Dense Silty Clay',
    contractor: 'Kalpataru Power EPC',
    cathodicVoltage: '-1.12 V DC',
    description: 'Mainline automatic welding 100% NDT radiography cleared. Section isolated for hydrostatic hold.',
    coordinates: { x: 45, y: 2, z: -3 }
  },
  {
    km: 132,
    label: 'KM 132+000',
    name: 'Duliajan Refinery Crude Receiving Terminal',
    activityCode: 'ACT-DLN-99',
    status: 'IN_PROGRESS',
    progressPct: 75,
    depthMeters: 2.0,
    soilType: 'Engineered Engineered Fill',
    contractor: 'OIL Refinery Operations Directorate',
    cathodicVoltage: '-1.20 V DC',
    description: 'Terminal pig receiver and custody transfer ultrasonic metering skid ready for tie-in.',
    coordinates: { x: 85, y: 1, z: 0 }
  }
];

export const Pipeline3DCorridor: React.FC = () => {
  const { setActiveTab, showToast } = useApp();
  const mountRef = useRef<HTMLDivElement>(null);
  
  // HUD state
  const [selectedStation, setSelectedStation] = useState<ChainagePoint>(CHAINAGE_STATIONS[2]); // Default to KM 42+650
  const [isFlythroughActive, setIsFlythroughActive] = useState<boolean>(false);
  const [flySpeed, setFlySpeed] = useState<number>(1);
  const [weatherMode, setWeatherMode] = useState<'CLEAR' | 'MONSOON' | 'FLIR'>('CLEAR');
  const [activeLayer, setActiveLayer] = useState<'PROGRESS' | 'ROW_GEOFENCE' | 'SOIL_STRATA'>('PROGRESS');
  const [hudStats, setHudStats] = useState({
    fps: 60,
    pipelineLength: '132.0 KM',
    activeSpread: 'Spread 02 (KM 42-88)',
    cathodicAvg: '-1.14 V'
  });

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const splineRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const flyProgressRef = useRef<number>(0.25); // Start near KM 42
  const markerMeshesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 580;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(weatherMode === 'FLIR' ? 0x070b19 : weatherMode === 'MONSOON' ? 0x1e293b : 0xf1f5f9);

    if (weatherMode === 'MONSOON') {
      scene.fog = new THREE.FogExp2(0x334155, 0.015);
    } else if (weatherMode === 'FLIR') {
      scene.fog = new THREE.FogExp2(0x0f172a, 0.012);
    } else {
      scene.fog = new THREE.FogExp2(0xe2e8f0, 0.008);
    }

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(-20, 24, 45);
    camera.lookAt(-10, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, weatherMode === 'FLIR' ? 0.6 : 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, weatherMode === 'MONSOON' ? 0.8 : 1.4);
    sunLight.position.set(40, 60, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Blue/amber rim lights for high-tech HUD look
    const rimLight1 = new THREE.PointLight(0x2563eb, 2, 80);
    rimLight1.position.set(-10, 15, -10);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0xf59e0b, 1.5, 60);
    rimLight2.position.set(20, 10, 20);
    scene.add(rimLight2);

    // 5. Procedural Undulating Terrain
    const terrainGeo = new THREE.PlaneGeometry(220, 90, 80, 40);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);

      // River depression around x = 5 (Burhi Dihing River channel)
      let riverDepth = 0;
      if (vx > -8 && vx < 18) {
        const d = Math.abs(vx - 5) / 13;
        riverDepth = -(1 - d * d) * 5.5;
      }

      // Gentle Assam foothills elevation wave
      const elevation = Math.sin(vx * 0.05) * Math.cos(vz * 0.08) * 3.5 + 
                        Math.sin(vx * 0.12) * 1.5 + riverDepth;

      pos.setY(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: weatherMode === 'FLIR' ? 0x111827 : weatherMode === 'MONSOON' ? 0x334155 : 0xdcfce7,
      roughness: 0.85,
      metalness: 0.1,
      wireframe: weatherMode === 'FLIR'
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.y = -1;
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // Grid contour overlay
    const grid = new THREE.GridHelper(220, 44, 0x3b82f6, 0x94a3b8);
    grid.position.y = -0.9;
    (grid.material as THREE.Material).opacity = 0.25;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // 6. Water plane for Burhi Dihing River
    const riverGeo = new THREE.PlaneGeometry(32, 90);
    riverGeo.rotateX(-Math.PI / 2);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.7,
      transparent: true,
      opacity: 0.8
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.position.set(5, -3.2, 0);
    scene.add(riverMesh);

    // 7. Pipeline 3D Spline Path
    const splinePoints = [
      new THREE.Vector3(-90, 2.5, 0),
      new THREE.Vector3(-70, 2.2, 3),
      new THREE.Vector3(-50, 1.6, 5),
      new THREE.Vector3(-30, 1.2, 1),
      new THREE.Vector3(-10, 0.4, -4),   // KM 42+650 hard rock bottleneck
      new THREE.Vector3(0, -1.8, -1),
      new THREE.Vector3(5, -4.5, 2),     // Burhi Dihing River HDD under riverbed
      new THREE.Vector3(12, -2.0, 4),
      new THREE.Vector3(25, 0.8, 1),
      new THREE.Vector3(45, 1.8, -3),
      new THREE.Vector3(65, 1.2, -1),
      new THREE.Vector3(85, 1.0, 0)
    ];

    const curve = new THREE.CatmullRomCurve3(splinePoints);
    splineRef.current = curve;

    // Tube geometry for the crude oil trunkline
    const tubeGeo = new THREE.TubeGeometry(curve, 180, 0.65, 12, false);
    
    // Color vertex attribute based on progress
    const count = tubeGeo.attributes.position.count;
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = (tubeGeo.attributes.position.getX(i) + 90) / 175; // normalized 0 to 1
      
      // Segment colors:
      // u < 0.35: Green (Completed)
      // 0.35 <= u < 0.48: Red (Critical Bottleneck KM 42+650 & HDD River)
      // 0.48 <= u < 0.75: Blue (Hydrotested / Welded)
      // u >= 0.75: Amber (Trenching / Stringing)
      let r = 0.1, g = 0.7, b = 0.3; // Green default
      if (u >= 0.36 && u <= 0.49) {
        r = 0.9; g = 0.15; b = 0.15; // Red Bottleneck
      } else if (u > 0.49 && u <= 0.72) {
        r = 0.15; g = 0.5; b = 0.95; // Blue Hydrotested
      } else if (u > 0.72) {
        r = 0.95; g = 0.65; b = 0.1; // Amber In-Progress
      }

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    tubeGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pipeMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.35,
      metalness: 0.65
    });

    const pipelineMesh = new THREE.Mesh(tubeGeo, pipeMat);
    pipelineMesh.castShadow = true;
    scene.add(pipelineMesh);

    // 8. Chainage Stations Marker Beacons
    markerMeshesRef.current = [];
    CHAINAGE_STATIONS.forEach((st) => {
      // Beacon cylinder
      const beaconGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
      const beaconColor = 
        st.status === 'CRITICAL_BOTTLENECK' ? 0xe11d48 : 
        st.status === 'IN_PROGRESS' ? 0xf59e0b : 
        st.status === 'HYDROTESTED' ? 0x2563eb : 0x10b981;

      const beaconMat = new THREE.MeshStandardMaterial({
        color: beaconColor,
        emissive: beaconColor,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });

      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(st.coordinates.x, st.coordinates.y + 2, st.coordinates.z);
      beacon.userData = { station: st };
      scene.add(beacon);

      // Top pulse sphere
      const sphereGeo = new THREE.SphereGeometry(0.7, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: beaconColor });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(st.coordinates.x, st.coordinates.y + 4.2, st.coordinates.z);
      sphere.userData = { station: st };
      scene.add(sphere);

      markerMeshesRef.current.push(sphere);
    });

    // 9. Mouse Orbit & Click Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isFlythroughActive) return;

      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      if (cameraRef.current) {
        cameraRef.current.position.x -= deltaX * 0.15;
        cameraRef.current.position.y += deltaY * 0.15;
        cameraRef.current.position.y = Math.max(5, Math.min(60, cameraRef.current.position.y));
        cameraRef.current.lookAt(-10, 0, 0);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (isFlythroughActive || !cameraRef.current) return;
      cameraRef.current.position.z += e.deltaY * 0.05;
      cameraRef.current.position.z = Math.max(15, Math.min(120, cameraRef.current.position.z));
    };

    const handleCanvasClick = (e: MouseEvent) => {
      if (!rendererRef.current || !cameraRef.current) return;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(markerMeshesRef.current);

      if (intersects.length > 0) {
        const hit = intersects[0].object.userData.station as ChainagePoint;
        if (hit) {
          setSelectedStation(hit);
          showToast(`Inspecting ${hit.label}: ${hit.name}`, 'info');
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domEl.addEventListener('wheel', handleWheel);
    domEl.addEventListener('click', handleCanvasClick);

    // 10. Animation Loop
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = (time: number) => {
      animationFrameId.current = requestAnimationFrame(animate);

      // Calculate FPS
      frameCount++;
      if (time - lastTime >= 1000) {
        setHudStats(prev => ({ ...prev, fps: frameCount }));
        frameCount = 0;
        lastTime = time;
      }

      // Handle Flythrough Camera along Spline
      if (isFlythroughActive && splineRef.current && cameraRef.current) {
        flyProgressRef.current = (flyProgressRef.current + 0.0006 * flySpeed) % 1.0;
        const currentPos = splineRef.current.getPointAt(flyProgressRef.current);
        const lookAheadPos = splineRef.current.getPointAt((flyProgressRef.current + 0.03) % 1.0);

        // Position camera above pipeline spline
        cameraRef.current.position.set(currentPos.x - 4, currentPos.y + 7, currentPos.z + 12);
        cameraRef.current.lookAt(lookAheadPos.x, lookAheadPos.y + 1, lookAheadPos.z);
      }

      // Gentle marker sphere bobbing
      markerMeshesRef.current.forEach((m, idx) => {
        m.position.y = 4.2 + Math.sin(time * 0.003 + idx) * 0.3;
      });

      renderer.render(scene, camera);
    };

    animate(performance.now());

    // Window resize handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 580;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', handleMouseDown);
      domEl.removeEventListener('wheel', handleWheel);
      domEl.removeEventListener('click', handleCanvasClick);
      renderer.dispose();
    };
  }, [weatherMode, isFlythroughActive, flySpeed, activeLayer]);

  const jumpToStation = (station: ChainagePoint) => {
    setSelectedStation(station);
    setIsFlythroughActive(false);
    if (cameraRef.current) {
      cameraRef.current.position.set(station.coordinates.x - 12, station.coordinates.y + 14, station.coordinates.z + 24);
      cameraRef.current.lookAt(station.coordinates.x, station.coordinates.y, station.coordinates.z);
      showToast(`Focused on ${station.label}`, 'info');
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {/* HEADER / CONTROL STRIP */}
      <div className="bg-white rounded-xl p-4 border border-slate-300 shadow-xs flex flex-wrap items-center justify-between gap-4 hover-elevate">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-blue-700 uppercase tracking-widest font-semibold">
              SIH26122 INNOVATION #1
            </span>
            <span className="font-mono text-[10px] text-slate-300">/</span>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
              Digital Twin Simulation
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-700 text-[24px]">view_in_ar</span>
              WebGL 3D Digital Twin Pipeline Corridor
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[10px] font-bold">
              132 KM TRUNKLINE
            </span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              HARDWARE ACCELERATED 60 FPS
            </span>
          </div>
        </div>

        {/* View Mode & Camera Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Flythrough Toggle */}
          <button
            onClick={() => setIsFlythroughActive(!isFlythroughActive)}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              isFlythroughActive 
                ? 'bg-amber-600 text-white hover:bg-amber-700 animate-pulse' 
                : 'bg-blue-700 text-white hover:bg-blue-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isFlythroughActive ? 'pause_circle' : 'flight'}
            </span>
            <span>{isFlythroughActive ? 'Stop 3D Flythrough' : 'Fly Along Pipeline'}</span>
          </button>

          {isFlythroughActive && (
            <div className="flex items-center bg-slate-100 border border-slate-300 rounded-lg p-0.5 gap-0.5">
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setFlySpeed(s)}
                  className={`px-2 py-1 rounded font-mono text-[10px] font-bold cursor-pointer transition-colors ${
                    flySpeed === s ? 'bg-blue-700 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}

          {/* Weather Simulation Selector */}
          <div className="flex items-center bg-slate-100 border border-slate-300 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setWeatherMode('CLEAR')}
              className={`px-2.5 py-1 rounded font-mono text-[10px] font-semibold transition-colors cursor-pointer ${
                weatherMode === 'CLEAR' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ☀️ Clear
            </button>
            <button
              onClick={() => setWeatherMode('MONSOON')}
              className={`px-2.5 py-1 rounded font-mono text-[10px] font-semibold transition-colors cursor-pointer ${
                weatherMode === 'MONSOON' ? 'bg-slate-800 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌧️ Monsoon
            </button>
            <button
              onClick={() => setWeatherMode('FLIR')}
              className={`px-2.5 py-1 rounded font-mono text-[10px] font-semibold transition-colors cursor-pointer ${
                weatherMode === 'FLIR' ? 'bg-blue-950 text-cyan-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛰️ FLIR Heatmap
            </button>
          </div>
        </div>
      </div>

      {/* 3D CANVAS & HUD CONTAINER */}
      <div className="relative w-full h-[580px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
        {/* Three.js Canvas Element */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top Floating Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 text-white px-3.5 py-2.5 rounded-lg shadow-lg flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-emerald-400 font-bold">OIL TRUNKLINE 3D</span>
            </div>
            <span className="text-slate-400">|</span>
            <span>FPS: <strong className="text-white">{hudStats.fps}</strong></span>
            <span className="text-slate-400">|</span>
            <span>LAT: <strong className="text-blue-400">27.38° N</strong></span>
            <span className="text-slate-400">|</span>
            <span>LON: <strong className="text-blue-400">95.63° E</strong></span>
            <span className="text-slate-400">|</span>
            <span>CP VOLTAGE: <strong className="text-emerald-400">{hudStats.cathodicAvg}</strong></span>
          </div>

          {/* Quick Chainage Bookmark Chips */}
          <div className="flex items-center gap-1.5 pointer-events-auto flex-wrap max-w-[500px]">
            {CHAINAGE_STATIONS.map((st) => (
              <button
                key={st.km}
                onClick={() => jumpToStation(st)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer backdrop-blur-sm border shadow-xs ${
                  selectedStation.km === st.km
                    ? 'bg-blue-600 text-white border-blue-400 scale-105'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute top-4 right-4 z-10 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-white p-3 rounded-lg shadow-lg text-[11px] font-mono flex flex-col gap-1.5 pointer-events-none">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Corridor Status Legend</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500"></span>
            <span>Completed &amp; Backfilled (84km)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-500"></span>
            <span>Hydrotested &amp; NDT Passed (28km)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500"></span>
            <span>Welding / Trenching Active (12km)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-600 animate-pulse"></span>
            <span>Hard Rock / River Bottleneck (8km)</span>
          </div>
        </div>

        {/* Bottom Interactive Chainage Inspector Card */}
        {selectedStation && (
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-md border border-slate-300 p-4 rounded-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-xs font-bold border border-blue-300">
                  {selectedStation.label}
                </span>
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  {selectedStation.name}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedStation.status === 'CRITICAL_BOTTLENECK' 
                    ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                    : selectedStation.status === 'IN_PROGRESS'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}>
                  {selectedStation.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedStation.description}
              </p>
            </div>

            {/* Quick Metrics & Actions */}
            <div className="flex items-center gap-4 flex-wrap self-end md:self-center">
              <div className="flex flex-col items-end font-mono">
                <span className="text-[10px] text-slate-500 uppercase">Progress</span>
                <span className="text-base font-bold text-slate-900">{selectedStation.progressPct}%</span>
              </div>
              <div className="flex flex-col items-end font-mono">
                <span className="text-[10px] text-slate-500 uppercase">Trench Depth</span>
                <span className="text-base font-bold text-blue-700">{selectedStation.depthMeters} m</span>
              </div>
              <div className="flex flex-col items-end font-mono">
                <span className="text-[10px] text-slate-500 uppercase">Cathodic</span>
                <span className="text-base font-bold text-emerald-700">{selectedStation.cathodicVoltage}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('GANTT_4D')}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 text-xs font-semibold font-mono transition-colors cursor-pointer"
                >
                  View in 4D Gantt
                </button>
                <button
                  onClick={() => setActiveTab('FIELD_INPUT')}
                  className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold font-mono transition-colors cursor-pointer shadow-xs"
                >
                  Log Field Telemetry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ROUTE GEOMETRY & ELEVATION PROFILE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-1">
          <span className="font-mono text-[10px] text-slate-500 uppercase">Total Pipeline RoW</span>
          <span className="text-lg font-bold text-slate-900 font-mono">132.0 KM</span>
          <span className="text-[11px] text-emerald-700 font-semibold">Digboi Pump Station to Duliajan Refinery</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-1">
          <span className="font-mono text-[10px] text-slate-500 uppercase">Burhi Dihing Crossing</span>
          <span className="text-lg font-bold text-blue-700 font-mono">KM 44+800</span>
          <span className="text-[11px] text-slate-600">Subsurface HDD Bore (14.5m below riverbed)</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-1">
          <span className="font-mono text-[10px] text-slate-500 uppercase">High Risk Chainage</span>
          <span className="text-lg font-bold text-rose-700 font-mono">KM 42+650</span>
          <span className="text-[11px] text-rose-800 font-medium">Hard Sandstone Bedrock (CAT Ripper Active)</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-1">
          <span className="font-mono text-[10px] text-slate-500 uppercase">Telemetry Health</span>
          <span className="text-lg font-bold text-emerald-700 font-mono">100% SECURE</span>
          <span className="text-[11px] text-slate-600">RTK GPS Differential Fix &amp; Solar Gateways</span>
        </div>
      </div>
    </div>
  );
};
