# TasteLab AI PRD / TasteLab AI 产品需求文档

## 1. Document Info / 文档信息

- Product name: TasteLab AI
  产品名称：TasteLab AI
- Company: Botinkit
  所属公司：不停科技 / Botinkit
- Product type: Enterprise culinary R&D platform for cooking robot data.
  产品类型：面向 B 端的菜品研发与炒菜机器人数据生成平台。
- Current deliverable: Static front-end demo for product review and external presentation.
  当前交付：用于产品评审和对外演示的静态前端原型。
- Last updated: 2026-07-21
  最近更新：2026-07-21

## 2. Product Positioning / 产品定位

TasteLab AI is an enterprise R&D platform that helps restaurant groups turn dish ideas, chef recipes, and regional market requirements into reviewable, testable, and archivable cooking robot data.

TasteLab AI 是一款企业级菜品研发平台，帮助连锁餐饮集团把菜品创意、厨师菜谱和区域市场需求，转化为可评审、可打样、可归档的炒菜机器人数据。

The product is not a consumer recipe app, not a generic AI chat tool, and not a restaurant cost backend. Its core value is to connect culinary R&D decisions with Botinkit's cooking robot execution capability.

本产品不是面向消费者的菜谱应用，不是通用 AI 聊天工具，也不是普通餐饮成本后台。它的核心价值是把菜品研发决策与 Botinkit 炒菜机器人执行能力连接起来。

## 3. Target Users / 目标用户

### 3.1 Primary Users / 主要用户

- Culinary R&D lead: creates and manages dish development projects.
  菜品研发负责人：创建并管理菜品研发项目。
- Executive chef: defines taste goals, validates recipe logic, and confirms final recipes.
  行政总厨：定义口味目标、验证菜谱逻辑，并确认最终菜谱。
- Product or operations manager: checks market fit, batch limits, rollout readiness, and archive status.
  产品或运营负责人：确认市场适配、批量边界、落地准备度和归档状态。

### 3.2 Secondary Users / 次要用户

- Botinkit expert reviewer: reviews robot data, experiment records, and quality checkpoints.
  Botinkit 专家审核人：审核机器人数据、实验版本和质检点。
- External culinary expert: provides optional premium expert feedback.
  外部烹饪专家：提供可选的高级专家反馈。

## 4. User Problems / 用户问题

1. New dish ideas are difficult to translate into repeatable robot cooking parameters.
   新菜创意很难转化为可复制的机器人烹饪参数。
2. Chef recipes are often written in natural language and cannot directly guide automated cooking.
   厨师菜谱通常是自然语言描述，无法直接指导自动化烹饪。
3. Localizing one dish across markets requires many ingredient, taste, cost, and execution trade-offs.
   同一道菜在不同市场本地化时，需要处理食材、口味、成本和执行可行性的多重取舍。
4. R&D teams need a clear project lifecycle instead of jumping between isolated feature modules.
   研发团队需要清晰的项目生命周期，而不是在割裂的功能栏目之间来回跳转。
5. Premium expert review needs to be optional, valuable, and visibly different from normal team confirmation.
   高级专家审核应是可选增值功能，并且在最终菜谱呈现上与普通团队确认版形成明显区别。

## 5. Product Goals / 产品目标

- Help users move from a dish idea to confirmed robot data through a guided lifecycle.
  帮助用户通过引导式流程，从菜品想法推进到已确认的机器人数据。
- Keep chefs in control while AI assists with parsing, conflict detection, and parameter generation.
  让主厨保持决策权，AI 负责辅助解析、冲突识别和参数生成。
- Make project progress, required actions, saved drafts, and archived recipes easy to understand.
  让项目进度、待处理事项、保存草稿和已归档菜谱清晰易懂。
- Support Chinese and English through a language switch, not mixed bilingual text in the same UI.
  通过语言切换支持中文和英文，而不是在同一个界面里中英混排。
- Express Botinkit's brand through a precise, warm, professional food-tech interface.
  通过精密、温暖、专业的食物科技界面表达 Botinkit 品牌。

## 6. Non-Goals / 非目标

- No enterprise SSO, user directory, or production role-management backend in the current demo.
  当前演示不接入企业 SSO、用户目录或正式角色权限后端。
- No direct robot-device connection or validated production parameter delivery.
  当前演示不直连机器人设备，也不下发经过生产验证的设备参数。
