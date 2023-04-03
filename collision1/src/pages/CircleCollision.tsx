import CircleCollisionSection from "../components/CircleCollisionSection";
import {
  selectConfigIdArr,
  useCircleConfigStore,
} from "../stores/circleConfig";

export default function CircleCollision() {
  const ids = useCircleConfigStore(selectConfigIdArr);

  return (
    <div>
      {ids.map((id) => (
        <CircleCollisionSection key={id} id={id} />
      ))}
    </div>
  );
}
