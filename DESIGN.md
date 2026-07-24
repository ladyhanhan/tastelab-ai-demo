# Design / 设计

## Overview / 概览

TasteLab AI is a refined product interface for culinary R&D. The design language follows the newer Botinkit visual material: coordinated light and carbon-dark workspaces, Calendula yellow stages, pixelated food/mark motifs, halftone flavor textures, and OPPO Sans typography. The product should feel like computational flavor made operational.

TasteLab AI 是面向菜品研发的高完成度产品界面。设计语言遵循 Botinkit 新视觉物料：协调统一的浅色工作区与炭黑深色工作区、金盏花黄舞台、像素化食物与标志图形、半调风味纹理，以及 OPPO Sans 字体。产品气质应像是把“计算风味”转化为可执行的工作系统。

## Color / 色彩

Use the VI values as the source of truth and implement them as OKLCH variables.

以品牌 VI 色值作为唯一视觉依据，并在界面中实现为 OKLCH 变量。

- Calendula: `#FCC307` / `oklch(0.845 0.172 87.1)` for primary actions, active states, progress, and small brand bars.
  金盏花黄：`#FCC307` / `oklch(0.845 0.172 87.1)`，用于主要操作、激活状态、进度和小面积品牌条。
- Black / Pulvis: pure black anchors the dark navigation rail and reverse-logo contexts; Pulvis `#303030` / `oklch(0.309 0 89.9)` is the primary light-theme ink and a stable dark surface for yellow actions.
  黑色 / Pulvis：纯黑用于深色导航栏和反白 Logo 场景；Pulvis `#303030` / `oklch(0.309 0 89.9)` 用作浅色主题主要文字，以及承载黄色操作的稳定深色表面。
- Clam: `#F9F1DB` / `oklch(0.959 0.030 90.3)` for the app background and warm product surfaces.
  Clam：`#F9F1DB` / `oklch(0.959 0.030 90.3)`，用于应用背景和温暖的产品表面。
- White: `oklch(1 0 0)` for content panels and logo-safe zones.
  白色：`oklch(1 0 0)`，用于内容面板和 Logo 安全区域。
- Secondary ingredient colors: Spicy `oklch(0.349 0.094 17.1)`, Cinnamon `oklch(0.637 0.099 84.6)`, Scallion `oklch(0.648 0.116 128.6)`, Ginger `oklch(0.824 0.144 87.9)`.
  辅助食材色：Spicy `oklch(0.349 0.094 17.1)`，Cinnamon `oklch(0.637 0.099 84.6)`，Scallion `oklch(0.648 0.116 128.6)`，Ginger `oklch(0.824 0.144 87.9)`。
- Ratio guidance: product surfaces stay restrained, but the first screen may use a committed Calendula field, matching newer packaging and brand visual material.
  比例建议：产品界面整体保持克制，但首屏可以使用明确的金盏花黄区域，以呼应新版包装和品牌视觉物料。

## Typography / 字体

Use the bundled `OPPOSans/` font files as the primary interface typeface: Light 300, Regular 400, Medium 500, Bold 700, and Heavy 800. Keep Alibaba Sans and system UI as fallbacks. Use the VI's wider letter-spacing only for brand labels, section markers, and short uppercase instrumentation; keep dense product body copy tighter for readability. Continue using tabular numbers for data and blueprint parameters.

使用项目内置的 `OPPOSans/` 字体文件作为主要界面字体：Light 300、Regular 400、Medium 500、Bold 700 和 Heavy 800。Alibaba Sans 与系统 UI 字体作为后备。VI 中更宽的字距只用于品牌标签、分区标记和短英文仪器标签；高密度产品正文应保持更紧凑的字距以保证可读性。数据和蓝图参数继续使用等宽数字。

## Layout / 布局

The primary layout is an app shell with coordinated themes. Light mode uses a light navigation rail, warm Clam workspace, white panels, and a dark Botinkit logo. Dark mode uses a pure-black navigation rail, carbon workspace, deep-gray panels, and the official reverse logo. Desktop shows the research control room. Tablet collapses the workspace into fewer columns. Mobile stacks panels and keeps all core functions available.

主布局采用主题协调的应用外壳。浅色模式使用浅色导航栏、温暖的 Clam 工作区、白色面板和黑色 Botinkit Logo；深色模式使用纯黑导航栏、炭黑工作区、深灰面板和官方反白 Logo。桌面端呈现研发控制室。平板端减少列数。移动端堆叠面板，并保留所有核心功能。

## Theme System / 主题系统

The first visit always starts in light mode. A persistent icon button is available on both the login page and the authenticated top bar. Once the user changes the theme, the browser stores that preference locally and restores it before the next paint. The theme is independent of authentication and language state.