- No POS, inventory, ERP, or purchasing integration in the first demo.
  第一版演示不接入 POS、库存、ERP 或采购系统。
- No consumer-facing recipe browsing experience.
  不做面向消费者的菜谱浏览体验。

## 7. Core Workflow / 核心流程

The product workflow is organized around a single dish R&D lifecycle:

产品流程围绕单个菜品研发生命周期组织：

1. Login
   登录
2. Project Center
   项目中心
3. 01 R&D Brief
   01 研发 Brief
4. 02 Robot Data
   02 机器人数据
5. 03 Experiment Versions
   03 实验版本
6. 04 Localization
   04 本地化适配
7. 05 Final Recipe
   05 最终菜谱
8. Optional Expert Review
   可选专家审核
9. Archive and Formal Recipe View
   归档与正式菜谱查看

The 01-05 steps are gated. Users cannot freely jump to future steps before completing the required previous step.

01-05 是有门禁的流程步骤。用户不能在完成前置步骤之前随意跳转到后续步骤。

## 8. Navigation Model / 导航模型

The sidebar has two levels:

侧边栏分为两个层级：

- Work panels: Project Center and Archive Records. These are global workspace panels and can be opened at any time.
  工作面板：项目中心、归档记录。它们是全局工作区入口，可随时进入。
- Current dish workflow: 01-05 stepper. These represent the lifecycle of the current dish project.
  当前菜品流程：01-05 进度条。它们代表当前菜品项目的生命周期。

Project Center and Archive Records must not visually look like lifecycle steps.

项目中心和归档记录不应在视觉上看起来像生命周期步骤。

## 9. Authentication / 登录

### 9.1 Requirement / 需求

Users must see a full login page before entering the product.

用户必须先看到一个完整登录页，才能进入产品。

### 9.2 Login Page / 登录页

Required fields:

必备字段：

- Enterprise email or phone number.
  企业邮箱或手机号。
- Password or verification code.
  密码或验证码。
- Enterprise workspace.
  企业空间。

The login page is a full page, not a modal. The login card should be centered in the viewport.

登录页是完整页面，不是弹窗。登录卡片需要在视口中居中。

### 9.3 Current Prototype Behavior / 当前原型行为

The login interaction is static. Successful login enters the selected enterprise workspace.

登录交互为静态原型。点击登录后进入所选企业空间。

## 10. Project Center / 项目中心

### 10.1 Purpose / 目的

Project Center is the user's home base for finding saved projects, continuing draft work, reviewing action items, and opening archived recipes.

项目中心是用户查找已保存项目、继续草稿、处理待办和查看归档菜谱的工作起点。

### 10.2 Key Sections / 关键板块

- In progress: all unarchived projects.
  进行中项目：所有未归档项目。
- Action needed: compact task list for items that require the current user's attention.
  待我处理：当前用户需要立刻处理的紧凑待办清单。
- Archive preview: recent archived projects, with entry to all archive records.
  归档预览：最近归档项目，并可进入全部归档记录。

### 10.3 Empty State / 空状态

After clearing site data or entering for the first time, there should be no default action items.

清除网站缓存或首次进入时，不应默认出现待办事项。

If no project exists:

如果没有项目：

- In progress shows an empty state.
  进行中项目显示空状态。
- Action needed shows an empty state.
  待我处理显示空状态。
- Users can click New R&D Project.
  用户可以点击新建研发项目。

### 10.4 Save Button Rule / 保存按钮规则

The global Save Progress button should appear only when the user is editing a project step. It should not be a permanent action on the Project Center page.

全局“保存进度”按钮只应在用户编辑项目步骤时出现，不应在项目中心页面常驻。

## 11. Project Creation / 新建项目

### 11.1 Naming / 命名

When creating a new project, the user should name the project and dish working name.

新建项目时，用户应自己填写项目名称和菜品工作名。

AI may suggest dish names, but it must not automatically overwrite user-entered names.

AI 可以建议菜品名，但不能自动覆盖用户填写的名称。

### 11.2 Initial State / 初始状态

New projects should start blank. Real business values must not be prefilled.

新建项目应从空白状态开始，不应预填真实业务内容。

Fallback labels such as "Untitled dish R&D project" may be used for page titles or lists, but the actual form fields should remain empty.

页面标题或列表可以使用“未命名菜品研发项目”作为兜底显示，但表单字段本身应保持为空。

