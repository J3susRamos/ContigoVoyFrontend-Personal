import { CustomEventProps } from "./types/calendar.types";
import './styles/hide-label.css'

export default function CustomEvent({ event }: CustomEventProps) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        minWidth: 0,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#f59b41",
          marginRight: 8,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          display: "block",
          width: "100%",
        }}
      >
        {event.title}
      </span>
    </span>
  );
}