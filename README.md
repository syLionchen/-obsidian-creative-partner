# Creative Partner

[中文](#中文) | [English](#english)

---

## 中文

> 即使人工智能能够生成万千答案，人类依然拥有某种无法被穷尽的光。
> 这种光，叫作创意。

Creative Partner 是一个跑在 Obsidian 里的个人小说创作陪练插件（前身为 NovelOS）。它不是代笔工具，而是一个写作教练：只分析、提问、解释、给修改方向，最终的创作权永远留在作者手里。

### 三条原则

1. **不预先设计完整世界观/人物表。** 先假定一个结局或核心问题，开始写，新人事物随故事自然出现，逐步形成因果，走向结局。
2. **反馈有理论依据，不是凭感觉打分。** AI Editor 的分析框架来自成熟的叙事方法论——人物欲望、价值变化、冲突升级、危机/高潮/结局、结构诊断，以及叙述者可靠性、叙述距离、信息控制、隐含作者。这套方法论不提供唯一正确答案，只提供诊断工具和多个可选的修改方向——具体怎么改，由作者决定。
3. **AI 后台可插拔，账户归你自己。** 可以选择"账户登录"（复用本机已登录的官方 CLI，如 Codex，插件本身不接触你的账号凭据），也可以自己填任意 Provider 的 API Key（OpenAI 兼容 / Anthropic / Gemini / deepseek / 完全自定义），Key 只存在本地、不会被提交到 git。

### 为什么每次反馈都是"重新理解"而不是"凭记忆应付"

每一次 `Analyze Current Chapter` 或 `Send`，插件都会：

- 现场重新读取当前 Chapter 文件此刻的正文（不是缓存某次分析时的旧版本）；
- 现场重新读取编辑原则/理论框架文档和作者反复出现的写作模式（Writing Profile）；

再把这些拼进当次 prompt 发给 AI。哪怕作者完全没采纳上一次的建议、按自己的想法继续写，下一次分析依然基于他现在真正写出来的文字重新判断，而不是复述上一轮的记忆。唯一跨章节延续的记忆，是对作者长期写作模式的归纳（Writing Profile）和 Codex 后台里全书共享的上下文——这些是有意的设计，用来让反馈更懂这个作者，而不是用来替代每一次的重新理解。

### 开发

```
npm install
npm run dev     # watch 模式
npm run build   # 一次性构建
```

改完后在 Obsidian 里重载插件（禁用再启用，或 Ctrl+P → "Reload app without saving"）。

---

## English

> Even if artificial intelligence can generate a thousand answers, humans still hold a light that can never be exhausted.
> That light is called creativity.

Creative Partner is a personal novel-writing companion plugin for Obsidian (formerly NovelOS). It is not a ghostwriter — it's a writing coach: it only analyzes, questions, explains, and suggests directions for revision. The creative authority always stays with the author.

### Three principles

1. **No upfront world-building or character bible.** Start from an assumed ending or a core question, begin writing, and let new people and things emerge naturally from the story, building causality step by step toward that ending.
2. **Feedback is grounded in theory, not gut feeling.** The AI Editor's analysis framework comes from established narrative-craft methodology — character desire, value shifts, escalating conflict, crisis/climax/resolution, structural diagnosis, as well as narrator reliability, narrative distance, information control, and the implied author. This methodology doesn't hand you a single correct answer — it only offers diagnostic tools and several possible directions for revision. How to actually revise is always the author's call.
3. **The AI backend is pluggable, and the account is yours.** You can either use "account login" (reusing an already-authenticated official CLI on your machine, such as Codex — the plugin itself never touches your account credentials), or supply your own API key for any provider (OpenAI-compatible / Anthropic / Gemini / DeepSeek / fully custom). Keys are stored locally only and are never committed to git.

### Why every round of feedback is "re-understanding," not "working from memory"

Every time you run `Analyze Current Chapter` or `Send`, the plugin:

- Re-reads the current Chapter file's text fresh, on the spot (never a cached snapshot from a previous analysis);
- Re-reads the editing-principles/theory-framework document and the author's recurring writing patterns (Writing Profile), also fresh;

and only then assembles all of this into the prompt sent to the AI. Even if the author completely ignores the previous suggestion and keeps writing their own way, the next analysis is still based on what they actually wrote just now — not a replay of the last round's memory. The only memory that persists across chapters is the author's long-term writing-pattern summary (Writing Profile) and the shared book-wide context inside the Codex backend — this is an intentional design choice, meant to make feedback understand the author better over time, not to replace fresh re-understanding each time.

### Development

```
npm install
npm run dev     # watch mode
npm run build   # one-off build
```

After making changes, reload the plugin inside Obsidian (disable then re-enable it, or Ctrl+P → "Reload app without saving").
