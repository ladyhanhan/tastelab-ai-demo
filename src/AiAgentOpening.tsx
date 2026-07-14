import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { DoubleSide, Shape } from "three";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "./loadFonts";

const black = "#030303";
const bone = "#F7F2E8";
const yellow = "#FCC307";
const cobalt = "#1237FF";
const cyan = "#98F4EA";
const violet = "#8B6BFF";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

const seconds = (value: number, fps: number) => value * fps;

const progress = (frame: number, fps: number, start: number, duration: number) =>
  interpolate(frame, [seconds(start, fps), seconds(start + duration, fps)], [0, 1], {
    ...clamp,
    easing: easeOut,
  });

type Vector3 = [number, number, number];

type BlockKind = "recipe" | "heat" | "vision" | "route" | "taste";

type BlockModule = {
  accent: string;
  color: string;
  delay: number;
  kind: BlockKind;
  position: Vector3;
  rotation: Vector3;
  scale: number;
  size: Vector3;
};

const blocks: BlockModule[] = [
  {
    accent: yellow,
    color: bone,
    delay: 0.62,
    kind: "recipe",
    position: [-1.78, 0.55, 0.18],
    rotation: [0.2, -0.58, -0.14],
    scale: 1.03,
    size: [1.38, 0.6, 0.4],
  },
  {
    accent: violet,
    color: "#101010",
    delay: 0.78,
    kind: "vision",
    position: [1.52, 0.72, -0.1],
    rotation: [-0.12, 0.72, 0.2],
    scale: 1.02,
    size: [1.12, 0.7, 0.46],
  },
  {
    accent: bone,
    color: yellow,
    delay: 0.95,
    kind: "heat",
    position: [-0.72, -0.8, 0.42],
    rotation: [-0.24, 0.4, -0.28],
    scale: 0.88,
    size: [1, 0.5, 0.36],
  },
  {
    accent: cyan,
    color: cobalt,
    delay: 1.08,
    kind: "route",
    position: [1.12, -0.7, 0.34],
    rotation: [0.18, -0.62, 0.4],
    scale: 0.92,
    size: [0.9, 0.9, 0.34],
  },
  {
    accent: yellow,
    color: "#151515",
    delay: 1.18,
    kind: "taste",
    position: [0.02, 1.3, -0.5],
    rotation: [0.24, 0.2, 0.08],
    scale: 1,
    size: [1.48, 0.44, 0.34],
  },
];

const signalDots = Array.from({ length: 132 }, (_, index) => {
  const columns = 22;
  const col = index % columns;
  const row = Math.floor(index / columns);
  const normalizedCol = col - (columns - 1) / 2;
  const normalizedRow = row - 2.5;
  const phase = index * 0.41;
  const distance = Math.hypot(normalizedCol / 11, normalizedRow / 3);

  return {
    alpha: Math.max(0.1, 0.62 - distance * 0.34),
    color: index % 7 === 0 ? yellow : index % 5 === 0 ? cyan : bone,
    phase,
    size: 0.008 + ((index * 17) % 5) * 0.002,
    x: normalizedCol * 0.27,
    y: normalizedRow * 0.22,
    z: Math.sin(col * 0.55 + row * 0.7) * 0.12,
  };
});

const orbitLayers = [
  {
    arc: Math.PI * 1.72,
    color: yellow,
    offset: 0.2,
    opacity: 0.5,
    position: [0, 0.02, 0.08] as Vector3,
    radius: 1.52,
    rotation: [0.66, -0.48, 0.2] as Vector3,
    speed: 92,
    tube: 0.0075,
  },
  {
    arc: Math.PI * 1.35,
    color: cyan,
    offset: 1.8,
    opacity: 0.36,
    position: [0.02, -0.02, -0.18] as Vector3,
    radius: 1.66,
    rotation: [1.08, 0.28, -0.48] as Vector3,
    speed: 104,
    tube: 0.0055,
  },
  {
    arc: Math.PI * 1.08,
    color: bone,
    offset: 2.7,
    opacity: 0.28,
    position: [-0.02, 0.05, 0.22] as Vector3,
    radius: 1.36,
    rotation: [0.18, 0.92, 1.24] as Vector3,
    speed: 118,
    tube: 0.0045,
  },
  {
    arc: Math.PI * 0.78,
    color: "#FFFFFF",
    offset: 3.9,
    opacity: 0.22,
    position: [0.03, 0.08, 0.42] as Vector3,
    radius: 1.1,
    rotation: [1.36, -0.24, 0.66] as Vector3,
    speed: 86,
    tube: 0.0038,
  },
];

