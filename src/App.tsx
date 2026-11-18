import React, { useState, useEffect } from 'react';

// --- 定数・マスタデータ ---
const STORAGE_KEY = 'tamagotchi_clone_save_v1';
const TICK_INTERVAL_MS = 5000; // 5秒ごとに画面更新（テスト用に早めています）

// 成長段階とキャラクター定義
const STAGES = {
  egg: { name: 'たまご', emoji: '🥚', nextStage: 'baby', evolveSec: 15 },
  baby: { name: 'ベビっち', emoji: '🐣', nextStage: 'child', evolveSec: 45 },
  child: { name: 'こどもっち', emoji: '🐥', nextStage: 'adult', evolveSec: 90 },
  adult_good: { name: 'まめっち風', emoji: '🐰', nextStage: null, evolveSec: null },
  adult_bad: { name: 'くちぱっち風', emoji: '🦆', nextStage: null, evolveSec: null },
  dead: { name: 'おほしさま', emoji: '👻', nextStage: null, evolveSec: null },
};

// 初期データ生成
const createInitialState = () => ({
  stage: 'egg',
  hunger: 80,       // おなか (0-100)
  happiness: 80,    // ごきげん (0-100)
  poopCount: 0,     // うんちの数
  careMistakes: 0,  // お世話ミス回数
  isSick: false,    // 病気フラグ
  bornAt: Date.now(),
  lastUpdatedAt: Date.now(),
});

export default function App() {
  // LocalStorageから初期読み込み
  const [pet, setPet] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : createInitialState();
  });

  const [message, setMessage] = useState('ピピッ！');
  const [isAnimating, setIsAnimating] = useState(false);

  // --- 時間経過の計算ロジック（オフライン対応） ---
  const processTimeElapsed = (currentPet) => {
    if (currentPet.stage === 'dead') return currentPet;

    const now = Date.now();
    const elapsedSec = Math.floor((now - currentPet.lastUpdatedAt) / 1000);
    if (elapsedSec < 5) return currentPet; // 5秒未満は無視

    let next = { ...currentPet, lastUpdatedAt: now };
    const ageSec = Math.floor((now - next.bornAt) / 1000);

    // 1. 卵の孵化判定
    if (next.stage === 'egg') {
      if (ageSec >= STAGES.egg.evolveSec) {
        next.stage = 'baby';
        setMessage('たまごが かえった！');
      }
      return next;
    }

    // 2. ステータス減少（テスト用に10秒ごとに減少）
    const ticks = Math.floor(elapsedSec / 10);
    if (ticks > 0) {
      next.hunger = Math.max(0, next.hunger - ticks * 5);
      next.happiness = Math.max(0, next.happiness - ticks * 4);

      // おなか・ごきげんが0ならお世話ミス加算
      if (next.hunger === 0 || next.happiness === 0) {
        next.careMistakes += 1;
      }

      // うんち発生（確率）
      if (Math.random() < 0.4 * ticks && next.poopCount < 4) {
        next.poopCount += 1;
      }

      // うんち放置で病気判定
      if (next.poopCount >= 3) {
        next.isSick = true;
      }

      // 寿命・お別れ判定（ミス5回以上 or 病気のまま長時間）
      if (next.careMistakes >= 5) {
        next.stage = 'dead';
        setMessage('おほしさまに なりました…');
        return next;
      }
    }

    // 3. 進化判定
    const currentStageInfo = STAGES[next.stage];
    if (currentStageInfo?.nextStage && ageSec >= currentStageInfo.evolveSec) {
      if (currentStageInfo.nextStage === 'adult') {
        // お世話ミス回数で進化先を分岐
        next.stage = next.careMistakes <= 1 ? 'adult_good' : 'adult_bad';
      } else {
        next.stage = currentStageInfo.nextStage;
      }
      setMessage(`${STAGES[next.stage].name} に しんかした！`);
    }

    return next;
  };

  // 起動時＆定期タイマーで時間経過を処理
  useEffect(() => {
    setPet((prev) => processTimeElapsed(prev));

    const timer = setInterval(() => {
      setPet((prev) => processTimeElapsed(prev));
    }, TICK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  // 状態が変わるたびにLocalStorageへ自動保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
  }, [pet]);

  // アクション時の共通アニメーション
  const triggerAction = (msg, updater) => {
    if (pet.stage === 'egg' || pet.stage === 'dead') return;
    setIsAnimating(true);
    setMessage(msg);
    setPet((prev) => updater(prev));
    setTimeout(() => setIsAnimating(false), 600);
  };

  // --- お世話アクション ---
  const handleFeed = () => {
    if (pet.hunger >= 100) {
      setMessage('おなかいっぱい！');
      return;
    }
    triggerAction('もぐもぐ… おいしい！', (prev) => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 25),
    }));
  };

  const handlePlay = () => {
    if (pet.isSick) {
      setMessage('びょうきで あそべない…');
      return;
    }
    triggerAction('わーい！ たのしい！', (prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 25),
      hunger: Math.max(0, prev.hunger - 5),
    }));
  };

  const handleClean = () => {
    if (pet.poopCount === 0 && !pet.isSick) {
      setMessage('おへやは きれい！');
      return;
    }
    triggerAction('すっきり ぴかぴか！', (prev) => ({
      ...prev,
      poopCount: 0,
      isSick: false,
    }));
  };

  const handleReset = () => {
    if (window.confirm('あたらしい たまごから はじめますか？')) {
      const fresh = createInitialState();
      setPet(fresh);
      setMessage('あたらしい たまごだ！');
    }
  };

  const stageInfo = STAGES[pet.stage];

  return (
    <div style={styles.container}>
      {/* 携帯ゲーム機本体（スマホ縦画面フィット） */}
      <div style={styles.deviceBody}>
        <div style={styles.brandTitle}>REACT-GOTCHI</div>

        {/* 液晶画面エリア */}
        <div style={styles.screen}>
          {/* 上部ステータスバー */}
          <div style={styles.statusBar}>
            <span>おなか: {'♥'.repeat(Math.ceil(pet.hunger / 25))}</span>
            <span>ごきげん: {'♥'.repeat(Math.ceil(pet.happiness / 25))}</span>
          </div>

          {/* メインキャラクター表示 */}
          <div style={styles.characterArea}>
            <div
              style={{
                ...styles.characterEmoji,
                transform: isAnimating ? 'translateY(-12px) scale(1.1)' : 'translateY(0)',
              }}
            >
              {stageInfo.emoji}
            </div>
            {pet.isSick && <div style={styles.sickBadge}>🤒 びょうき</div>}
            <div style={styles.poopRow}>
              {'💩'.repeat(pet.poopCount)}
            </div>
          </div>

          {/* 下部メッセージ＆名前 */}
          <div style={styles.messageBox}>
            <div style={styles.charName}>{stageInfo.name}（ミス:{pet.careMistakes}）</div>
            <div style={styles.messageText}>{message}</div>
          </div>
        </div>

        {/* 物理ボタン風操作エリア */}
        <div style={styles.buttonRow}>
          <div style={styles.buttonWrapper}>
            <button style={styles.roundBtn} onClick={handleFeed}>🍚</button>
            <span style={styles.btnLabel}>ごはん</span>
          </div>
          <div style={styles.buttonWrapper}>
            <button style={styles.roundBtn} onClick={handlePlay}>⚽</button>
            <span style={styles.btnLabel}>あそぶ</span>
          </div>
          <div style={styles.buttonWrapper}>
            <button style={styles.roundBtn} onClick={handleClean}>🧹</button>
            <span style={styles.btnLabel}>おそうじ</span>
          </div>
        </div>

        {/* リセットボタン */}
        <button style={styles.resetBtn} onClick={handleReset}>
          リセット（あたらしい卵）
        </button>
      </div>
    </div>
  );
}