首次访问固定使用浅色模式。登录页和登录后的顶部栏均提供常驻图标按钮。用户切换主题后，浏览器会在本地保存偏好，并在下次页面绘制前恢复。主题状态不依赖登录状态或语言状态。

- Light mode: Clam background, white panels, light navigation, Pulvis text, and darker Calendula-derived icon/text accents where contrast is required.
  浅色模式：Clam 背景、白色面板、浅色导航、Pulvis 文字；需要文字或图标对比度时，使用由金盏花黄延伸的深色调。
- Dark mode: near-black background, deep-gray panels, pure-black navigation, off-white text, and Calendula yellow for primary actions and active progress only.
  深色模式：近黑背景、深灰面板、纯黑导航、偏白文字；金盏花黄仅用于主操作与当前进度。
- Robot data visualizations, dropdowns, overlays, forms, and archived recipe documents follow the active theme. Food photography and brand textures are never inverted.
  机器人数据可视化、下拉菜单、浮层、表单和归档菜谱文档均跟随主题；食物照片与品牌纹理不做反色处理。
- Both themes target WCAG AA contrast. Theme transitions are limited to color properties for 160–200 ms and are removed under reduced-motion preferences.
  两种主题均以 WCAG AA 对比度为目标。主题切换仅对颜色属性使用 160–200ms 过渡，并在减少动态效果设置下关闭。

## Components / 组件

- Use the official Botinkit logo geometry in both themes: black rendering on light navigation and the original reverse rendering on dark navigation. Use the favicon mark in the workspace header; do not redraw either asset.
  两种主题均保持官方 Botinkit Logo 图形：浅色导航使用黑色呈现，深色导航使用原始反白呈现。工作区头部使用 favicon 标志；不得重绘任一标志。
- Side navigation with active state and bilingual labels.
  侧边导航包含激活状态和中英双语标签。
- Segmented controls for privacy and view modes.
  分段控件用于隐私模式和视图模式。
- Buttons with default, hover, focus, active, loading, disabled, success, and error states.
  按钮需要覆盖默认、悬停、聚焦、按下、加载、禁用、成功和错误状态。
- Data panels, version rows, blueprint parameters, range sliders, review queue, and status pills.
  数据面板、版本行、蓝图参数、范围滑杆、审核队列和状态标签。
- Toast feedback for AI generation, expert invitation, privacy changes, and validation errors.
  为 AI 生成、专家邀请、隐私变更和校验错误提供 Toast 反馈。

## Signature Element / 标志性元素

Robot Data uses a theme-responsive instrument surface with Calendula progress, timed ingredient drops, wok actions, and quality checkpoints. Pixelated mark fragments can appear as low-opacity product texture, connecting robot parameters to the brand's computational food language.

机器人数据采用随主题切换的仪器表面，并以金盏花黄表达进度、定时投料、锅体动作和质量检查点。像素化标志碎片可以作为低透明度产品纹理出现，把机器人参数和品牌的计算食物语言连接起来。

## Motion / 动效

Use short 160-220ms transitions for state feedback only. Respect reduced motion by disabling transform movement and animation.

仅在状态反馈中使用 160-220ms 的短过渡。遵循减少动态效果设置，关闭位移和动画。

## AI Interaction States / AI 交互状态

AI is presented as an inspectable workflow action, not as a generic chat surface. Every AI module has an empty state, an explicit trigger, a processing state, a validated result, and a recoverable error state.

AI 以可检查的流程操作呈现，而不是通用聊天界面。每个 AI 模块都需要空状态、显式触发、处理中状态、校验后的结果和可恢复的错误状态。

- Processing feedback uses concise user-facing phases such as constraint validation, execution-stage generation, risk checks, market-difference analysis, and validation-item preparation. Internal reasoning is never displayed.
  处理反馈使用“校验约束、生成执行阶段、检查风险、分析市场差异、整理验证项”等面向用户的简短阶段，不展示内部推理。
- Generated robot data always carries a persistent warning that it is an AI demo draft and cannot be sent directly to equipment.
  AI 生成的机器人数据始终显示常驻警示，说明其为演示草案，不可直接下发设备。
- Localization cards carry a persistent inference notice and visually separate AI proposals from items requiring local-team validation. Live web sources are not shown while search is disabled.
  本地化卡片常驻显示“AI 推断”提示，并在视觉上区分 AI 建议与当地团队待验证项；联网搜索关闭期间不展示实时来源。
- Experiment photo analysis shows the uploaded images and a capability boundary that excludes food safety, real doneness, and actual taste.
  实验照片分析显示用户上传的图片，并明确排除食品安全、真实熟度和实际口感判断。
- Language changes never mix source-language AI content into the target-language interface. The translated result loads separately and is cached only for the current page session.
  语言切换时不得把源语言 AI 内容混入目标语言界面；翻译结果单独加载，并只在当前页面会话中缓存。