const glassGlints = [
  {
    arc: Math.PI * 0.58,
    color: "#FFFFFF",
    offset: 0.3,
    opacity: 0.64,
    position: [-0.38, 0.48, 1.02] as Vector3,
    radius: 0.44,
    rotation: [0.38, -0.68, -0.5] as Vector3,
    scale: [1, 0.34, 1] as Vector3,
    tube: 0.008,
  },
  {
    arc: Math.PI * 0.42,
    color: cyan,
    offset: 1.6,
    opacity: 0.38,
    position: [0.55, -0.22, 0.96] as Vector3,
    radius: 0.34,
    rotation: [-0.25, 0.52, 0.78] as Vector3,
    scale: [1, 0.48, 1] as Vector3,
    tube: 0.006,
  },
  {
    arc: Math.PI * 0.5,
    color: yellow,
    offset: 2.4,
    opacity: 0.34,
    position: [0.18, 0.7, 0.72] as Vector3,
    radius: 0.26,
    rotation: [0.62, 0.12, 0.36] as Vector3,
    scale: [1, 0.42, 1] as Vector3,
    tube: 0.005,
  },
];

const innerLenses = [
  {
    color: cyan,
    opacity: 0.28,
    position: [-0.34, 0.14, 0.24] as Vector3,
    radius: 0.17,
    scale: [1.35, 0.82, 0.68] as Vector3,
  },
  {
    color: violet,
    opacity: 0.18,
    position: [0.3, -0.22, -0.1] as Vector3,
    radius: 0.22,
    scale: [0.86, 1.24, 0.78] as Vector3,
  },
  {
    color: yellow,
    opacity: 0.24,
    position: [0.12, 0.36, -0.28] as Vector3,
    radius: 0.1,
    scale: [1, 1, 1] as Vector3,
  },
];

const makeRoundedRectShape = (width: number, height: number, radius: number) => {
  const shape = new Shape();
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
};

const GlossMaterial = ({
  color,
  opacity = 1,
  roughness = 0.16,
}: {
  color: string;
  opacity?: number;
  roughness?: number;
}) => (
  <meshPhysicalMaterial
    clearcoat={1}
    clearcoatRoughness={0.07}
    color={color}
    metalness={0.04}
    opacity={opacity}
    roughness={roughness}
    transparent={opacity < 1}
  />
);

const GlowMaterial = ({
  color,
  opacity,
}: {
  color: string;
  opacity: number;
}) => (
  <meshBasicMaterial
    color={color}
    depthWrite={false}
    opacity={opacity}
    side={DoubleSide}
    toneMapped={false}
    transparent
  />
);

const RoundedBox = ({
  color,
  opacity = 1,
  position = [0, 0, 0],
  roughness = 0.16,
  size,
}: {
  color: string;
  opacity?: number;
  position?: Vector3;
  roughness?: number;
  size: Vector3;
}) => {
  const radius = Math.min(size[0], size[1]) * 0.18;
  const shape = React.useMemo(() => makeRoundedRectShape(size[0], size[1], radius), [radius, size]);
  const bevel = Math.min(radius * 0.48, size[2] * 0.18);
  const extrude = React.useMemo(
    () => ({
      bevelEnabled: true,
      bevelSegments: 8,
      bevelSize: bevel,
      bevelThickness: bevel,
      curveSegments: 14,
      depth: size[2],
      steps: 1,
    }),
    [bevel, size]
  );

  return (
    <mesh position={[position[0], position[1], position[2] - size[2] / 2]}>
      <extrudeGeometry args={[shape, extrude]} />
      <GlossMaterial color={color} opacity={opacity} roughness={roughness} />
    </mesh>
  );
};

const FaceLine = ({
  color,
  opacity,
  position,
  size,
}: {
  color: string;
  opacity: number;
  position: Vector3;
  size: Vector3;
}) => (
  <RoundedBox
    color={color}
    opacity={opacity}
    position={position}
    roughness={0.1}
    size={size}
  />
);

