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
- `assets/`
- `OPPOSans/`
- `docs/`
- `.design/`
- `PRODUCT.md`
- `DESIGN.md`

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
- Install Command: leave empty if Vercel allows it / 如果 Vercel 允许，留空

This site is a static prototype. The main entry file is `index.html`.

这是一个静态原型网站，主入口文件是 `index.html`。

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

The current `package.json` is for the Remotion animation work, not for the static website. If Vercel tries to run a build, set the project framework to `Other` and clear the build command.

当前 `package.json` 用于 Remotion 动画工作，不是静态网站构建脚本。如果 Vercel 尝试执行构建，请将项目框架设为 `Other`，并清空构建命令。
