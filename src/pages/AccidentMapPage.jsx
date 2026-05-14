import { useState } from "react";
import AccidentMapCanvas from "../components/accidentMap/AccidentMapCanvas";
import ObjectToolbar from "../components/accidentMap/ObjectToolbar";
import "../styles/AccidentMap.css";

export default function AccidentMapPage() {
  const [objects, setObjects] = useState([]);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [isPositionFixed, setIsPositionFixed] = useState(false);

  const togglePositionMode = () => {
  setIsPositionFixed((prev) => !prev);

  if (isPositionFixed) {
    setObjects((prev) =>
      prev.map((obj) => ({
        ...obj,
        path: [],
      }))
    );
  }
};

  const addObject = (type) => {
    const newObject = {
      id: Date.now().toString(),
      type,
      x: 200,
      y: 200,
      path: [],
    };

    setObjects((prev) => [...prev, newObject]);
    setSelectedObjectId(newObject.id);
  };

const updateObjectPosition = (id, x, y, isRecording, elapsed = 0) => {
  setObjects((prev) =>
    prev.map((obj) => {
      if (obj.id !== id) return obj;

      let newPath = obj.path;

      if (isRecording && isPositionFixed) {
        const lastPoint = obj.path[obj.path.length - 1];

        if (!lastPoint || lastPoint.x !== x || lastPoint.y !== y) {
          const newPoint = { time: elapsed, x, y };

          newPath = [...obj.path, newPoint].filter(
            (point) => elapsed - point.time <= 5000
          );
        }
      }

      return {
        ...obj,
        x,
        y,
        path: newPath,
      };
    })
  );
};

  const removeObject = (id) => {
    setObjects((prev) => prev.filter((obj) => obj.id !== id));

    if (selectedObjectId === id) {
      setSelectedObjectId(null);
    }
  };

  const playPaths = () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setPlayTime(0);

    const normalizedObjects = objects.map((obj) => {
      if (obj.path.length === 0) return obj;

      const startTime = obj.path[0].time;

      return {
        ...obj,
        path: obj.path.map((point) => ({
          ...point,
          time: point.time - startTime,
        })),
      };
    });

    const startPlayTime = Date.now();

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startPlayTime;
      setPlayTime(elapsed);

      setObjects((prev) =>
        prev.map((obj) => {
          const target = normalizedObjects.find((item) => item.id === obj.id);

          if (!target || target.path.length === 0) return obj;

          const currentPoint = target.path.findLast(
            (point) => point.time <= elapsed
          );

          if (!currentPoint) return obj;

          return {
            ...obj,
            x: currentPoint.x,
            y: currentPoint.y,
          };
        })
      );

      if (elapsed >= 5000) {
        clearInterval(intervalId);
        setIsPlaying(false);
        setPlayTime(0);
      }
    }, 30);
  };

  return (
    <div className="accident-map-page">
      <h2>사고 상황 약도 만들기</h2>

      <ObjectToolbar onAddObject={addObject} />
<button onClick={togglePositionMode}>
  {isPositionFixed ? "위치 재설정" : "위치 설정 완료"}
</button>
      <div className="map-control-buttons">
        <button onClick={playPaths} disabled={isPlaying}>
          {isPlaying ? "재생 중..." : "재생"}
        </button>
      </div>

<AccidentMapCanvas
  objects={objects}
  selectedObjectId={selectedObjectId}
  isPlaying={isPlaying}
  playTime={playTime}
  isPositionFixed={isPositionFixed}
  onSelectObject={setSelectedObjectId}
  onMoveObject={updateObjectPosition}
  onRemoveObject={removeObject}
/>
    </div>
  );
}