const FaceGlyph = ({
  accent,
  kind,
  opacity,
  size,
}: {
  accent: string;
  kind: BlockKind;
  opacity: number;
  size: Vector3;
}) => {
  const z = size[2] / 2 + 0.055;

  if (kind === "vision") {
    return (
      <group position={[0, 0, z]}>
        <mesh>
          <torusGeometry args={[0.17, 0.012, 14, 72]} />
          <GlowMaterial color={accent} opacity={opacity * 0.85} />
        </mesh>
        <mesh position={[0.01, 0, 0.004]}>
          <circleGeometry args={[0.045, 32]} />
          <GlowMaterial color={cyan} opacity={opacity * 0.72} />
        </mesh>
      </group>
    );
  }

  if (kind === "heat") {
    return (
      <group>
        {[-0.18, 0, 0.18].map((x, index) => (
          <FaceLine
            color={index === 1 ? bone : "#FFF0A4"}
            key={x}
            opacity={opacity * (index === 1 ? 0.9 : 0.58)}
            position={[x, 0, z]}
            size={[0.045, 0.28 - index * 0.035, 0.018]}
          />
        ))}
      </group>
    );
  }

  if (kind === "route") {
    return (
      <group position={[0, 0, z]}>
        {[-0.2, 0, 0.2].map((x, index) => (
          <mesh key={x} position={[x, index === 1 ? 0.12 : -0.1, 0]}>
            <circleGeometry args={[0.04, 28]} />
            <GlowMaterial color={index === 1 ? cyan : bone} opacity={opacity * 0.78} />
          </mesh>
        ))}
        <FaceLine
          color={accent}
          opacity={opacity * 0.72}
          position={[0, 0.01, 0.004]}
          size={[0.44, 0.026, 0.014]}
        />
      </group>
    );
  }

  if (kind === "taste") {
    return (
      <group>
        <FaceLine
          color={accent}
          opacity={opacity * 0.78}
          position={[-0.18, 0, z]}
          size={[0.34, 0.035, 0.018]}
        />
        <FaceLine
          color={bone}
          opacity={opacity * 0.55}
          position={[0.23, 0, z]}
          size={[0.16, 0.13, 0.018]}
        />
      </group>
    );
  }

  return (
    <group>
      {[-0.16, 0.02, 0.2].map((x, index) => (
        <FaceLine
          color={index === 0 ? accent : bone}
          key={x}
          opacity={opacity * (index === 0 ? 0.82 : 0.48)}
          position={[x, 0.04 - index * 0.08, z]}
          size={[0.26 - index * 0.04, 0.035, 0.018]}
        />
      ))}
    </group>
  );
};

const ConnectorPins = ({
  accent,
  opacity,
  size,
}: {
  accent: string;
  opacity: number;
  size: Vector3;
}) => (
  <group>
    {[-1, 1].map((side) =>
      [-0.12, 0.12].map((y) => (
        <mesh
          key={`${side}-${y}`}
          position={[side * (size[0] / 2 + 0.035), y, 0.02]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.038, 0.038, 0.07, 32]} />
          <GlossMaterial color={accent} opacity={opacity * 0.92} roughness={0.08} />
        </mesh>
      ))
    )}
  </group>
);

const ParameterBlock = ({
  block,
  frame,
  fps,
}: {
  block: BlockModule;
  frame: number;
  fps: number;
}) => {
  const enter = progress(frame, fps, block.delay, 1.2);
  if (enter <= 0.001) {
    return null;
  }

  const drift = Math.sin(frame / 38 + block.delay * 3) * 0.055;
  const moduleScale = block.scale * interpolate(enter, [0, 1], [0.46, 1], clamp);
  const opacity = Math.max(interpolate(enter, [0, 1], [0, 1], clamp), 0.001);
  const z = interpolate(enter, [0, 1], [0.9, 0], clamp);

  return (
    <group
      position={[block.position[0], block.position[1] + drift, block.position[2] + z]}
      rotation={[
        block.rotation[0],
        block.rotation[1] + interpolate(frame, [0, seconds(6, fps)], [-0.12, 0.2], clamp),
        block.rotation[2],
      ]}
      scale={moduleScale}
    >
      <RoundedBox color={block.color} opacity={opacity} roughness={0.13} size={block.size} />
      <RoundedBox
        color="#060606"
        opacity={opacity * 0.78}
        position={[0, 0, block.size[2] / 2 + 0.021]}
        roughness={0.06}
        size={[block.size[0] * 0.67, block.size[1] * 0.52, 0.035]}
      />
      <FaceGlyph accent={block.accent} kind={block.kind} opacity={opacity} size={block.size} />
      <ConnectorPins accent={block.accent} opacity={opacity} size={block.size} />
      <RoundedBox
        color={block.accent}
        opacity={opacity * 0.68}
        position={[-block.size[0] * 0.18, block.size[1] / 2 + 0.035, 0.03]}
        roughness={0.08}
        size={[block.size[0] * 0.35, 0.06, 0.06]}
      />
    </group>
  );
};