## 12. 01 R&D Brief / 01 研发 Brief

### 12.1 Purpose / 目的

R&D Brief collects the core product, culinary, market, and execution requirements needed to generate robot data.

研发 Brief 用于收集生成机器人数据所需的产品、烹饪、市场和执行要求。

### 12.2 Relationship Between Three Areas / 三个区域的关系

- New Dish R&D is the main form where users define the dish project.
  新菜研发是主表单，用户在这里定义菜品项目。
- AI Analysis and Conflict Check is a helper panel that reads the Brief and highlights recognized information or conflicts.
  AI 解析与冲突检查是辅助面板，用来读取 Brief，并提示已识别信息或冲突。
- Chef Recipe to Robot Steps is an optional secondary input for users who already have a natural-language chef recipe.
  厨师菜谱转机器人步骤是可选的第二入口，适用于已经有厨师自然语言菜谱的用户。

The helper panels should not look like separate parallel workflows. They support the Brief step.

辅助面板不应看起来像三条平行工作流，它们服务于 Brief 这一步。

### 12.3 Required Fields / 必填字段

- Project name.
  项目名称。
- Dish working name.
  菜品工作名。
- Dish goal.
  菜品目标。
- R&D type.
  研发类型。
- Target market.
  目标市场。
- Target batch size.
  目标批量。

### 12.4 Recommended Fields / 建议补充字段

- Store scenario.
  门店场景。
- Target customer.
  目标客群。
- Main protein or main ingredient.
  主蛋白或核心食材。
- Taste goal.
  口味目标。
- Sensory goal.
  感官目标。
- Price or cost target.
  价格或成本目标。

### 12.5 Optional Fields / 可选字段

- Constraints.
  限制条件。
- Pre-processing level.
  预处理程度。
- Robot action boundary.
  机器人动作边界。

### 12.6 Field Interaction / 字段交互

All dropdown fields should use the same custom dropdown style as the target market selector.

所有下拉字段应统一使用目标市场选择器的自定义下拉样式。

Target market should be selected from canonical options, not free text, to avoid country or region spelling errors.

目标市场应从标准选项中选择，不应自由填写，以避免国家或地区名称输入错误。

Taste goal replaces the earlier "spice level" concept because not all dishes are spicy.

“口味目标”替代早期的“辣度目标”，因为并不是所有菜品都有辣度。

### 12.7 Instant Feedback / 即时反馈

The Brief page should provide visible feedback while users fill in or choose information:

Brief 页面应在用户填写或选择时提供可见反馈：

- Field status: filled, recommended, required, optional, or needs confirmation.
  字段状态：已填写、建议补充、必填、可选或需确认。
- Brief completion: for example, 3/6 required fields completed.
  Brief 完成度：例如 6 个必填项中已完成 3 个。
- AI analysis status: waiting, analyzing, recognized, or conflict found.
  AI 解析状态：等待输入、解析中、已识别或发现冲突。
- Name suggestion applied state.
  菜品名建议被应用后的选中状态。
- Disabled generate button with a clear reason.
  生成按钮禁用时应说明原因。

### 12.8 Completion Condition / 完成条件

R&D Brief is considered complete only after the user generates robot data. Saving the Brief does not unlock the next step by itself.

只有用户生成机器人数据后，研发 Brief 才算完成。单纯保存 Brief 不会解锁下一步。

## 13. 02 Robot Data / 02 机器人数据

### 13.1 Purpose / 目的

Robot Data converts the confirmed Brief into executable cooking parameters for Botinkit cooking robots.

机器人数据将确认后的 Brief 转化为 Botinkit 炒菜机器人可执行的烹饪参数。

### 13.2 Required Content / 必备内容

- Temperature and firepower plan.
  温度与火力方案。
- Ingredient drop timing.
  投料节奏。
- Sauce or seasoning timing.
  酱料或调料投放时间。
- Wok action strategy.
  锅体动作策略。
- Batch size range.
  批量范围。
- Quality checkpoints.
  质量检查点。
- Risk notes.
  风险提示。

### 13.3 Visualization Rule / 可视化规则

Temperature or firepower trends and wok actions should not be forced into one graphic. They should be shown as separate, clear data views.

温度或火力趋势与锅体动作不应强行放在同一张图里，应拆成清晰的数据视图。

Avoid abstract curves or decorative slanted lines when they do not directly explain the cooking logic.

