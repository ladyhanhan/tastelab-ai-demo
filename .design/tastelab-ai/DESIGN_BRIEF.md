# Design Brief: Botinkit TasteLab AI / 设计简报：Botinkit TasteLab AI

## Problem / 问题

Restaurant R&D teams can imagine new dishes, but turning a dish into something that tastes consistent across stores, regions, staff skill levels, and robot workflows is slow and fragile. Chef notes, tasting feedback, and production constraints often live in separate places.

餐饮研发团队可以快速想象新菜，但要让一道菜在不同门店、地区、人员熟练度和机器人流程中保持稳定风味，过程缓慢且脆弱。厨师笔记、试吃反馈和生产限制也常常分散在不同地方。

## Solution / 解决方案

TasteLab AI gives culinary teams a bilingual R&D workspace where a dish idea, existing recipe, or localization goal becomes a robot-executable blueprint. AI acts as a chef-controlled co-pilot, then experts and internal reviewers refine the result through experiments and version history.

TasteLab AI 为菜品团队提供中英双语研发工作区，把菜品创意、现有菜谱或本地化目标转化为机器人可执行蓝图。AI 作为由主厨掌控的副驾生成草案，再由专家和内部评审通过实验与版本历史不断打磨。

## Experience Principles / 体验原则

1. Chef control over automation -- AI drafts blueprints, but chefs approve every important decision.
   主厨掌控自动化 -- AI 起草蓝图，但每个重要决策都由主厨确认。
2. Blueprint over brainstorm -- every screen should help a team test, compare, or launch a dish.
   蓝图优先于头脑风暴 -- 每个界面都应帮助团队测试、比较或上线一道菜。
3. Private by default, collaborative by choice -- customers can keep R&D isolated or invite Botinkit Taste Lab and international chef reviewers.
   默认私有，按需协作 -- 客户可以保持研发隔离，也可以邀请 Botinkit Taste Lab 和国际厨师评审参与。

## Aesthetic Direction / 美学方向

- **Philosophy / 理念**: Botinkit computational flavor lab.
  Botinkit 计算风味实验室。
- **Tone / 气质**: Graphic, energetic, precise, culinary, and professionally controlled.
  图形化、有能量、精确、有烹饪感，并保持专业克制。
- **Reference points / 参考点**: Botinkit new visual material; reverse logo on black; Calendula yellow fields; pixelated food/mark motifs; halftone dot textures; Pulvis dark instrument surfaces.
  Botinkit 新视觉物料、黑底反白 Logo、金盏花黄大色块、像素化食物与标志图形、半调点阵纹理、Pulvis 深色仪器表面。
- **Anti-references / 反向参考**: Generic AI chat pages, cold white labs, purple/coral AI palettes, simple recipe managers, restaurant POS dashboards, decorative SaaS card grids.
  泛 AI 聊天页、冷白实验室、紫色或珊瑚色 AI 配色、简单菜谱管理器、餐饮 POS 仪表盘、装饰性 SaaS 卡片网格。

## Existing Patterns / 现有模式

- Typography: follow the VI's OPPO Sans direction when available, with system fallbacks for product reliability.
  字体：优先遵循 VI 中的 OPPO Sans 方向，并使用系统后备字体保证产品稳定性。
- Colors: follow the VI's Calendula `#FCC307`, Pulvis `#303030`, Clam `#F9F1DB`, and ingredient secondary colors.
  色彩：遵循 VI 中的 Calendula `#FCC307`、Pulvis `#303030`、Clam `#F9F1DB` 和辅助食材色。
- Spacing: none existed before this implementation; use a 4pt-based spacing scale.
  间距：本次实现前没有既有规范；使用基于 4pt 的间距体系。
- Components: none existed before this implementation; create local static components in HTML, CSS, and JavaScript.
  组件：本次实现前没有既有组件；在 HTML、CSS 和 JavaScript 中创建本地静态组件。

## Component Inventory / 组件清单

| Component / 组件 | Status / 状态 | Notes / 说明 |
| --- | --- | --- |
| App shell and side navigation / 应用外壳与侧边导航 | New / 新增 | Desktop-first, collapses for narrow screens. / 桌面优先，窄屏时收拢。 |
| R&D project dashboard / 研发项目仪表台 | New / 新增 | Shows pipeline, AI entry, experiments, review, and blueprint readiness. / 展示项目管线、AI 入口、实验、审核和蓝图完成度。 |
| AI ideation workbench / AI 创意工作台 | New / 新增 | Supports new dish creation and existing recipe robotization. / 支持新菜研发和现有菜谱机器人化。 |
| Robot blueprint editor / 机器人蓝图编辑器 | New / 新增 | Heat curve, timed actions, parameters, and risk notes. / 火候曲线、定时动作、参数和风险记录。 |
| Experiment version comparison / 实验版本对比 | New / 新增 | Shows version differences, tasting scores, photos, and audit trail. / 展示版本差异、试吃评分、照片和审计轨迹。 |
| Localization comparison / 本地化对比 | New / 新增 | Compares China, Singapore, and United States adaptations. / 对比中国、新加坡和美国市场适配。 |
| Expert review room / 专家审核室 | New / 新增 | Review queue, privacy mode, invite action, and decision log. / 审核队列、隐私模式、邀请操作和决策记录。 |

## Key Interactions / 关键交互

- Generate blueprint validates the dish brief, shows loading, then updates blueprint readiness and success feedback.
  生成蓝图会校验菜品简报、显示加载状态，然后更新蓝图完成度和成功反馈。
- Empty dish brief shows an inline error and toast without losing entered content.
  空菜品简报会显示行内错误和 Toast，同时保留已输入内容。
- Privacy mode toggles between private R&D and expert collaboration.
  隐私模式可在私有研发和专家协作之间切换。
- Version rows update the selected experiment summary.
  点击版本行会更新所选实验摘要。
- Recipe robotization converts chef language into standard robot steps.
  菜谱机器人化会把厨师自然语言转成标准机器人步骤。
- Navigation switches between the six main product surfaces without a page reload.
  导航可在六个主要产品界面之间切换，无需刷新页面。

## Responsive Behavior / 响应式行为

Desktop uses a side navigation and three-column workspace where relevant. Tablet keeps side navigation but reduces content to two columns. Mobile stacks content, keeps navigation horizontally scrollable, and preserves all core actions.

桌面端使用侧边导航，并在适合的页面采用三列工作区。平板端保留侧边导航，但将内容减少到两列。移动端堆叠内容，导航横向滚动，并保留所有核心操作。

## Accessibility Requirements / 可访问性要求

Meet WCAG AA contrast, provide visible focus rings, use semantic buttons and labels, support reduced motion, keep touch targets at least 44px for tablet use, and avoid color-only status communication.

满足 WCAG AA 对比度，提供清晰焦点环，使用语义化按钮和标签，支持减少动态效果，为平板使用保持至少 44px 的触控目标，并避免只用颜色传达状态。

## Out of Scope / 范围之外

This first prototype does not connect to real POS, inventory, OMNI, KMES, authentication, persistent storage, or a live AI model. Data is realistic sample content designed to validate workflow and visual direction.

第一版原型不连接真实 POS、库存、OMNI、KMES、身份验证、持久化存储或实时 AI 模型。数据为贴近真实场景的样例内容，用于验证工作流和视觉方向。
