import { STAT_KEYS, STAT_META } from "../game/constants.js";

export default function StatusBars({ state }) {
  return (
    <div className="stats">
      {STAT_KEYS.map((k) => {
        const m = STAT_META[k];
        return (
          <div key={k}>
            {m.icon} {m.label}
            <div className="bar" style={{ color: m.color }}>
              <i style={{ width: `${state[k]}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