如果斜线或曲线不能直接解释烹饪逻辑，就不要使用。

### 13.4 Completion Condition / 完成条件

Robot Data is complete after the user creates an experiment version from the current data.

用户基于当前机器人数据创建实验版本后，机器人数据步骤完成。

## 14. 03 Experiment Versions / 03 实验版本

### 14.1 Purpose / 目的

Experiment Versions compare test batches and help the team decide which version should move forward.

实验版本用于比较打样批次，帮助团队决定哪个版本继续推进。

### 14.2 Required Content / 必备内容

- Version name.
  版本名称。
- Version difference.
  版本差异。
- Tasting notes.
  试吃记录。
- Score.
  评分。
- Photos or videos when available.
  可用时上传照片或视频。
- Review status.
  审核状态。

### 14.3 Completion Condition / 完成条件

Experiment Versions is complete after the user confirms one version for localization.

用户确认一个版本进入本地化适配后，实验版本步骤完成。

## 15. 04 Localization / 04 本地化适配

### 15.1 Purpose / 目的

Localization adapts the selected version for different markets while preserving execution feasibility.

本地化适配用于把选定版本适配到不同市场，同时保留机器人执行可行性。

### 15.2 Required Content / 必备内容

- Market.
  市场。
- Ingredient substitutions.
  食材替换。
- Taste adjustments.
  口味调整。
- Cost impact.
  成本影响。
- Robot execution risk.
  机器人执行风险。
- A persistent notice that live search is disabled, plus AI inferences and concrete items requiring local-team validation.
  常驻显示“联网搜索已关闭”提示，并展示 AI 推断及当地团队需要验证的具体事项。

### 15.3 Completion Condition / 完成条件

Localization is complete after the user generates the final recipe.

用户生成最终菜谱后，本地化适配步骤完成。

## 16. 05 Final Recipe / 05 最终菜谱

### 16.1 Purpose / 目的

Final Recipe presents the confirmed deliverable that can be archived and reviewed later.

最终菜谱呈现可归档、可回看的确认交付物。

### 16.2 Version Types / 版本类型

- Team-confirmed version: the team has confirmed the final recipe without premium expert review.
  团队确认版：团队已确认最终菜谱，但没有高级专家审核。
- Expert-reviewed version: premium expert review has been completed and incorporated.
  专家已审核版：已完成高级专家审核并吸收反馈。

### 16.3 Required Content / 必备内容

- Dish identity and project information.
  菜品身份与项目信息。
- Final robot data summary.
  最终机器人数据摘要。
- Selected experiment version.
  选定实验版本。
- Market localization summary.
  市场本地化摘要。
- Quality checkpoints.
  质量检查点。
- Expert review status.
  专家审核状态。
- Archive action.
  归档操作。

### 16.4 Completion Rule / 完成规则

Expert review is not required to complete the main workflow. Users can archive a team-confirmed recipe without expert review.

专家审核不是主流程完成的必要条件。用户可以不使用专家审核，直接归档团队确认版菜谱。

## 17. Expert Review / 专家审核

### 17.1 Product Role / 产品角色

Expert Review is an optional premium feature. It provides authority, feedback, and higher confidence, but it is not the endpoint of dish design.

专家审核是可选高级功能。它提供权威背书、反馈意见和更高可信度，但不是菜品设计的终点。

### 17.2 States / 状态

- Not enabled: Expert Review is a premium feature.
  未开通：专家审核为高级功能。
- Available: Invite expert review.
  可使用：邀请专家审核。
- In review: Expert review in progress.
  审核中：专家审核中。
- Feedback received: Expert has sent feedback.
  已反馈：专家已反馈意见。
- Incorporated: User has incorporated expert feedback.
  已采纳：用户已采纳专家意见。

### 17.3 Privacy / 隐私

Expert access should be limited to final recipe, experiment versions, and quality records. Original customer recipes remain private by default unless explicitly shared.

专家访问范围应限制在最终菜谱、实验版本和质检记录。原始客户菜谱默认保持私有，除非用户明确共享。

## 18. Archive Records / 归档记录

### 18.1 Purpose / 目的

Archive Records stores completed dish projects and allows users to open formal recipe pages.

归档记录用于保存已完成的菜品项目，并允许用户打开正式菜谱页面。

### 18.2 Requirements / 需求

- The archive page must support multiple archived projects, not only one card.
  归档页面必须支持多个已归档项目，而不是只能容纳一个项目。
