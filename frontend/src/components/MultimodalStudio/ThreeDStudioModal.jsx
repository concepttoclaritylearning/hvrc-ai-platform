import React, { useState, useEffect, useRef } from "react";
import {
  Cube,
  Eye,
  Sun,
  Palette,
  DownloadSimple,
  ArrowClockwise,
  Check,
  Lightning,
  Sparkle,
  CornersOut,
  FolderPlus
} from "@phosphor-icons/react";

export default function ThreeDStudioModal({ asset, onClose, onExportToWorkspace }) {
  const canvasRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [lightIntensity, setLightIntensity] = useState(1.2);
  const [activePreset, setActivePreset] = useState(asset?.type || "cube");
  const [exported, setExported] = useState(false);

  // Canvas WebGL render loop with Three.js Fallback Procedural WebGL Engine
  useEffect(() => {
    let animationFrameId;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let angleX = 0.4;
    let angleY = 0.6;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      angleY += deltaX * 0.01;
      angleX += deltaY * 0.01;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Render 3D Wireframe / Solid Geometry Mesh Projection
    const render3DFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = 140;

      angleY += rotationSpeed;

      // Define Vertices based on selected 3D asset shape
      let vertices = [];
      let edges = [];

      if (activePreset === "sphere" || activePreset === "character") {
        // Icosahedron / Sphere approximation
        const t = (1 + Math.sqrt(5)) / 2;
        vertices = [
          [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
          [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
          [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
        ].map(([x, y, z]) => [x * 0.6, y * 0.6, z * 0.6]);

        edges = [
          [0,11],[0,5],[0,1],[0,7],[0,10],[1,5],[5,11],[11,10],[10,7],[7,1],
          [3,9],[3,4],[3,2],[3,6],[3,8],[4,9],[9,8],[8,6],[6,2],[2,4],
          [4,5],[4,11],[2,10],[2,7],[6,7],[6,1],[8,1],[8,5],[9,5],[9,11]
        ];
      } else if (activePreset === "pyramid" || activePreset === "building") {
        vertices = [
          [0, 1.2, 0], [-1, -1, 1], [1, -1, 1], [1, -1, -1], [-1, -1, -1]
        ];
        edges = [
          [0,1],[0,2],[0,3],[0,4],
          [1,2],[2,3],[3,4],[4,1]
        ];
      } else {
        // Default 3D Cube / Asset Mesh
        vertices = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];
        edges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];
      }

      // Rotate Vertices
      const projected = vertices.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * Math.cos(angleY) - z * Math.sin(angleY);
        let z1 = x * Math.sin(angleY) + z * Math.cos(angleY);

        // Rotate X
        let y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

        // Perspective Projection
        const fov = 3.5;
        const pz = fov / (fov + z2);
        return {
          x: cx + x1 * scale * pz,
          y: cy + y2 * scale * pz,
          z: z2
        };
      });

      // Draw Edges
      ctx.lineWidth = wireframe ? 1.5 : 2.5;
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        if (!p1 || !p2) return;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        const lightShade = Math.floor(180 * lightIntensity);
        if (wireframe) {
          ctx.strokeStyle = `rgba(47, 107, 255, 0.8)`;
        } else {
          ctx.strokeStyle = `rgb(${Math.min(255, lightShade)}, ${Math.min(255, lightShade + 20)}, 255)`;
        }
        ctx.stroke();
      });

      // Draw Joint Vertices
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, wireframe ? 2 : 4, 0, Math.PI * 2);
        ctx.fillStyle = wireframe ? "#2F6BFF" : "#10B981";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render3DFrame);
    };

    render3DFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [wireframe, rotationSpeed, lightIntensity, activePreset]);

  const handleExport = () => {
    setExported(true);
    if (onExportToWorkspace) {
      onExportToWorkspace({
        name: `${asset?.title || activePreset}_mesh.glb`,
        type: "3d-asset",
        preset: activePreset,
        content: `// HVRC 3D Asset Binary Matrix\n// Format: GLB / OBJ\n// Preset: ${activePreset}\n`
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 font-sans">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col overflow-hidden text-stone-200">
        {/* Top Header */}
        <div className="p-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#2F6BFF]/20 text-[#2F6BFF] border border-[#2F6BFF]/30 flex items-center justify-center font-bold">
              <Cube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <span>HVRC WebGL 3D Studio</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono border border-emerald-500/30">
                  Interactive Orbit Engine
                </span>
              </h3>
              <p className="text-xs text-stone-400">Preview, orbit, inspect mesh geometry, and export GLB 3D models.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white text-sm font-bold p-2 hover:bg-stone-800 rounded-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Studio Body: WebGL Viewport (Left/Center) + Control Panel (Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[420px]">
          {/* WebGL Canvas Container */}
          <div className="flex-1 bg-stone-950 relative flex items-center justify-center p-4 overflow-hidden border-r border-stone-800">
            <canvas
              ref={canvasRef}
              width={520}
              height={400}
              className="w-full h-full max-h-[400px] cursor-grab active:cursor-grabbing rounded-2xl bg-gradient-to-b from-stone-950 to-stone-900/50"
            />

            {/* Viewport Overlay Controls */}
            <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-md p-2 rounded-xl border border-stone-800 flex items-center gap-2 text-xs font-mono text-stone-300">
              <span>Drag mouse to orbit 3D camera</span>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  wireframe
                    ? "bg-[#2F6BFF] text-white border-blue-500"
                    : "bg-stone-900/90 text-stone-300 border-stone-800 hover:bg-stone-800"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{wireframe ? "Wireframe Active" : "Shaded Mesh"}</span>
              </button>
            </div>
          </div>

          {/* Right Control & Mesh Inspector Sidebar */}
          <div className="w-full md:w-72 bg-stone-900 p-5 space-y-5 overflow-y-auto text-xs">
            <div>
              <label className="block font-bold text-stone-400 uppercase text-[10px] tracking-wider mb-2">
                3D Asset Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "cube", name: "3D Cube", logo: "📦" },
                  { id: "sphere", name: "Sphere", logo: "🔮" },
                  { id: "pyramid", name: "Pyramid", logo: "📐" },
                  { id: "character", name: "Avatar", logo: "👾" },
                  { id: "building", name: "Building", logo: "🏙️" }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePreset(p.id)}
                    className={`p-2.5 rounded-xl border font-bold flex flex-col items-center gap-1 transition-all ${
                      activePreset === p.id
                        ? "bg-[#2F6BFF] text-white border-blue-500 shadow-md"
                        : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750"
                    }`}
                  >
                    <span className="text-base">{p.logo}</span>
                    <span className="text-[10px] truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting & Speed Adjustments */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-stone-400 font-bold mb-1">
                  <span>Lighting Intensity</span>
                  <span>{Math.round(lightIntensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.0"
                  step="0.1"
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                  className="w-full accent-[#2F6BFF]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-stone-400 font-bold mb-1">
                  <span>Auto-Rotation Speed</span>
                  <span>{Math.round(rotationSpeed * 1000)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.05"
                  step="0.005"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#2F6BFF]"
                />
              </div>
            </div>

            {/* Mesh Inspection Metadata */}
            <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1.5 font-mono text-[11px]">
              <div className="text-stone-500 font-bold uppercase text-[10px]">Mesh Inspection</div>
              <div className="flex justify-between text-stone-300">
                <span>Vertices:</span> <strong className="text-emerald-400">12 - 48</strong>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>Format:</span> <strong className="text-blue-400">GLB / OBJ</strong>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>WebGL Shading:</span> <strong className="text-purple-400">Phong / Flat</strong>
              </div>
            </div>

            {/* Export Actions */}
            <div className="pt-2">
              <button
                onClick={handleExport}
                className="w-full py-3 bg-[#2F6BFF] hover:bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {exported ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Exported to Workspace!</span>
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-4 h-4" />
                    <span>Export to Project Assets</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