const DottedSignalField = ({ frame, fps }: { frame: number; fps: number }) => {
  const enter = progress(frame, fps, 0.08, 1.5);
  const breathe = Math.sin(frame / 26) * 0.5 + 0.5;

  return (
    <group position={[0, -0.88, -1.05]} rotation={[-0.34, 0, 0]}>
      {signalDots.map((dot, index) => {
        const shimmer = Math.sin(frame / 15 + dot.phase) * 0.5 + 0.5;
        const opacity = enter * (dot.alpha * 0.32 + shimmer * 0.16);

        return (
          <mesh
            key={index}
            position={[
              dot.x,
              dot.y + Math.sin(frame / 34 + dot.phase) * 0.024,
              dot.z + Math.cos(frame / 31 + dot.phase) * 0.034,
            ]}
            scale={1 + breathe * 0.22}
          >
            <sphereGeometry args={[dot.size, 8, 8]} />
            <GlowMaterial color={dot.color} opacity={opacity} />
          </mesh>
        );
      })}
    </group>
  );
};

const OrbitArc = ({
  arc,
  color,
  enter,
  frame,
  offset,
  opacity,
  position,
  radius,
  rotation,
  speed,
  tube,
}: {
  arc: number;
  color: string;
  enter: number;
  frame: number;
  offset: number;
  opacity: number;
  position: Vector3;
  radius: number;
  rotation: Vector3;
  speed: number;
  tube: number;
}) => {
  const pulse = Math.sin(frame / 19 + offset) * 0.5 + 0.5;

  return (
    <mesh
      position={position}
      rotation={[
        rotation[0] + Math.sin(frame / speed + offset) * 0.035,
        rotation[1] + Math.cos(frame / (speed * 0.9) + offset) * 0.04,
        rotation[2] + frame / (speed * 44),
      ]}
    >
      <torusGeometry args={[radius, tube, 14, 192, arc]} />
      <GlowMaterial color={color} opacity={enter * opacity * (0.72 + pulse * 0.28)} />
    </mesh>
  );
};

const GlassGlint = ({
  arc,
  color,
  enter,
  frame,
  offset,
  opacity,
  position,
  radius,
  rotation,
  scale,
  tube,
}: {
  arc: number;
  color: string;
  enter: number;
  frame: number;
  offset: number;
  opacity: number;
  position: Vector3;
  radius: number;
  rotation: Vector3;
  scale: Vector3;
  tube: number;
}) => {
  const shimmer = Math.sin(frame / 13 + offset) * 0.5 + 0.5;

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <torusGeometry args={[radius, tube, 12, 96, arc]} />
      <GlowMaterial color={color} opacity={enter * opacity * (0.68 + shimmer * 0.32)} />
    </mesh>
  );
};

const LensBubble = ({
  color,
  enter,
  frame,
  opacity,
  position,
  radius,
  scale,
}: {
  color: string;
  enter: number;
  frame: number;
  opacity: number;
  position: Vector3;
  radius: number;
  scale: Vector3;
}) => {
  const shimmer = Math.sin(frame / 21 + position[0] * 5) * 0.5 + 0.5;

  return (
    <mesh
      position={[
        position[0],
        position[1] + Math.sin(frame / 36 + position[2]) * 0.018,
        position[2],
      ]}
      scale={scale}
    >
      <sphereGeometry args={[radius, 48, 48]} />
      <meshPhysicalMaterial
        clearcoat={1}
        clearcoatRoughness={0}
        color={color}
        depthWrite={false}
        ior={1.5}
        metalness={0}
        opacity={enter * opacity * (0.78 + shimmer * 0.22)}
        roughness={0}
        thickness={0.65}
        transmission={0.62}
        transparent
      />
    </mesh>
  );
};

