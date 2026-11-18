import { useState, useEffect } from 'react';

// ペットのデータの型
interface PetState {
  name: string;
  hunger: number;      // 0〜100
  happiness: number;   // 0〜100
  poopCount: number;   // うんちの数
  lastUpdated: number; // 最終更新時刻
}

const INITIAL_PET: PetState = {
  name: 'たまご',
  hunger: 80,
  happiness: 80,
  poopCount: 0,
  lastUpdated: Date.now(),
};

export function usePetGame() {
  // 1. 起動時にLocalStorageからデータを読み込む
  const [pet, setPet] = useState<PetState>(() => {
    const saved = localStorage.getItem('tamagotchi_save');
    if (!saved) return INITIAL_PET;

    const parsed: PetState = JSON.parse(saved);
    // 前回閉じてからの経過時間（分）を計算
    const elapsedMinutes = Math.floor((Date.now() - parsed.lastUpdated) / (1000 * 60));

    // 経過時間に応じてステータスを一括減少させる（例：10分ごとに空腹-5）
    const hungerDrop = Math.floor(elapsedMinutes / 10) * 5;
    const newPoop = Math.floor(elapsedMinutes / 60); // 1時間ごとにうんち1個

    return {
      ...parsed,
      hunger: Math.max(0, parsed.hunger - hungerDrop),
      poopCount: parsed.poopCount + newPoop,
      lastUpdated: Date.now(),
    };
  });

  // 2. 状態が変わるたびに自動セーブする
  useEffect(() => {
    localStorage.setItem('tamagotchi_save', JSON.stringify(pet));
  }, [pet]);

  // 3. 画面を開いている間のリアルタイムタイマー（1分ごとに更新）
  useEffect(() => {
    const timer = setInterval(() => {
      setPet((prev) => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 1),
        lastUpdated: Date.now(),
      }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // 4. お世話アクション（ごはんをあげる）
  const feedMeal = () => {
    setPet((prev) => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 20),
      lastUpdated: Date.now(),
    }));
  };

  // お世話アクション（トイレ掃除）
  const cleanPoop = () => {
    setPet((prev) => ({
      ...prev,
      poopCount: 0,
      happiness: Math.min(100, prev.happiness + 10),
      lastUpdated: Date.now(),
    }));
  };

  return { pet, feedMeal, cleanPoop };
}
