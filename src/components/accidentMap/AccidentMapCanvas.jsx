import AccidentObject from "./AccidentObject";
import { useState } from "react";

export default function AccidentMapCanvas({
  objects,
  selectedObjectId,
  isPlaying,
  playTime,
  isPositionFixed,
  onSelectObject,
  onMoveObject,
  onRemoveObject,
}) {
  const [isOverTrash, setIsOverTrash] = useState(false);

  const getDisplayPath = (obj) => {
    if (!isPlaying || obj.path.length === 0) {
      return obj.path;
    }

    const startTime = obj.path[0].time;

    return obj.path.filter((point) => point.time - startTime <= playTime);
  };

  return (
    <div className="accident-map-canvas">
<div className="intersection-bg">
  <div className="lane-line horizontal" />
  <div className="lane-line vertical" />
</div>
      {objects.map((obj) => {
        const displayPath = getDisplayPath(obj);

        return displayPath.length > 1 ? (
          <svg key={`path-${obj.id}`} className="path-line">
            <polyline
              points={displayPath.map((p) => `${p.x},${p.y}`).join(" ")}
            />
          </svg>
        ) : null;
      })}

      {objects.map((obj) => (
        <AccidentObject
          key={obj.id}
          object={obj}
          isSelected={selectedObjectId === obj.id}
          isPositionFixed={isPositionFixed}
          onSelectObject={onSelectObject}
          onMoveObject={onMoveObject}
          onRemoveObject={onRemoveObject}
          setIsOverTrash={setIsOverTrash}
        />
      ))}

      <div className={`trash-zone ${isOverTrash ? "active" : ""}`}>🗑️</div>
    </div>
  );
}