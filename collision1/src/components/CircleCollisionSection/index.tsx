import { useToggle } from "../../hooks";
import { useCircleConfigStore } from "../../stores/circleConfig";
import CircleArea from "../CircleArea/CircleArea";
import SettingCard from "../SettingCard";

export default function CircleCollisionSection() {
  const oneConfigs = useCircleConfigStore((state) => state.configs)[0];
  const configs = oneConfigs.config;
  const [isPlay, togglePlay] = useToggle();

  return (
    <div style={{ position: "relative" }}>
      <SettingCard isPlay={isPlay} togglePlay={togglePlay} />
      <CircleArea
        id={oneConfigs.id}
        height={configs.height}
        width={configs.width}
        bgColor="#eee"
        circleManager={oneConfigs.managers.circles}
        isPlay={isPlay}
      />
    </div>
  );
}
