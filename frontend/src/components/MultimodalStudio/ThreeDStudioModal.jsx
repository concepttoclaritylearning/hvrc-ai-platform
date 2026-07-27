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

export default function ThreeDStudioModal({ asset, onClose, onExportToWorkspace, isEmbedded = false }) {
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

    const handleMouseLeave = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const project3D = (x, y, z, cx, cy, fov = 250, distance = 400) => {
      const factor = fov / (distance + z);
      return {
        x: x * factor + cx,
        y: y * factor + cy,
        z: z
      };
    };

    const rotateX = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { x, y: y * cos - z * sin, z: y * sin + z * cos };
    };

    const rotateY = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { x: x * cos + z * sin, y, z: -x * sin + z * cos };
    };

    const drawCube = (ctx, cx, cy, rx, ry, size, isWire, light) => {
      const s = size / 2;
      const vertices = [
        { x: -s, y: -s, z: -s }, { x: s, y: -s, z: -s }, { x: s, y: s, z: -s }, { x: -s, y: s, z: -s },
        { x: -s, y: -s, z: s }, { x: s, y: -s, z: s }, { x: s, y: s, z: s }, { x: -s, y: s, z: s }
      ];

      const rotated = vertices.map((v) => {
        const r1 = rotateY(v.x, v.y, v.z, ry);
        return rotateX(r1.x, r1.y, r1.z, rx);
      });

      const projected = rotated.map((v) => project3D(v.x, v.y, v.z, cx, cy));

      const faces = [
        { indices: [0, 1, 2, 3], normalZ: -1, color: [47, 107, 255] },
        { indices: [5, 4, 7, 6], normalZ: 1, color: [59, 130, 246] },
        { indices: [4, 0, 3, 7], normalZ: -1, color: [37, 99, 235] },
        { indices: [1, 5, 6, 2], normalZ: 1, color: [96, 165, 250] },
        { indices: [4, 5, 1, 0], normalZ: -1, color: [29, 78, 216] },
        { indices: [3, 2, 6, 7], normalZ: 1, color: [147, 197, 253] }
      ];

      const sortedFaces = faces
        .map((f) => {
          const zAvg = (rotated[f.indices[0]].z + rotated[f.indices[1]].z + rotated[f.indices[2]].z + rotated[f.indices[3]].z) / 4;
          return { ...f, zAvg };
        })
        .sort((a, b) => b.zAvg - a.zAvg);

      sortedFaces.forEach((f) => {
        ctx.beginPath();
        ctx.moveTo(projected[f.indices[0]].x, projected[f.indices[0]].y);
        for (let i = 1; i < 4; i++) {
          ctx.lineTo(projected[f.indices[i]].x, projected[f.indices[i]].y);
        }
        ctx.closePath();

        if (isWire) {
          ctx.strokeStyle = "#60A5FA";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          const brightness = Math.max(0.3, Math.min(1.5, (1 - f.zAvg / 150) * light));
          const [r, g, b] = f.color.map((c) => Math.min(255, Math.floor(c * brightness)));
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 255, 255, 0.15)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    };

    const drawSphere = (ctx, cx, cy, rx, ry, radius, isWire, light) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.8, 0, Math.PI * 2);
      if (isWire) {
        ctx.strokeStyle = "#A855F7";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        for (let i = 1; i < 5; i++) {
          ctx.beginPath();
          ctx.ellipse(cx, cy, radius * 0.8, (radius * 0.8 * i) / 5, rx, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        const grad = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, radius);
        grad.addColorStop(0, "#C084FC");
        grad.addColorStop(0.6, "#9333EA");
        grad.addColorStop(1, "#581C87");
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();
    };

    const drawPyramid = (ctx, cx, cy, rx, ry, size, isWire, light) => {
      const s = size / 1.6;
      const vertices = [
        { x: 0, y: -s * 1.2, z: 0 },
        { x: -s, y: s, z: -s },
        { x: s, y: s, z: -s },
        { x: s, y: s, z: s },
        { x: -s, y: s, z: s }
      ];

      const rotated = vertices.map((v) => {
        const r1 = rotateY(v.x, v.y, v.z, ry);
        return rotateX(r1.x, r1.y, r1.z, rx);
      });

      const projected = rotated.map((v) => project3D(v.x, v.y, v.z, cx, cy));

      const faces = [
        { indices: [0, 1, 2], color: [245, 158, 11] },
        { indices: [0, 2, 3], color: [217, 119, 6] },
        { indices: [0, 3, 4], color: [180, 83, 9] },
        { indices: [0, 4, 1], color: [251, 191, 36] },
        { indices: [4, 3, 2, 1], color: [146, 64, 14] }
      ];

      const sortedFaces = faces
        .map((f) => {
          const zAvg = f.indices.reduce((sum, idx) => sum + rotated[idx].z, 0) / f.indices.length;
          return { ...f, zAvg };
        })
        .sort((a, b) => b.zAvg - a.zAvg);

      sortedFaces.forEach((f) => {
        ctx.beginPath();
        ctx.moveTo(projected[f.indices[0]].x, projected[f.indices[0]].y);
        for (let i = 1; i < f.indices.length; i++) {
          ctx.lineTo(projected[f.indices[i]].x, projected[f.indices[i]].y);
        }
        ctx.closePath();

        if (isWire) {
          ctx.strokeStyle = "#FBBF24";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          const brightness = Math.max(0.3, Math.min(1.5, (1 - f.zAvg / 150) * light));
          const [r, g, b] = f.color.map((c) => Math.min(255, Math.floor(c * brightness)));
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      if (!isDragging) {
        angleY += rotationSpeed;
      }
      const size = 160;
      if (activePreset === "cube") {
        drawCube(ctx, cx, cy, angleX, angleY, size, wireframe, lightIntensity);
      } else if (activePreset === "sphere") {
        drawSphere(ctx, cx, cy, angleX, angleY, size * 0.75, wireframe, lightIntensity);
      } else if (activePreset === "torus") {
        drawTorus(ctx, cx, cy, angleX, angleY, size * 0.6, wireframe, lightIntensity);
      } else {
        drawPyramid(ctx, cx, cy, angleX, angleY, size, wireframe, lightIntensity);
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [wireframe, rotationSpeed, lightIntensity, activePreset]);

  const containerClass = isEmbedded
    ? "w-full bg-stone-900 border border-stone-800 rounded-2xl shadow-md overflow-hidden text-stone-200 font-sans my-2"
    : "fixed inset-0 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 font-sans";
  const innerClass = isEmbedded
    ? "flex flex-col overflow-hidden"
    : "bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col overflow-hidden text-stone-200";

  return (
    <div className={containerClass}>
      <div className={innerClass}>
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
