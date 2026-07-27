/**
 * 写真の alt テキスト（altJa / altZh）を生成して microCMS に書き戻す。
 *
 * 新規入稿分の穴埋めと既存記事のバックフィルを兼ねる: alt が未設定の
 * 記事だけを拾うので、入稿のたびに実行すれば差分だけが処理される。
 *
 *   node --env-file=.env scripts/generate-alt.ts             # 未設定分を全部
 *   node --env-file=.env scripts/generate-alt.ts --dry-run   # 書き込まず確認
 *   node --env-file=.env scripts/generate-alt.ts --limit 5   # 先頭5件だけ
 *   node --env-file=.env scripts/generate-alt.ts --id abc123 # 特定の1件
 *   node --env-file=.env scripts/generate-alt.ts --force     # 既存 alt も上書き
 *
 * 必要な環境変数:
 *   MICROCMS_DOMAIN         サービス ID
 *   MICROCMS_WRITE_API_KEY  PATCH 権限のある microCMS API キー
 *                           （サイト配信用の読み取り専用キーとは分ける）
 *   ANTHROPIC_API_KEY       Claude API キー
 */
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "microcms-js-sdk";

const MODEL = "claude-opus-5";
// 画像1枚の描写にはこれで十分。上げると thinking が伸びて費用も伸びる。
const EFFORT = process.env.ALT_EFFORT ?? "medium";
const CONCURRENCY = Number(process.env.ALT_CONCURRENCY ?? 3);
// microCMS Image API で長辺を抑えてから渡す。原寸は無駄に大きく、
// 画像トークンをそのまま増やすだけで描写の質は上がらない。
const IMAGE_WIDTH = 1400;

// alt は「見えるものの説明」であって作品解説でも SEO 文でもない。
// 地名や固有名詞を推測させないことが最重要（誤った断定は読み上げ利用者
// を誤誘導するし、サイトの信頼性も損なう）。
const SYSTEM_PROMPT = `あなたは写真サイトのアクセシビリティ担当者です。台湾で撮影された写真1枚を受け取り、スクリーンリーダー利用者のための代替テキスト（alt）を日本語と繁体字中国語で書きます。

## 目的
alt は画像を見られない人が、その写真に何が写っているかを把握するための文章です。同時に画像検索エンジンが画像内容を理解する手がかりにもなります。装飾的な美文ではなく、具体的で情報量のある描写を書いてください。

## 書くべき内容
- 主要な被写体（人、建物、乗り物、看板、動植物、料理など）を具体的な名詞で
- 場所の種類（市場、路地、廟、海辺、駅、食堂、住宅街など。※固有の地名ではない）
- 時間帯や天候が明らかならそれ（夕方、夜、雨上がり、逆光など）
- 光の質や色調が写真の印象を決めているならそれ（ネオン、西日、モノクロなど）
- 人物がいる場合は人数と何をしているか（誰であるかは書かない）

## 絶対に守ること
1. **写真から確実に判断できることだけを書く。** 地名・店名・人名・地域名を推測して書いてはいけません。看板の文字がはっきり読み取れる場合のみ、その文字列に言及して構いません。読み取れない文字を想像で補ってはいけません。
2. 「台北」「迪化街」「九份」などの具体的な地名は、写真からは特定できません。書かないでください。「台湾の」という限定も、写真だけからは断定できないため避けてください。
3. 冒頭に「写真」「画像」「〜の写真です」といった語を付けないでください。alt は既に画像として読み上げられます。
4. 撮影者、カメラ、レンズ、撮影技法、作品の解釈や感想は書かないでください。
5. 検索用のキーワードを不自然に並べないでください。一続きの自然な文章にしてください。
6. 断定できない要素は省いてください。曖昧なものを無理に描写するより、確実な要素だけを書くほうが有用です。

## 分量
- altJa: 日本語で40〜90字程度。一文か二文。読み上げて自然な長さに。
- altZh: 繁体字中国語（台湾）で25〜60字程度。日本語の逐語訳ではなく、同じ内容を中国語として自然に書き直してください。簡体字は使わないでください。

## 出力
altJa と altZh の2つのフィールドを持つ JSON を返してください。`;