const GlassCore = ({ frame, fps }: { frame: number; fps: number }) => {
  const enter = progress(frame, fps, 0.16, 1.45);
  if (enter <= 0.001) {
    return null;
  }

  const breathe = Math.sin(frame / 34) * 0.5 + 0.5;
  const rotate = interpolate(frame, [0, seconds(6, fps)], [-0.32, 0.46], {
    ...clamp,
    easing: easeInOut,
  });

  return (
    <group
      position={[0, -0.04, 0.04]}
      rotation={[0.16, rotate, -0.05]}
      scale={interpolate(enter, [0, 1], [0.64, 1], clamp)}
    >
      {orbitLayers.map((orbit) => (
        <OrbitArc
          {...orbit}
          enter={enter}
          frame={frame}
          key={`${orbit.color}-${orbit.radius}-${orbit.offset}`}
        />
      ))}
      <mesh>
        <sphereGeometry args={[1.28 + breathe * 0.035, 128, 128]} />
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0}
          color="#FFF9EB"
          depthWrite={false}
          ior={1.52}
          metalness={0}
          opacity={0.3 * enter}
          roughness={0}
          specularIntensity={1}
          thickness={2.6}
          transmission={0.86}
          transparent
        />
      </mesh>
      <mesh scale={1.035}>
        <sphereGeometry args={[1.29, 96, 96]} />
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0}
          color="#FFFFFF"
          depthWrite={false}
          ior={1.4}
          metalness={0}
          opacity={0.085 * enter}
          roughness={0}
          thickness={0.35}
          transmission={0.9}
          transparent
        />
      </mesh>
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[1.3, 64, 64]} />
        <meshBasicMaterial
          color={cyan}
          depthWrite={false}
          opacity={0.035 * enter}
          transparent
          wireframe
        />
      </mesh>
      {innerLenses.map((lens) => (
        <LensBubble
          {...lens}
          enter={enter}
          frame={frame}
          key={`${lens.color}-${lens.position.join("-")}`}
        />
      ))}
      <mesh position={[0, -0.02, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.56, 0.46, 0.05, 112]} />
        <meshPhysicalMaterial
          clearcoat={1}
          color={violet}
          depthWrite={false}
          ior={1.42}
          opacity={0.16 * enter}
          roughness={0}
          thickness={0.5}
          transmission={0.42}
          transparent
        />
      </mesh>
      <mesh position={[0.02, -0.02, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.57, 0.013, 16, 128]} />
        <GlowMaterial color={yellow} opacity={0.74 * enter} />
      </mesh>
      <mesh position={[-0.28, 0.38, 0.96]}>
        <sphereGeometry args={[0.035, 24, 24]} />
        <GlowMaterial color="#FFFFFF" opacity={0.74 * enter} />
      </mesh>
      <mesh position={[0.5, -0.1, 0.86]}>
        <sphereGeometry args={[0.025, 20, 20]} />
        <GlowMaterial color={cyan} opacity={0.5 * enter} />
      </mesh>
      {glassGlints.map((glint) => (
        <GlassGlint
          {...glint}
          enter={enter}
          frame={frame}
          key={`${glint.color}-${glint.position.join("-")}`}
        />
      ))}
    </group>
  );
};

const Sculpture = ({ frame, fps }: { frame: number; fps: number }) => {
  const clusterIn = progress(frame, fps, 0.08, 1.9);
  const rotateY = interpolate(frame, [0, seconds(6, fps)], [-0.28, 0.38], {
    ...clamp,
    easing: easeInOut,
  });
  const rotateX = interpolate(frame, [0, seconds(6, fps)], [0.12, -0.08], clamp);

  return (
    <group
      position={[0, -0.12, 0]}
      rotation={[rotateX, rotateY, -0.035]}
      scale={interpolate(clusterIn, [0, 1], [0.74, 1], clamp)}
    >
      <DottedSignalField frame={frame} fps={fps} />
      <GlassCore frame={frame} fps={fps} />
      {blocks.map((block) => (
        <ParameterBlock
          block={block}
          frame={frame}
          fps={fps}
          key={`${block.kind}-${block.delay}`}
        />
      ))}
    </group>
  );
};

