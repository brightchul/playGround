import CircleCollisionSection from "../components/CircleCollisionSection";
import NewSettingSection from "../components/NewSettingSection";
import {
  selectConfigIdArr,
  useCircleConfigStore,
} from "../stores/circleConfig";

export default function CircleCollision() {
  const ids = useCircleConfigStore(selectConfigIdArr);

  return (
    <div>
      <NewSettingSection />
      <div className="mt-5 flex flex-wrap gap-5 w-full">
        {ids.map((id) => (
          <CircleCollisionSection key={id} id={id} />
        ))}
      </div>
    </div>
  );
}
