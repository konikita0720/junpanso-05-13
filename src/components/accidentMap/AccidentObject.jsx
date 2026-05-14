import { useRef } from "react";
import { OBJECT_TYPES } from "../../data/objectTypes";

export default function AccidentObject({
  object,
  isSelected,
  isPositionFixed,
  onSelectObject,
  onMoveObject,
  onRemoveObject,
  setIsOverTrash,
}) {
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const startTimeRef = useRef(0);
  const pathStartTimeRef = useRef(0);

  const getCanvasRect = () => {
    const canvas = document.querySelector(".accident-map-canvas");

    if (!canvas) return null;

    return canvas.getBoundingClientRect();
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();

    const canvasRect = getCanvasRect();
    if (!canvasRect) return;

    draggingRef.current = true;
    onSelectObject(object.id);

    offsetRef.current = {
      x: e.clientX - canvasRect.left - object.x,
      y: e.clientY - canvasRect.top - object.y,
    };

    startTimeRef.current = Date.now();

    const lastPoint = object.path[object.path.length - 1];
    pathStartTimeRef.current = lastPoint ? lastPoint.time : 0;

    onMoveObject(
      object.id,
      object.x,
      object.y,
      isPositionFixed,
      pathStartTimeRef.current
    );

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;

    const canvasRect = getCanvasRect();
    if (!canvasRect) return;

    const newX = e.clientX - canvasRect.left - offsetRef.current.x;
    const newY = e.clientY - canvasRect.top - offsetRef.current.y;

    const elapsed =
      pathStartTimeRef.current + (Date.now() - startTimeRef.current);

    onMoveObject(object.id, newX, newY, isPositionFixed, elapsed);

    const trash = document.querySelector(".trash-zone");

    if (trash) {
      const rect = trash.getBoundingClientRect();

      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      setIsOverTrash(isInside);
    }
  };

  const handleMouseUp = (e) => {
    draggingRef.current = false;

    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    const trash = document.querySelector(".trash-zone");

    if (trash) {
      const rect = trash.getBoundingClientRect();

      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInside) {
        onRemoveObject(object.id);
      }
    }

    setIsOverTrash(false);
  };

  return (
    <div
      className={`accident-object ${isSelected ? "selected" : ""}`}
      style={{
        left: object.x,
        top: object.y,
      }}
      onMouseDown={handleMouseDown}
    >
      {OBJECT_TYPES[object.type].icon}
    </div>
  );
}