const Scene3D = ({ frame, fps }: { frame: number; fps: number }) => {
  const { height, width } = useVideoConfig();
  const cameraZ = interpolate(frame, [0, seconds(6, fps)], [8.3, 6.25], {
    ...clamp,
    easing: easeInOut,
  });

  return (
    <AbsoluteFill>
      <ThreeCanvas
        camera={{ fov: 34, position: [0, 0.1, cameraZ] }}
        height={height}
        shadows
        width={width}
      >
        <color args={[black]} attach="background" />
        <ambientLight intensity={0.46} />
        <directionalLight intensity={2.2} position={[3.6, 4.2, 3.8]} />
        <directionalLight color="#FFFFFF" intensity={1.05} position={[-4.2, 1.8, 4.8]} />
        <pointLight color={yellow} intensity={62} position={[2.8, -1.1, 2.6]} />
        <pointLight color={cyan} intensity={32} position={[-2.9, 1.7, 2.1]} />
        <pointLight color={violet} intensity={22} position={[0, 1.9, 1.8]} />
        <pointLight color="#FFFFFF" intensity={24} position={[-0.8, 1.1, 2.2]} />
        <spotLight
          angle={0.36}
          color="#FFFFFF"
          intensity={18}
          penumbra={0.85}
          position={[-1.6, 1.8, 3.4]}
        />
        <Sculpture frame={frame} fps={fps} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

const CleanBackground = ({ frame, fps }: { frame: number; fps: number }) => {
  const bloom = progress(frame, fps, 0.02, 1.9);
  const drift = interpolate(frame, [0, seconds(6, fps)], [-14, 18], clamp);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 48% 42%, rgba(247,242,232,0.08), rgba(247,242,232,0) 32%), radial-gradient(circle at 62% 58%, rgba(252,195,7,0.12), rgba(252,195,7,0) 30%), radial-gradient(circle at 36% 35%, rgba(152,244,234,0.1), rgba(152,244,234,0) 28%), #030303",
      }}
    >
      <div
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(247,242,232,0.26) 0 1px, transparent 1.5px)",
          backgroundPosition: `${drift}px ${drift * 0.5}px`,
          backgroundSize: "38px 38px",
          inset: 0,
          maskImage:
            "radial-gradient(circle at 50% 47%, rgba(0,0,0,0.85), rgba(0,0,0,0.16) 42%, transparent 70%)",
          opacity: 0.08 + bloom * 0.08,
          position: "absolute",
        }}
      />
      <div
        style={{
          background:
            "linear-gradient(118deg, transparent 0%, rgba(152,244,234,0.04) 38%, rgba(255,255,255,0.08) 51%, rgba(252,195,7,0.05) 63%, transparent 100%)",
          inset: 0,
          opacity: 0.16 + bloom * 0.1,
          position: "absolute",
          transform: `translateX(${drift}px)`,
        }}
      />
      <div
        style={{
          boxShadow: "inset 0 0 190px rgba(0,0,0,0.9)",
          inset: 0,
          position: "absolute",
        }}
      />
    </AbsoluteFill>
  );
};

const BrandLockup = ({ frame, fps }: { frame: number; fps: number }) => {
  const enter = progress(frame, fps, 4.45, 0.95);
  const y = interpolate(enter, [0, 1], [18, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        color: bone,
        fontFamily: '"OPPO Sans", sans-serif',
        opacity: enter,
        transform: `translateY(${y}px)`,
      }}
    >
      <Img
        src={staticFile("assets/botinkit-logo-reverse.png")}
        style={{
          height: "auto",
          left: 72,
          opacity: 0.88,
          position: "absolute",
          top: 68,
          width: 164,
        }}
      />
      <div
        style={{
          bottom: 86,
          left: 72,
          position: "absolute",
        }}
      >
        <div
          style={{
            fontSize: 82,
            fontWeight: 800,
            letterSpacing: 0,
            lineHeight: 0.92,
            textShadow: "0 18px 48px rgba(0,0,0,0.48)",
          }}
        >
          TasteLab AI
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AiAgentOpening = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const finalHold = interpolate(frame, [seconds(5.65, fps), seconds(6, fps)], [1, 0.97], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: black,
        opacity: finalHold,
        overflow: "hidden",
      }}
    >
      <CleanBackground frame={frame} fps={fps} />
      <Scene3D frame={frame} fps={fps} />
      <BrandLockup frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
