import { Composition } from "remotion";
import { AiAgentOpening } from "./AiAgentOpening";

export const RemotionRoot = () => {
  return (
    <Composition
      id="AiAgentOpening"
      component={AiAgentOpening}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
