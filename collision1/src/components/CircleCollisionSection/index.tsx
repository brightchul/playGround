import { useToggle } from "../../hooks";
import {
  selectConfigsById,
  useCircleConfigStore,
} from "../../stores/circleConfig";
import CircleArea from "../CircleArea/CircleArea";
import SettingCard from "../SettingCard";

interface CircleCollisionSectionProps {
  id: string;
}

export default function CircleCollisionSection({
  id,
}: CircleCollisionSectionProps) {
  const { managers, config } = useCircleConfigStore(selectConfigsById(id))!;

  const [isPlay, togglePlay] = useToggle();

  return (
    <div style={{ position: "relative" }}>
      <SettingCard isPlay={isPlay} togglePlay={togglePlay} />
      <CircleArea
        id={id}
        height={config.height}
        width={config.width}
        bgColor="#eee"
        circleManager={managers.circles}
        isPlay={isPlay}
      />
    </div>
  );
}
