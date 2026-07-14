# AGENTS.md / 项目协作说明

## Project Context / 项目背景

This project is a front-end / UI prototype project maintained by a UI/UX designer. The goal is to build, adjust, and verify interface ideas in a clear, visual, and reviewable way.

这是一个由 UI/UX 设计师维护的前端界面原型项目。项目目标是以清晰、可视化、便于评审的方式构建、调整和验证界面想法。

## Working Style / 工作方式

- Before making major changes, first understand the project structure.
  在进行较大改动前，先理解项目结构。
- For non-trivial changes, summarize the plan before editing.
  对于非简单改动，编辑前先简要说明计划。
- Prefer small, safe, reversible changes.
  优先采用小范围、安全、可回退的改动。
- Explain changes in simple language.
  用简单清楚的语言解释改动。
- Do not rewrite or delete large sections of code unless clearly necessary.
  除非明确必要，不要大规模重写或删除代码。

## UI/UX Guidelines / UI/UX 指南

- Preserve the original design intent unless a redesign is requested.
  除非要求重新设计，否则保留原有设计意图。
- Pay attention to layout, spacing, hierarchy, typography, visual consistency, and interaction feedback.
  关注布局、间距、层级、字体、视觉一致性和交互反馈。
- Consider common UI states, including default, hover, active, disabled, loading, empty, and error states.
  考虑常见 UI 状态，包括默认、悬停、激活、禁用、加载、空状态和错误状态。
- Consider responsive behavior across different screen sizes.
  考虑不同屏幕尺寸下的响应式表现。
- When there are multiple implementation options, prefer the one that is easiest to maintain and review.
  当存在多种实现方式时，优先选择最容易维护和评审的方案。

## Code Guidelines / 代码指南

- Keep the code structure clean and understandable.
  保持代码结构清晰易懂。
- Reuse existing components, styles, and patterns where possible.
  尽可能复用已有组件、样式和模式。
- Avoid adding new dependencies unless necessary.
  除非必要，避免新增依赖。
- If a new dependency is needed, explain why before adding it.
  如果确实需要新增依赖，在添加前说明原因。
- Do not change unrelated files.
  不要改动无关文件。

## Verification / 验证

- After making changes, summarize what changed.
  完成改动后，总结变更内容。
- List the files that were modified.
  列出被修改的文件。
- Explain how to preview or test the result locally.
  说明如何在本地预览或测试结果。
- Mention any limitations, assumptions, or unfinished parts.
  说明任何限制、假设或未完成部分。

## Skill Usage Disclosure / Skill 使用披露

If any skill is used during the task, the final response must explicitly disclose the actual skill usage. At minimum, include the skill name, purpose, trigger reason, execution result, and whether the success criteria were met. Success criteria must be defined before invoking the skill, must be verifiable, and must not be replaced by vague wording such as "used" or "tried." If the skill does not meet the success criteria, mark it as failed or partially successful, and briefly explain the reason, impact, and next step. If no skill is used, explicitly state that no skill was used. Do not hide, omit, or blur actual skill usage.

当本次任务调用任何 skill 时，必须在最终输出中显式披露本次实际使用的 skill，至少说明 skill 名称、调用目的、触发原因、执行结果以及是否达到成功标准。成功标准必须在调用前就明确，并且必须可验证，不能使用“已调用”“已尝试”这类模糊表述代替效果判断。若 skill 未达到成功标准，必须明确标记为失败或部分成功，并简要说明原因、影响范围以及后续处理方式。若未调用任何 skill，也应明确说明本次未使用 skill，禁止隐藏、省略或模糊化 skill 的实际使用情况。

## Do Not / 禁止事项

- Do not make broad architectural changes without explaining the reason.
  不要在未说明原因的情况下进行大范围架构改动。
- Do not silently remove existing features.
  不要静默移除已有功能。
- Do not assume the visual direction when the requirement is ambiguous; make a reasonable proposal first.
  当视觉方向需求不明确时，不要直接假设；应先提出合理方案。
