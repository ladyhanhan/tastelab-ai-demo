# Design / 设计

## Overview / 概览

TasteLab AI is a refined product interface for culinary R&D. The design language now follows the newer Botinkit visual material: black instrument surfaces, Calendula yellow stages, pixelated food/mark motifs, halftone flavor textures, and OPPO Sans typography. The product should feel like computational flavor made operational.

TasteLab AI 是面向菜品研发的高完成度产品界面。设计语言遵循 Botinkit 新视觉物料：黑色仪器表面、金盏花黄舞台、像素化食物与标志图形、半调风味纹理，以及 OPPO Sans 字体。产品气质应像是把“计算风味”转化为可执行的工作系统。

## Color / 色彩

Use the VI values as the source of truth and implement them as OKLCH variables.

以品牌 VI 色值作为唯一视觉依据，并在界面中实现为 OKLCH 变量。

- Calendula: `#FCC307` / `oklch(0.845 0.172 87.1)` for primary actions, active states, progress, and small brand bars.
  金盏花黄：`#FCC307` / `oklch(0.845 0.172 87.1)`，用于主要操作、激活状态、进度和小面积品牌条。
- Black / Pulvis: pure black for the navigation rail and reverse logo contexts; Pulvis `#303030` / `oklch(0.309 0 89.9)` for primary ink and high-emphasis instrumentation.
  黑色 / Pulvis：纯黑用于导航栏和反白 Logo 场景；Pulvis `#303030` / `oklch(0.309 0 89.9)` 用于主要文字和高强调仪器界面。
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

The primary layout is an app shell: a black reverse-logo navigation rail, warm Clam workspace, white content panels, and a committed Calendula dashboard hero with halftone texture. Desktop shows the research control room. Tablet collapses the workspace into fewer columns. Mobile stacks panels and keeps all core functions available.

主布局采用应用外壳：黑色反白 Logo 导航栏、温暖的 Clam 工作区、白色内容面板，以及带半调纹理的金盏花黄仪表首屏。桌面端呈现研发控制室。平板端减少列数。移动端堆叠面板，并保留所有核心功能。

## Components / 组件

- Official Botinkit reverse logo in the black navigation rail; favicon mark in the workspace header; do not redraw or modify either.
  黑色导航栏使用官方 Botinkit 反白 Logo；工作区头部使用 favicon 标志；两者都不能重绘或改造。
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

The Robot Executable Blueprint uses a Calendula thermal rail against a dark carbon surface: timed ingredient drops, wok actions, and quality checkpoints. Pixelated mark fragments can appear as low-opacity product texture, connecting robot parameters to the brand's computational food language.

Robot Executable Blueprint 采用深色碳感表面上的金盏花黄热力轨道，展示定时投料、锅体动作和质量检查点。像素化标志碎片可以作为低透明度产品纹理出现，把机器人参数和品牌的计算食物语言连接起来。

## Motion / 动效

Use short 160-220ms transitions for state feedback only. Respect reduced motion by disabling transform movement and animation.

仅在状态反馈中使用 160-220ms 的短过渡。遵循减少动态效果设置，关闭位移和动画。
