# TasteLab AI Implementation / TasteLab AI 实施说明

## Purpose / 目的

TasteLab AI uses real OpenAI Responses API calls for Brief analysis, chef-recipe standardization, robot-data drafting, experiment comparison, localization research, final-recipe generation, and result translation.

TasteLab AI 使用真实 OpenAI Responses API 完成 Brief 解析、厨师菜谱标准化、机器人数据草案、实验比较、本地化研究、最终菜谱生成和结果翻译。

Robot data is always a demonstration draft. It is not an official Botinkit device specification and cannot be sent directly to equipment.

机器人数据始终是演示草案，不属于 Botinkit 官方设备规范，也不可直接下发设备。

## Architecture / 架构

The browser calls only the project's Vercel Functions:

浏览器只调用项目自身的 Vercel Functions：

- `POST /api/session`: validates the shared demo access code and issues an eight-hour secure `HttpOnly` cookie.
  `POST /api/session`：验证共享演示口令，并签发有效期八小时的安全 `HttpOnly` Cookie。
- `GET /api/session`: checks whether the current browser session is authenticated.
  `GET /api/session`：检查当前浏览器会话是否已登录。
- `DELETE /api/session`: clears the demo session.
  `DELETE /api/session`：清除演示会话。
- `POST /api/ai`: validates the session, request size, task, locale, images, and Structured Output before returning an AI result.
  `POST /api/ai`：校验会话、请求大小、任务、语言、图片和结构化输出，再返回 AI 结果。

`OPENAI_API_KEY` exists only in Vercel environment variables. It is never sent to or stored in browser JavaScript.

`OPENAI_API_KEY` 只存在于 Vercel 环境变量中，不会发送到浏览器，也不会存储在前端 JavaScript 中。

## Environment Setup / 环境配置

Copy `.env.example` to a local environment file when using Vercel CLI, or add the same values in Vercel Project Settings:

使用 Vercel CLI 本地运行时，可参考 `.env.example` 创建本地环境文件；线上则在 Vercel 项目设置中添加相同变量：

```dotenv
OPENAI_API_KEY=your_project_api_key
OPENAI_MODEL=gpt-5.6-terra
DEMO_ACCESS_CODE=your_shared_demo_code
SESSION_SECRET=use_a_random_secret_of_at_least_32_characters
```

Do not commit real values. Rotate `DEMO_ACCESS_CODE` immediately if a shared link or access code leaks.

不要提交真实值。如果演示链接或访问口令泄露，应立即更新 `DEMO_ACCESS_CODE`。

## Local Verification / 本地验证

Because the site now depends on `/api/session` and `/api/ai`, opening `index.html` directly with `file://` can show the layout but cannot run authentication or AI.

网站现在依赖 `/api/session` 与 `/api/ai`，直接用 `file://` 打开 `index.html` 只能查看布局，不能运行登录或 AI。

Use the project's local Vercel runtime or a Preview deployment for the complete flow:

完整流程请使用项目内置的本地 Vercel 运行环境或 Preview 部署：

```bash
npm install
npm run dev:web
```

Then open `http://localhost:4173`.

然后打开 `http://localhost:4173`。

On first use, link the folder to the existing Vercel project and pull its Development environment variables:

首次运行时，请把当前文件夹关联到已有 Vercel 项目，并拉取 Development 环境变量：

```bash
npx vercel@56.5.0 link
npx vercel@56.5.0 env pull .env.local --environment=development
npm run dev:web
```

The local AI flow requires `OPENAI_API_KEY`, `OPENAI_MODEL`, `DEMO_ACCESS_CODE`, and `SESSION_SECRET` in `.env.local`. Never commit this file.

本地 AI 流程需要在 `.env.local` 中配置 `OPENAI_API_KEY`、`OPENAI_MODEL`、`DEMO_ACCESS_CODE` 和 `SESSION_SECRET`。不要提交该文件。

## AI Workflow / AI 流程

1. The user completes the required Brief fields and explicitly starts AI analysis.
   用户完成 Brief 必填项，并显式开始 AI 解析。
2. The user resolves every reported conflict before generating robot data.
   用户处理所有冲突后，才能生成机器人数据。
3. Robot data is validated against the task schema and remains editable as a demonstration draft.
   机器人数据通过任务 Schema 校验，并以可编辑演示草案呈现。
4. The user records experiment observations and may upload up to three compressed photos.
   用户录入实验观察，并可上传最多三张压缩照片。
5. Localization uses live web search, shows each sourced fact with its source and publication date, and separates AI inferences from validation items.
   本地化使用实时网页搜索，为每条来源事实展示来源与发布日期，并区分 AI 推断和待验证项。
6. The final recipe combines only confirmed upstream results and never claims expert approval.
   最终菜谱只汇总已确认的上游结果，不会声称经过专家审核。

## Data and Retention / 数据与留存

Project data, photos, and AI results remain in page memory only. Refreshing, closing, or signing out clears active project data. The API requests use `store: false`.

项目数据、照片和 AI 结果只保留在页面内存中。刷新、关闭页面或退出登录会清除进行中项目数据。API 请求使用 `store: false`。

The server logs only request ID, task type, duration-related failures, and error codes. It does not intentionally log recipe text or photo content.

服务端只记录请求 ID、任务类型、耗时相关失败和错误码，不主动记录菜谱正文或照片内容。

## Usage and Cost Ownership / 用量与费用归属

AI usage is charged to the OpenAI API project that owns `OPENAI_API_KEY`, not to the viewer's ChatGPT or Codex account. Anyone using the shared demo consumes the quota and budget of that API project.

AI 用量计入 `OPENAI_API_KEY` 所属的 OpenAI API 项目，不计入访问者的 ChatGPT 或 Codex 账号。任何使用共享演示的人都会消耗该 API 项目的额度与预算。

Set a monthly project budget and usage alerts in the OpenAI Platform before sharing the demo. The site has no per-user call limit, so the shared access code and OpenAI project budget are the main cost controls.

分享演示前，应在 OpenAI Platform 设置项目月度预算和用量告警。网站不设置单用户调用次数上限，因此共享口令与 OpenAI 项目预算是主要成本控制手段。

## Error Behavior / 错误行为

- Missing key: `503 AI_NOT_CONFIGURED`
  缺少 Key：`503 AI_NOT_CONFIGURED`
- Expired or missing session: `401 AUTH_REQUIRED`
  会话过期或缺失：`401 AUTH_REQUIRED`
- Invalid task or payload: `400 INVALID_REQUEST`
  非法任务或请求：`400 INVALID_REQUEST`
- Oversized request: `413 PAYLOAD_TOO_LARGE`
  请求过大：`413 PAYLOAD_TOO_LARGE`
- Invalid model output: `422 AI_INVALID_OUTPUT`
  模型输出未通过校验：`422 AI_INVALID_OUTPUT`
- Timeout or upstream error: retryable error state in the current module.
  超时或上游错误：当前模块显示可重试错误状态。