// --- スマホ縦画面向けスタイル定義 ---
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100dvh',
    backgroundColor: '#f0f4f8',
    fontFamily: '"Courier New", Courier, monospace',
    padding: '16px',
    boxSizing: 'border-box',
  },
  deviceBody: {
    width: '100%',
    maxWidth: '360px',
    backgroundColor: '#ff7eb3',
    borderRadius: '48px',
    padding: '28px 24px',
    boxShadow: '0 12px 24px rgba(0,0,0,0.2), inset 0 -6px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '4px solid #ff5c9e',
  },
  brandTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '18px',
    letterSpacing: '2px',
    marginBottom: '16px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
  },
  screen: {
    width: '100%',
    height: '260px',
    backgroundColor: '#9bbc0f', // 初代ゲームボーイ/たまごっち風の液晶色
    borderRadius: '16px',
    border: '6px solid #4a5568',
    boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '12px',
    boxSizing: 'border-box',
    color: '#0f380f',
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '2px dashed #306230',
    paddingBottom: '4px',
  },
  characterArea: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  characterEmoji: {
    fontSize: '72px',
    transition: 'transform 0.2s ease',
    userSelect: 'none',
  },
  sickBadge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: '#0f380f',
    color: '#9bbc0f',
    fontSize: '11px',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  poopRow: {
    fontSize: '20px',
    minHeight: '24px',
    marginTop: '4px',
  },
  messageBox: {
    borderTop: '2px dashed #306230',
    paddingTop: '6px',
    textAlign: 'center',
  },
  charName: {
    fontSize: '12px',
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '2px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: '28px',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  roundBtn: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#ffd166',
    border: '4px solid #f4a261',
    fontSize: '28px',
    cursor: 'pointer',
    boxShadow: '0 4px 0 #e76f51',
    active: { transform: 'translateY(2px)' },
  },
  btnLabel: {
    marginTop: '8px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  resetBtn: {
    marginTop: '24px',
    background: 'none',
    border: '1px solid rgba(255,255,255,0.6)',
    color: '#fff',
    fontSize: '11px',
    padding: '6px 12px',
    borderRadius: '12px',
    cursor: 'pointer',
  },
};

