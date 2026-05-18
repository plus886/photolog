export const locales = ["ja", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ja";

// Each locale's endonym, shown in the header language switcher.
export const localeNames: Record<Locale, string> = {
  ja: "日本語",
  zh: "中文",
};

// UI string dictionary. `zh` prose (intro, quote) is a first-pass
// translation — review wording before relying on it.
export const ui = {
  ja: {
    "meta.description": "台湾で生きる日本人が写真と言葉で日常を綴るフォトログ",
    "drawer.intro":
      "台湾人の家族と共に生きる日本人が、日常を写真と短歌で綴るフォトログです。以下のキーボードショートカットが使えます。",
    "drawer.shortcut.next": "次の日",
    "drawer.shortcut.prev": "前の日",
    "drawer.shortcut.random": "ランダム",
    "drawer.shortcut.back": "リストに戻る",
    "drawer.profile.pre": "作者のプロフィールは",
    "drawer.profile.link": "ポートフォリオサイト",
    "drawer.profile.post": "をご覧ください。",
    "drawer.quote":
      "—— 生活環境や風景にしても、それらが真の姿を明らかにするのは、写真家がそうした対象を、それらの顔貌に現れている名づけようのない現象において把握することを心得ている場合だけである。（ヴァルター・ベンヤミン）",
  },
  zh: {
    "meta.description": "在台灣生活的日本人，以照片與文字書寫日常的 Photolog。",
    "drawer.intro":
      "與台灣家人一同生活的日本人，以照片記錄日常的攝影日誌。可使用以下鍵盤快捷鍵。",
    "drawer.shortcut.next": "下一天",
    "drawer.shortcut.prev": "前一天",
    "drawer.shortcut.random": "隨機",
    "drawer.shortcut.back": "返回列表",
    "drawer.profile.pre": "作者的個人簡介請參閱",
    "drawer.profile.link": "作品集網站",
    "drawer.profile.post": "。",
    "drawer.quote":
      "—— 即使是生活環境與風景，唯有當攝影師懂得在其面容所顯現的、難以名狀的現象中把握這些對象時，它們才會顯露真實的樣貌。（華特・班雅明）",
  },
} as const;
