import { useLayoutEffect, useRef, useState } from "react";

// 画面に収まるように要素の縮小率を計算する（スマホ対応）。大きい画面では等倍のまま
export function useFitScale(margin = 16) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const w = el.offsetWidth, h = el.offsetHeight;
      const vw = window.visualViewport?.width ?? window.innerWidth;
      const vh = window.visualViewport?.height ?? window.innerHeight;
      setScale(Math.min(1, (vw - margin) / w, (vh - margin) / h));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [margin]);

  return [ref, scale];
}