- Archived projects should not appear in In Progress or Action Needed.
  已归档项目不应出现在进行中项目或待我处理中。
- Users should be able to open a formal recipe view from each archived item.
  用户应能从每个归档项目打开正式菜谱页。
- Archived projects are read-only by default.
  已归档项目默认只读。

## 19. Save Progress / 保存进度

### 19.1 Rule / 规则

Save Progress saves the current editing state. It does not complete the current workflow step.

保存进度用于保存当前编辑状态，不等于完成当前流程步骤。

### 19.2 Feedback / 反馈

The save button should provide three-layer feedback:

保存按钮应提供三层反馈：

- Button-level feedback: Saving, Saved, then return to Save Progress.
  按钮原位反馈：保存中、已保存，然后恢复为保存进度。
- Top status: Saved just now.
  顶部状态：刚刚保存。
- Toast feedback as secondary confirmation.
  Toast 作为辅助确认反馈。

## 20. Language / 语言

### 20.1 Requirement / 需求

The interface must support Chinese and English through a language switch.

界面必须通过语言切换支持中文和英文。

### 20.2 Rule / 规则

Chinese and English should not be mixed in the same UI labels unless it is a brand name, technical term, or unavoidable imported noun.

除品牌名、技术术语或不可避免的外来词外，同一界面标签不应中英混排。

All labels, empty states, field status messages, button states, validation messages, and dropdown options should be included in the copy system.

所有标签、空状态、字段状态、按钮状态、校验提示和下拉选项都应进入文案系统。

## 21. Visual Direction / 视觉方向

TasteLab AI should feel like a premium food-tech R&D workspace:

TasteLab AI 应呈现高级食物科技研发工作台的气质：

- Theme-coordinated navigation: light navigation with a black Botinkit logo in light mode; pure-black navigation with the official reverse logo in dark mode.
  主题协调的导航：浅色模式使用浅色导航栏和黑色 Botinkit Logo；深色模式使用纯黑导航栏和官方反白 Logo。
- Calendula yellow for primary actions, active steps, and progress.
  金盏花黄用于主操作、当前步骤和进度。
- Warm Clam workspace and white panels in light mode; carbon background and deep-gray panels in dark mode.
  浅色模式使用温暖的 Clam 工作区和白色面板；深色模式使用炭黑背景和深灰面板。
- OPPO Sans as the primary interface font.
  OPPO Sans 作为主要界面字体。
- Real food and cooking context should be present, but not in a stock-photo or consumer recipe style.
  需要有真实食物和烹饪语境，但不能像图库照片或消费级菜谱应用。

### 21.1 Light and Dark Themes / 浅色与深色主题

- A first-time visitor always starts in light mode.
  首次访问始终使用浅色模式。
- The login page and authenticated top bar both expose a one-click theme control using moon and sun icons.
  登录页与登录后的顶部栏均提供使用月亮和太阳图标的一键主题切换入口。
- The selected theme is stored locally and persists across refresh, login, logout, and language changes.
  用户选择的主题保存在本地，并在刷新、登录、退出和语言切换后继续保留。
- The theme applies to navigation, forms, dropdowns, overlays, status components, Robot Data visualizations, archive pages, and formal recipes.
  主题覆盖导航、表单、下拉菜单、浮层、状态组件、机器人数据可视化、归档页面和正式菜谱。
- Food photography and brand textures retain their original colors.
  食物照片与品牌纹理保持原始颜色。
- Body text must reach WCAG AA contrast in both themes; critical states must not rely on color alone.
  两种主题下的正文都必须达到 WCAG AA 对比度；关键状态不能只依赖颜色表达。

## 22. Core Data Objects / 核心数据对象

### 22.1 Workspace / 企业空间

- Workspace ID.
  企业空间 ID。
- Workspace name.
  企业空间名称。
- User role.
  用户角色。
- Expert review entitlement.
  专家审核权益。

### 22.2 R&D Project / 研发项目

- Project ID.
  项目 ID。
- Project name.
  项目名称。
- Dish working name.
  菜品工作名。
- Current unlocked stage.
  当前已解锁阶段。
- Current viewing stage.
  当前查看阶段。
- Save status.
  保存状态。
- Archived status.
  归档状态。

### 22.3 Dish Brief / 菜品 Brief

- Dish goal.
  菜品目标。
- R&D type.
  研发类型。
