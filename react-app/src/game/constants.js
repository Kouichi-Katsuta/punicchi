// 形態の定義  stage: 0=たまご 1=ベビー 2=こども 3=おとな
export const FORMS = {
  egg:    { name: "たまご",           stage: 0, color: "#fff7e0" },
  baby:   { name: "ぷにベビー",       stage: 1, color: "#ffe08a" },
  childG: { name: "ぷにまる",         stage: 2, color: "#8fd3ff" }, // よく世話された
  childB: { name: "とげぷに",         stage: 2, color: "#b49ad6" }, // 世話がいまいち
  adultS: { name: "きらぷにドラゴン", stage: 3, color: "#ffb3d1" }, // 最高のお世話
  adultG: { name: "もこぷに",         stage: 3, color: "#9be7a8" }, // ふつうに良い
  adultB: { name: "やみぷに",         stage: 3, color: "#6c6c8a" }, // お世話不足
};

export const STAGE_NAMES = ["たまご", "ベビー期", "こども期", "おとな期"];

// 進化までの時間（秒）。テスト用に短め
export const EVOLVE_AT = { egg: 15, baby: 120, child: 300 };

export const STAT_KEYS = ["hunger", "happy", "clean", "energy"];

export const STAT_META = {
  hunger: { icon: "🍙", label: "おなか", color: "#e2793f" },
  happy:  { icon: "🎵", label: "きげん", color: "#e04f8a" },
  clean:  { icon: "🫧", label: "きれい", color: "#3b8fd0" },
  energy: { icon: "⚡", label: "げんき", color: "#c9a20a" },
};

export const STORAGE_KEY = "punicchi";

// あそぶ：○×クイズの問題 [もんだい, こたえ(true=○), ひとこと]
export const QUIZ = [
  ["いちごは あかい くだもの", true, "あまくて おいしいね"],
  ["ぞうの はなは ながい", true, "はなで みずも のめるよ"],
  ["ペンギンは そらを とべる", false, "およぐのが とくいだよ"],
  ["1たす1は 3", false, "こたえは 2だよ"],
  ["おひさまは にしから のぼる", false, "ひがしから のぼるよ"],
  ["さかなは みずの なかで くらす", true, "えらで いきを するよ"],
  ["ゆきは あつい", false, "ゆきは つめたいよ"],
  ["1しゅうかんは 7にち", true, "げつ〜にちで 7にち"],
  ["かえるの こどもは おたまじゃくし", true, "あしが はえて かえるに なるよ"],
  ["くもの あしは 6ぽん", false, "くもの あしは 8ぽん"],
  ["うさぎの みみは みじかい", false, "ながい みみだね"],
  ["こおりは みずが こおったもの", true, "とけると みずに もどるよ"],
  ["いぬは「ニャー」と なく", false, "いぬは「ワン」だよ"],
  ["3たす2は 5", true, "せいかい！"],
  ["とけいの はりは みぎまわり", true, "みぎに くるくる まわるよ"],
  ["バナナの かわは きいろい", true, "むいて たべようね"],
  ["にわとりは たまごを うむ", true, "まいにち うむことも あるよ"],
  ["つきは じぶんで ひかっている", false, "おひさまの ひかりで ひかるよ"],
];
