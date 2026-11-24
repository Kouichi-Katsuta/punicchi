// キャラクター画像（差し替え用）
// public/pets/ に「形態キー_表情.png」を置くと、その画像で表示する
//   例: baby.png（ふつう） / baby_sad.png（困り顔） / baby_sleep.png（ねている）
// 探す順番: 形態_表情.png → 形態.png → どちらも無ければ Pet.jsx の SVG で描く
import { useSyncExternalStore } from "react";

export const PET_IMG_DIR = `${import.meta.env.BASE_URL}pets/`;
export const PET_IMG_EXT = "png";

const cache = {}; // url → "ok" | "ng" | "loading"
const listeners = new Set();
let version = 0;

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function settle(url, result) {
  cache[url] = result;
  version++;
  listeners.forEach((fn) => fn());
}

function resolve(form, mood) {
  const urls = [`${PET_IMG_DIR}${form}_${mood}.${PET_IMG_EXT}`, `${PET_IMG_DIR}${form}.${PET_IMG_EXT}`];
  for (const u of mood === "normal" ? urls.slice(1) : urls) {
    const st = cache[u];
    if (st === "ok") return u;
    if (st === "ng") continue;
    if (!st) {
      // はじめて見る画像は読み込みを試し、結果が出たら購読中の Pet を描き直す
      cache[u] = "loading";
      const img = new Image();
      img.onload = () => settle(u, "ok");
      img.onerror = () => settle(u, "ng");
      img.src = u;
    }
    return null; // 読み込み中は SVG で表示しておく
  }
  return null;
}

// 使える画像の URL を返す（無ければ null）
export function usePetImage(form, mood) {
  useSyncExternalStore(subscribe, () => version);
  return resolve(form, mood);
}