const ALT_SCHEMA = {
  type: "object",
  properties: {
    altJa: {
      type: "string",
      description: "日本語の alt テキスト（40〜90字程度）",
    },
    altZh: {
      type: "string",
      description: "繁体字中国語の alt テキスト（25〜60字程度）",
    },
  },
  required: ["altJa", "altZh"],
  additionalProperties: false,
};

type DayRow = {
  id: string;
  image: { url: string };
  altJa?: string;
  altZh?: string;
};

type Alt = { altJa: string; altZh: string };

const args = process.argv.slice(2);
const hasFlag = (name: string) => args.includes(name);
const flagValue = (name: string) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};

const dryRun = hasFlag("--dry-run");
const force = hasFlag("--force");
const onlyId = flagValue("--id");
const limit = flagValue("--limit") ? Number(flagValue("--limit")) : undefined;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(
      `環境変数 ${name} が未設定です。.env に設定して --env-file=.env を付けて実行してください。`,
    );
    process.exit(1);
  }
  return v;
}

const cms = createClient({
  serviceDomain: requireEnv("MICROCMS_DOMAIN"),
  apiKey: requireEnv("MICROCMS_WRITE_API_KEY"),
});

const anthropic = new Anthropic({
  apiKey: requireEnv("ANTHROPIC_API_KEY"),
  // 429/5xx はここで吸収する。489件を通しで回すので、1件の一時失敗で
  // 全体を止めたくない。
  maxRetries: 5,
});

async function generateAlt(imageUrl: string): Promise<Alt> {
  const res = await anthropic.messages.create({
    model: MODEL,
    // Opus 5 は thinking が既定でオン。max_tokens は thinking と本文の
    // 合計に効くので、出力自体は短くても余裕を持たせる。
    max_tokens: 16000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        // 全件で同一のプレフィックスなので、2件目以降はキャッシュ読み出しになる。
        cache_control: { type: "ephemeral" },
      },
    ],
    output_config: {
      effort: EFFORT as "low" | "medium" | "high",
      format: { type: "json_schema", schema: ALT_SCHEMA },
    },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "url", url: `${imageUrl}?w=${IMAGE_WIDTH}` },
          },
          { type: "text", text: "この写真の alt テキストを生成してください。" },
        ],
      },
    ],
  });

  if (res.stop_reason === "refusal") {
    throw new Error(
      `モデルが応答を拒否しました (${res.stop_details?.category ?? "理由不明"})`,
    );
  }
  const text = res.content.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("テキストブロックが返りませんでした");
  return JSON.parse(text) as Alt;
}

async function main() {
  console.log("microCMS から一覧を取得中...");
  let rows: DayRow[];
  try {
    rows = await cms.getAllContents<DayRow>({
      endpoint: "days",
      queries: { fields: ["id", "image", "altJa", "altZh"] },
    });
  } catch (e) {
    console.error(
      "取得に失敗しました。microCMS の days API に altJa / altZh フィールドを追加済みか確認してください。",
    );
    throw e;
  }

  let targets = rows.filter((r) => (force ? true : !r.altJa || !r.altZh));
  if (onlyId) targets = targets.filter((r) => r.id === onlyId);
  if (limit !== undefined) targets = targets.slice(0, limit);

  console.log(
    `全 ${rows.length} 件中 ${targets.length} 件を処理します` +
      `${dryRun ? "（dry-run: 書き込みません）" : ""}`,
  );
  if (targets.length === 0) return;

  let done = 0;
  let failed = 0;
  const queue = [...targets];

  const worker = async () => {
    for (;;) {
      const row = queue.shift();
      if (!row) return;
      try {
        const alt = await generateAlt(row.image.url);
        if (!dryRun) {
          await cms.update({
            endpoint: "days",
            contentId: row.id,
            content: alt,
          });
        }
        done++;
        console.log(
          `[${done + failed}/${targets.length}] ${row.id}\n` +
            `  ja: ${alt.altJa}\n  zh: ${alt.altZh}`,
        );
      } catch (e) {
        failed++;
        console.error(
          `[${done + failed}/${targets.length}] ${row.id} 失敗: ${
            e instanceof Error ? e.message : String(e)
          }`,
        );
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, targets.length) }, worker),
  );

  console.log(`\n完了: 成功 ${done} 件 / 失敗 ${failed} 件`);
  // 失敗分は alt が空のまま残るので、再実行すればそこだけ拾い直せる。
  if (failed > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
