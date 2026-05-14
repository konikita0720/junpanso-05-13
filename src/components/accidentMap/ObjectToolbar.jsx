import { OBJECT_TYPES } from "../../data/objectTypes";

export default function ObjectToolbar({ onAddObject }) {
  return (
    <div className="object-toolbar">
      {Object.entries(OBJECT_TYPES).map(([type, info]) => (
        <button key={type} onClick={() => onAddObject(type)}>
          {info.icon} {info.label} 추가
        </button>
      ))}
    </div>
  );
}