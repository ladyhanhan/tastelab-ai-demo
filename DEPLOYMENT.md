# TasteLab AI Deployment Guide / TasteLab AI 部署说明

## Recommended Path / 推荐路径

Use GitHub as the source repository and connect the repository to Vercel for automatic preview and production deployments.

使用 GitHub 作为源码仓库，并将该仓库连接到 Vercel，用于自动生成预览部署和正式部署。

## What To Upload / 需要上传的内容

Keep the source files in the repository:

保留以下源码文件在仓库中：

- `index.html`
- `styles.css`
- `app.js`
- `api/`
- `server/`
- `assets/`
- `OPPOSans/`
- `docs/`
- `.design/`
- `package.json`
- `package-lock.json`
- `PRODUCT.md`
- `DESIGN.md`
- `PRD.md`

Do not upload generated or temporary files:

不要上传生成文件或临时文件：

- `node_modules/`
- `out/`
- `dist/`
- `tastelab-ai-demo/`
- `*.zip`
- `.DS_Store`

## Vercel Settings / Vercel 设置

When importing the GitHub repository into Vercel, use these settings:

在 Vercel 导入 GitHub 仓库时，建议使用以下设置：

- Framework Preset: `Other`
- Root Directory: repository root / 仓库根目录
- Build Command: leave empty / 留空
- Output Directory: leave empty / 留空
- Install Command: use Vercel default `npm install` / 使用 Vercel 默认的 `npm install`

The interface is served from `index.html`, while authentication and AI requests run through Vercel Functions in `api/`.

界面入口为 `index.html`，登录会话和 AI 请求通过 `api/` 中的 Vercel Functions 运行。

## Environment Variables / 环境变量

Add the following variables in Vercel Project Settings → Environment Variables for Preview and Production:

在 Vercel 项目设置 → Environment Variables 中，为 Preview 和 Production 添加以下变量：

- `OPENAI_API_KEY`: a project-scoped OpenAI API key / OpenAI 项目级 API Key
- `OPENAI_MODEL`: `gpt-5.6-terra`
- `DEMO_ACCESS_CODE`: the shared code used on the demo login page / 演示登录页使用的共享口令
- `SESSION_SECRET`: a random secret of at least 32 characters / 至少 32 位的随机会话密钥

Never prefix these variables with `NEXT_PUBLIC_` or place real values in `app.js`, Git, or `.env.example`.

不要给这些变量添加 `NEXT_PUBLIC_` 前缀，也不要把真实值写入 `app.js`、Git 或 `.env.example`。

After changing an environment variable, redeploy the latest commit so the Functions receive the new configuration.

修改环境变量后，需要重新部署最新提交，Vercel Functions 才会读取新配置。

## Update Flow / 更新流程

1. Edit the local prototype files.
   在本地修改原型文件。
2. Commit and push changes to GitHub.
   提交并推送到 GitHub。
3. Vercel automatically creates a new deployment.
   Vercel 会自动生成新的部署。
4. Share the Vercel preview or production URL for demos.
   使用 Vercel 预览链接或正式链接进行演示分享。

## Notes / 注意事项

The repository also contains Remotion dependencies, but Vercel should not run a Remotion build. Keep Framework Preset as `Other`; dependency installation is still required for the `openai` and `zod` server packages.

仓库中仍包含 Remotion 依赖，但 Vercel 不应执行 Remotion 构建。Framework Preset 保持为 `Other`；同时必须安装依赖，供服务端使用 `openai` 与 `zod`。