- Target markets.
  目标市场。
- Store scenario.
  门店场景。
- Target customer.
  目标客群。
- Main ingredient.
  核心食材。
- Taste goal.
  口味目标。
- Sensory goal.
  感官目标。
- Cost target.
  成本目标。
- Batch target.
  批量目标。
- Constraints.
  限制条件。

### 22.4 Robot Data / 机器人数据

- Heat or temperature plan.
  火力或温度方案。
- Ingredient timing.
  投料时间。
- Seasoning timing.
  调料时间。
- Wok motion.
  锅体动作。
- Batch range.
  批量范围。
- Quality gates.
  质检点。
- Risk notes.
  风险提示。

### 22.5 Experiment Version / 实验版本

- Version number.
  版本号。
- Version difference.
  版本差异。
- Tasting record.
  试吃记录。
- Score.
  评分。
- Review status.
  审核状态。

### 22.6 Localization Variant / 本地化变体

- Market.
  市场。
- Ingredient replacement.
  食材替换。
- Taste adjustment.
  口味调整。
- Cost impact.
  成本影响。
- Execution feasibility.
  执行可行性。

### 22.7 Final Recipe / 最终菜谱

- Recipe version type.
  菜谱版本类型。
- Final robot data.
  最终机器人数据。
- Quality checkpoints.
  质检点。
- Localization summary.
  本地化摘要。
- Expert review status.
  专家审核状态。
- Archive date.
  归档日期。

## 23. AI Requirements / AI 能力需求

### 23.1 AI Role / AI 角色

AI is a chef copilot, not an autonomous decision maker.

AI 是主厨副驾，不是自动决策者。

AI can suggest, parse, compare, and generate drafts, but final decisions must be confirmed by the user or expert.

AI 可以建议、解析、比较和生成草案，但关键结果必须由用户或专家确认。

### 23.2 Required AI Capabilities / 必备 AI 能力

- Parse natural-language dish goals.
  解析自然语言菜品目标。
- Detect conflicts between free text and structured selections.
  识别自然语言与结构化选项之间的冲突。
- Suggest dish working names.
  建议菜品工作名。
- Convert chef recipe notes into standardized robot steps.
  将厨师菜谱笔记转化为标准机器人步骤。
- Generate draft robot data.
  生成机器人数据草案。
- Explain the basis of AI suggestions.
  解释 AI 建议依据。
- Preserve user choices and never silently override them.
  保留用户选择，不能静默覆盖。
- Compare experiment records and up to three dish photos while explicitly excluding food-safety, real doneness, and actual sensory judgments.
  对比实验记录与最多三张菜品照片，同时明确不判断食品安全、真实熟度和实际感官体验。
- Generate target-market adaptation proposals without live web search, label every market conclusion as an AI inference, and separate items requiring local-team validation.
  在不启用实时联网搜索的情况下生成目标市场适配建议，将所有市场结论标记为 AI 推断，并区分当地团队待验证项。
- Generate a team-confirmed final recipe draft with assumptions, warnings, provenance, and an audit trail.
  生成包含假设、风险、来源和审计记录的团队确认版最终菜谱草案。

### 23.3 AI Runtime and Trust / AI 运行与信任

- Use Kimi Chat Completions with `kimi-k3` by default. Request JSON Mode output and validate every task with the existing Zod schemas before accepting the result.
  默认使用 Kimi Chat Completions 与 `kimi-k3`，通过 JSON Mode 请求结构化结果，并在接收前使用现有 Zod Schema 校验每类任务。
- The browser calls only the project's Vercel Functions. `MOONSHOT_API_KEY` must never be included in browser code.
  浏览器只调用项目自身的 Vercel Functions，`MOONSHOT_API_KEY` 禁止进入浏览器代码。
- Every AI action is explicitly started by the user and has idle, processing, success, failure, and retry feedback.
  每个 AI 操作都由用户显式触发，并提供空闲、处理中、成功、失败和重试反馈。
- Robot data must always be labeled as an AI demo draft that cannot be sent directly to equipment.
  机器人数据必须始终标注为 AI 演示草案，不可直接下发设备。
- AI must never impersonate expert review. Expert review remains an independent optional premium workflow.
  AI 不得冒充专家审核；专家审核仍是独立、可选的高级功能。

## 24. Access and Privacy / 权限与隐私

- Projects belong to an enterprise workspace.
  项目属于企业空间。
