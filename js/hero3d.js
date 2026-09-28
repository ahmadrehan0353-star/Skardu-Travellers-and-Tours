/* ===========================================================
   3D mountain hero (Three.js)
   A procedural Karakoram-style range with snow caps, a glacial
   lake, drifting snow and a camera that follows mouse and scroll.
   Falls back to the photo slideshow if WebGL isn't available.
   =========================================================== */
(function () {
  "use strict";
  const host = document.getElementById("hero3d");
  if (!host || typeof THREE === "undefined") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) { return; }                     // no WebGL → keep photo slideshow
  document.body.classList.add("has-3d");

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const HORIZON = new THREE.Color("#E9C9A6");
  scene.fog = new THREE.Fog(HORIZON, 110, 360);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 600);

  /* ---------- Noise (seeded value noise + fbm) ---------- */
  const perm = new Uint8Array(512);
  (function seed(s) {
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  })(2611);
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + (b - a) * t;
  function grad(h, x, y) { const u = (h & 1) ? x : -x, v = (h & 2) ? y : -y; return u + v; }
  function noise(x, y) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y), A = perm[X] + Y, B = perm[X + 1] + Y;
    return lerp(lerp(grad(perm[A], x, y), grad(perm[B], x - 1, y), u), lerp(grad(perm[A + 1], x, y - 1), grad(perm[B + 1], x - 1, y - 1), u), v);
  }
  function ridged(x, y) {
    let sum = 0, amp = 1, freq = 1, norm = 0;
    for (let o = 0; o < 6; o++) {
      let n = 1 - Math.abs(noise(x * freq, y * freq));
      n *= n;
      sum += n * amp; norm += amp; amp *= 0.5; freq *= 2.05;
    }
    return sum / norm;
  }

  /* ---------- Terrain ---------- */
  const SIZE = 320, SEG = 220;
  const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const cValley = new THREE.Color("#6E7B45"), cDry = new THREE.Color("#9C8466"), cRock = new THREE.Color("#6A5E57"),
        cRockDark = new THREE.Color("#463E3B"), cSnow = new THREE.Color("#F4F7FA"), tmp = new THREE.Color();

  function heightAt(x, z) {
    const d = Math.max(0, -z);                            // distance into the scene
    const range = Math.min(1, (d + 30) / 150);            // mountains rise with distance
    const valley = Math.exp(-Math.pow(x / 38, 2));        // a valley running down the middle
    let h = ridged(x * 0.012, z * 0.012) * 70 * range;
    h *= 1 - valley * 0.75 * (1 - range * 0.6);
    // A towering peak in the distance
    const pk = Math.exp(-(Math.pow((x - 35) / 26, 2) + Math.pow((z + 175) / 26, 2)));
    h += pk * 95;
    h += noise(x * 0.08, z * 0.08) * 1.6;
    return h - 6;
  }

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const h = heightAt(x, z);
    pos.setY(i, h);
  }
  geo.computeVertexNormals();
  const nrm = geo.attributes.normal;
  for (let i = 0; i < pos.count; i++) {
    const h = pos.getY(i), slope = 1 - nrm.getY(i);
    const snowLine = 30 + noise(pos.getX(i) * 0.05, pos.getZ(i) * 0.05) * 8;
    if (h > snowLine && slope < 0.55) tmp.copy(cSnow);
    else if (h > snowLine - 6 && slope < 0.4) tmp.copy(cRock).lerp(cSnow, 0.6);
    else if (h < 1.5) tmp.copy(cValley).lerp(cDry, Math.min(1, Math.max(0, noise(pos.getX(i) * .04, pos.getZ(i) * .04) + .5)));
    else tmp.copy(cRock).lerp(cRockDark, Math.min(1, slope * 1.6));
    colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const terrain = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0, flatShading: false }));
  terrain.position.z = -40;
  scene.add(terrain);

  /* ---------- Glacial lake ---------- */
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(SIZE, SIZE, 1, 1).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: "#2F7F8C", roughness: 0.08, metalness: 0.55, transparent: true, opacity: 0.9 })
  );
  water.position.set(0, -2.2, -40);
  scene.add(water);

  /* ---------- Light ---------- */
  scene.add(new THREE.HemisphereLight("#CFE6F0", "#3B2F28", 0.75));
  const sun = new THREE.DirectionalLight("#FFD2A1", 1.6);
  sun.position.set(-80, 70, -60);
  scene.add(sun);
  const fill = new THREE.DirectionalLight("#9FC3D6", 0.35);
  fill.position.set(60, 40, 80);
  scene.add(fill);

  /* ---------- Sun glow sprite ---------- */
  const glowCanvas = document.createElement("canvas"); glowCanvas.width = glowCanvas.height = 256;
  const g = glowCanvas.getContext("2d"), grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "rgba(255,236,200,1)"); grd.addColorStop(.25, "rgba(255,200,130,.55)"); grd.addColorStop(1, "rgba(255,190,120,0)");
  g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, depthWrite: false, fog: false }));
  glow.scale.set(90, 90, 1); glow.position.set(-70, 42, -250);
  scene.add(glow);

  /* ---------- Drifting snow ---------- */
  const COUNT = 900;
  const flakes = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) { flakes[i * 3] = (Math.random() - .5) * 160; flakes[i * 3 + 1] = Math.random() * 60; flakes[i * 3 + 2] = (Math.random() - .5) * 160 - 20; }
  const snowGeo = new THREE.BufferGeometry(); snowGeo.setAttribute("position", new THREE.BufferAttribute(flakes, 3));
  const snow = new THREE.Points(snowGeo, new THREE.PointsMaterial({ color: "#ffffff", size: 0.35, transparent: true, opacity: 0.85, depthWrite: false }));
  scene.add(snow);

  /* ---------- Interaction ---------- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (e) => { mouse.tx = e.clientX / innerWidth - .5; mouse.ty = e.clientY / innerHeight - .5; }, { passive: true });
  // Tilt a phone to look around
  window.addEventListener("deviceorientation", (e) => {
    if (e.gamma == null) return;
    mouse.tx = Math.max(-.5, Math.min(.5, e.gamma / 60)); mouse.ty = Math.max(-.5, Math.min(.5, (e.beta - 45) / 90));
  }, { passive: true });

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 700 ? 62 : 50;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  let visible = true;
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(host);

  const clock = new THREE.Clock();
  const look = new THREE.Vector3();
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();
    const scroll = Math.min(1, window.scrollY / innerHeight);
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    const drift = reduceMotion ? 0 : t;
    camera.position.set(
      Math.sin(drift * 0.05) * 10 + mouse.x * 18,
      16 + mouse.y * -6 + scroll * 14,
      58 - scroll * 45 - (reduceMotion ? 0 : Math.sin(drift * 0.03) * 6)
    );
    look.set(mouse.x * 30, 14 - scroll * 4, -120);
    camera.lookAt(look);

    if (!reduceMotion) {
      const p = snowGeo.attributes.position;
      for (let i = 0; i < COUNT; i++) {
        let y = p.getY(i) - 0.05 - (i % 5) * 0.01;
        if (y < -2) y = 60;
        p.setY(i, y);
        p.setX(i, p.getX(i) + Math.sin(t * 0.6 + i) * 0.02);
      }
      p.needsUpdate = true;
      water.material.opacity = 0.86 + Math.sin(t * 1.3) * 0.04;
    }
    renderer.render(scene, camera);
  }
  frame();
  requestAnimationFrame(() => host.classList.add("ready"));
})();
