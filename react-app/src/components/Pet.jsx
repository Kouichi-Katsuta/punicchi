import { FORMS } from "../game/constants.js";
import { usePetImage } from "../game/petImages.js";

function Face({ sleeping, sad, cheeks }) {
  return (
    <>
      {cheeks && (
        <>
          <ellipse cx="33" cy="58" rx="5" ry="3" fill="#ff8fab" opacity=".6" />
          <ellipse cx="67" cy="58" rx="5" ry="3" fill="#ff8fab" opacity=".6" />
        </>
      )}
      {sleeping ? (
        <path d="M36 50 q5 4 10 0 M54 50 q5 4 10 0" stroke="#333" strokeWidth="2.5" fill="none" />
      ) : (
        <>
          <circle cx="41" cy="50" r="4" fill="#333" />
          <circle cx="59" cy="50" r="4" fill="#333" />
          <circle cx="42.5" cy="48.5" r="1.3" fill="#fff" />
          <circle cx="60.5" cy="48.5" r="1.3" fill="#fff" />
        </>
      )}
      {sleeping ? (
        <circle cx="50" cy="61" r="2" fill="#333" />
      ) : sad ? (
        <path d="M44 64 q6 -5 12 0" stroke="#333" strokeWidth="2.5" fill="none" />
      ) : (
        <path d="M44 60 q6 6 12 0" stroke="#333" strokeWidth="2.5" fill="none" />
      )}
    </>
  );
}

function Body({ form, c }) {
  switch (form) {
    case "baby":
      return <ellipse cx="50" cy="62" rx="26" ry="24" fill={c} />;
    case "childG":
      return (
        <>
          <ellipse cx="50" cy="58" rx="32" ry="30" fill={c} />
          <ellipse cx="28" cy="34" rx="7" ry="10" fill={c} />
          <ellipse cx="72" cy="34" rx="7" ry="10" fill={c} />
        </>
      );
    case "childB":
      return (
        <path
          d="M50 20 l8 14 l14 -6 l-2 14 l14 4 l-10 10 l8 12 l-14 2 l-2 14 l-16 -8 l-16 8 l-2 -14 l-14 -2 l8 -12 l-10 -10 l14 -4 l-2 -14 l14 6 z"
          fill={c}
        />
      );
    case "adultS":
      return (
        <>
          <path d="M14 40 q-6 -20 14 -14 q-2 14 6 18z M86 40 q6 -20 -14 -14 q2 14 -6 18z" fill="#ffd36e" />
          <ellipse cx="50" cy="58" rx="32" ry="32" fill={c} />
          <path d="M40 24 l4 -12 l6 10 l6 -10 l4 12" fill="#ffd36e" />
          <path d="M76 82 q16 4 14 -12" stroke={c} strokeWidth="8" fill="none" strokeLinecap="round" />
          <text x="50" y="86" fontSize="10" textAnchor="middle">✨</text>
        </>
      );
    case "adultG":
      return (
        <>
          <circle cx="30" cy="40" r="14" fill={c} />
          <circle cx="70" cy="40" r="14" fill={c} />
          <circle cx="50" cy="32" r="16" fill={c} />
          <ellipse cx="50" cy="60" rx="34" ry="30" fill={c} />
          <path d="M50 14 q4 -8 10 -6 q-2 8 -10 6" fill="#4caf50" />
        </>
      );
    case "adultB":
      return (
        <>
          <path d="M18 30 l10 18 M82 30 l-10 18" stroke={c} strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="50" cy="60" rx="32" ry="30" fill={c} />
          <path d="M22 86 q8 -6 14 0 q8 -6 14 0 q8 -6 14 0 q8 -6 14 0" fill={c} />
        </>
      );
    default:
      return null;
  }
}

function Egg({ c }) {
  return (
    <>
      <ellipse cx="50" cy="58" rx="28" ry="34" fill={c} stroke="#d9c38a" strokeWidth="3" />
      <path d="M30 55 l8 -6 l8 6 l8 -6 l8 6 l8 -6" stroke="#f0a35e" strokeWidth="3" fill="none" />
      <circle cx="42" cy="72" r="4" fill="#f6c96a" />
      <circle cx="60" cy="40" r="3" fill="#f6c96a" />
    </>
  );
}

// キャラクター本体。size を変えればずかん等でも使える
export default function Pet({ form, sleeping = false, sad = false, anim = null, className = "", size }) {
  const c = FORMS[form].color;
  const cls = ["pet", anim ?? (sleeping ? "" : "bounce"), className].filter(Boolean).join(" ");
  const mood = form === "egg" ? "normal" : sleeping ? "sleep" : sad ? "sad" : "normal";
  const imgUrl = usePetImage(form, mood); // public/pets/ に画像があればそちらを使う
  return (
    <svg viewBox="0 0 100 100" className={cls} style={size ? { width: size, height: size } : undefined}>
      {imgUrl ? (
        <image href={imgUrl} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMax meet" />
      ) : form === "egg" ? (
        <Egg c={c} />
      ) : (
        <>
          <Body form={form} c={c} />
          <Face sleeping={sleeping} sad={sad} cheeks={form !== "adultB"} />
        </>
      )}
    </svg>
  );
}