- Customer recipes and experiment records are private by default.
  客户菜谱和实验记录默认私有。
- Expert collaboration can be enabled for selected materials only.
  专家协作只能针对用户选择的资料开放。
- Expert review is premium and should be visibly marked as such.
  专家审核为高级功能，应有清晰标识。

## 25. Success Metrics / 成功指标

For the demo:

演示阶段指标：

- Users understand the full lifecycle from new project to archive.
  用户能理解从新建项目到归档的完整生命周期。
- Users understand that Expert Review is optional and premium.
  用户能理解专家审核是可选高级功能。
- Users can distinguish In Progress from Action Needed.
  用户能区分进行中项目和待我处理。
- Users can understand why locked steps cannot be opened.
  用户能理解未解锁步骤为什么不能进入。
- Users can use Chinese or English without mixed labels or overflow.
  用户能使用中文或英文，且界面不混排、不溢出。

For future production:

未来正式产品指标：

- Time from dish concept to first robot data draft.
  从菜品概念到第一版机器人数据草案的时间。
- Number of experiments needed before final confirmation.
  最终确认前所需实验次数。
- Expert review adoption rate.
  专家审核使用率。
- Archive reuse rate.
  已归档菜谱复用率。
- Localization completion rate.
  本地化适配完成率。

## 26. MVP Scope / MVP 范围

### 26.1 Included / 包含

- Full login page prototype.
  完整登录页原型。
- Shared demo access-code session implemented with secure server-issued cookies.
  使用服务端安全 Cookie 实现共享演示口令会话。
- Project Center.
  项目中心。
- Gated 01-05 workflow.
  带门禁的 01-05 流程。
- Empty Brief initial state.
  空白 Brief 初始态。
- Custom dropdown controls.
  自定义下拉控件。
- Real AI Brief analysis and conflict checking.
  真实 AI Brief 解析与冲突检查。
- Robot Data page.
  机器人数据页。
- Experiment versions.
  实验版本。
- Localization variants.
  本地化变体。
- Inference-only localization proposals with a persistent human-validation warning.
  常驻人工验证提示的纯 AI 推断本地化建议。
- Final Recipe page.
  最终菜谱页。
- Optional Expert Review module.
  可选专家审核模块。
- Archive records and formal recipe entry.
  归档记录与正式菜谱入口。
- Chinese and English language switch.
  中英文语言切换。

### 26.2 Excluded / 不包含

- Enterprise identity, SSO, database-backed accounts, and role administration.
  企业身份、SSO、数据库账号和角色管理。
- Database persistence for project or AI results.
  项目与 AI 结果的数据库持久化。
- Real robot execution data upload.
  真实机器人执行数据上传。
- Real expert account system.
  真实专家账号系统。
- Real payment or entitlement management.
  真实支付或权益管理。

## 27. Acceptance Criteria / 验收标准

- A user cannot enter the app before the login page.
  用户必须先经过登录页才能进入应用。
- After clearing site data, Project Center has no default todo.
  清除站点数据后，项目中心没有默认待办。
- A new project starts with blank input fields.
  新建项目输入字段为空。
- Target market is selected from controlled options.
  目标市场从受控选项中选择。
- All dropdown fields share the same custom dropdown style.
  所有下拉字段采用统一自定义下拉样式。
- 01-05 steps cannot be opened before they are unlocked.
  01-05 步骤未解锁前不能进入。
- Save Progress gives visible button-level feedback.
  保存进度提供按钮原位可见反馈。
- Expert Review is optional and premium.
  专家审核是可选高级功能。
- Archived projects open formal recipe views.
  已归档项目可以打开正式菜谱页。
- Chinese and English modes do not mix UI copy.
  中文和英文模式不混排 UI 文案。

## 28. Open Questions / 待确认问题

- What exact enterprise roles and permissions are needed for production?
  正式产品需要哪些企业角色和权限？
- Which markets should be included in the controlled target market list?
  目标市场标准选项应包含哪些国家或地区？
- What robot data fields are required by Botinkit OMNI or future KMES integration?
  Botinkit OMNI 或未来 KMES 集成需要哪些机器人数据字段？
- What should be the paid packaging model for Expert Review?
  专家审核的付费包装方式应如何设计？
- Should archived formal recipes support export to PDF or sharing links?
  已归档正式菜谱是否需要支持 PDF 导出或分享链接？
