const views = Array.from(document.querySelectorAll("[data-view]"));
const navButtons = Array.from(document.querySelectorAll("[data-view-target]"));
const privacyButtons = Array.from(document.querySelectorAll("[data-privacy-mode]"));
const languageButtons = Array.from(document.querySelectorAll("[data-language]"));
const toast = document.querySelector(".toast");
const dishForm = document.querySelector(".ai-form");
const dishBrief = document.querySelector("#dish-brief");
const dishError = document.querySelector("#dish-brief-error");
const generateButton = document.querySelector("[data-generate-button]");
const blueprintState = document.querySelector("[data-blueprint-state]");
const reviewMode = document.querySelector("[data-review-mode]");
const privacyCopy = document.querySelector("[data-privacy-copy]");
const privacyStateLabel = document.querySelector("[data-privacy-state-label]");
const privacyCta = document.querySelector("[data-privacy-cta]");
const privacyPanel = document.querySelector(".privacy-panel");
const reviewSummary = document.querySelector("[data-review-summary]");
const shareScopeList = document.querySelector("[data-share-scope]");
const robotizedSteps = document.querySelector("[data-robotized-steps]");
const currentStageLabel = document.querySelector("[data-current-stage]");
const saveStateLabel = document.querySelector("[data-save-state]");
const saveProgressButton = document.querySelector("[data-action='save-progress']");
const currentWorkspaceLabel = document.querySelector("[data-current-workspace]");
const skipLink = document.querySelector(".skip-link");
const appShell = document.querySelector(".app-shell");
const loginPanel = document.querySelector("[data-login-page]");
const loginForm = document.querySelector(".login-form");
const accountMenu = document.querySelector("[data-account-menu]");
const projectNameInput = document.querySelector("[data-project-name]");
const dishNameInput = document.querySelector("[data-dish-name]");
const chefRecipeInput = document.querySelector("#chef-recipe");
const robotizeButton = document.querySelector("[data-action='robotize']");

const workflowOrder = ["dashboard", "ideation", "blueprint", "versions", "localization", "final"];
const workflowStages = workflowOrder.filter((stage) => stage !== "dashboard");

const state = {
  language: "zh",
  privacyMode: "private",
  selectedVersion: "V4",
  robotized: false,
  blueprintDraft: false,
  authState: "signedOut",
  currentWorkspace: "Botinkit 深圳研发空间",
  projectStage: "dashboard",
  activeProjectId: null,
  selectedArchiveId: "archive-shrimp-bowl",
  expertReviewStatus: "locked",
  isPremiumExpertEnabled: false,
  lastSavedAt: null,
  saveFeedbackState: "idle",
  briefTouchedFields: [],
  briefResolvedConflicts: [],
  briefAnalysisState: "empty",
  selectedNameSuggestion: null,
  marketMenuOpen: false,
  activeProjects: [],
  archivedProjects: [
    {
      id: "archive-shrimp-bowl",
      versionStatus: "expert",
      zh: {
        projectName: "新加坡叻沙虾仁饭机器人化",
        dishName: "叻沙虾仁饭",
        summary: "已形成门店复现用正式菜谱，专家确认高汤浓度与虾仁口感窗口。",
        archivedAt: "2026-07-08",
        batch: "18 份",
        cycle: "132 秒",
        markets: "新加坡 / 美国",
        marketCount: "2 个",
        brief: "面向新加坡和美国商场快餐门店的叻沙虾仁饭，保留椰香与微辣层次，控制虾仁回缩风险。"
      },
      en: {
        projectName: "Singapore laksa shrimp rice robotization",
        dishName: "Laksa shrimp rice",
        summary: "Formal store reproduction recipe archived, with expert confirmation on stock concentration and shrimp texture window.",
        archivedAt: "2026-07-08",
        batch: "18 portions",
        cycle: "132 seconds",
        markets: "Singapore / United States",
        marketCount: "2",
        brief: "Laksa shrimp rice for Singapore and U.S. mall quick-service stores, preserving coconut aroma and mild heat while controlling shrimp shrinkage risk."
      }
    },
    {
      id: "archive-tofu-noodle",
      versionStatus: "team",
      zh: {
        projectName: "华东轻食豆腐面季节菜单",
        dishName: "菌菇豆腐拌面",
        summary: "团队确认版已归档，用于秋季轻食菜单复制。",
        archivedAt: "2026-07-06",
        batch: "22 份",
        cycle: "118 秒",
        markets: "中国大陆",
        marketCount: "1 个",
        brief: "低油轻食场景下的菌菇豆腐拌面，突出酱香与豆腐完整度，适配午餐高峰。"
      },
      en: {
        projectName: "East China light tofu noodle seasonal menu",
        dishName: "Mushroom tofu noodle",
        summary: "Team-confirmed version archived for autumn light-menu rollout.",
        archivedAt: "2026-07-06",
        batch: "22 portions",
        cycle: "118 seconds",
        markets: "Mainland China",
        marketCount: "1",
        brief: "A low-oil mushroom tofu noodle for lunch rush, emphasizing sauce aroma and tofu integrity."
      }
    }
  ]
};

let saveFeedbackTimer = null;
let saveFeedbackResetTimer = null;
let briefAnalysisTimer = null;

const copy = {
  zh: {
    langAttr: "zh-CN",
    aria: {
      sideRail: "TasteLab 导航",
      mainNav: "主导航",
      privacy: "项目可见范围",
      language: "语言切换",
      blueprintChart: "从预热到出锅的分段温度计划",
      ingredientSchedule: "投料节奏表",
      thermalMini: "温度阶段摘要",
      readiness: "机器人数据完成度 82%",
      versions: "实验版本"
    },
    skip: "跳到工作区",
    panelNav: {
      section: "工作面板",
      items: {
        dashboard: ["项目中心", "项目与待办"],
        archive: ["归档记录", "已完成项目"]
      }
    },
    workflowNav: {
      section: "当前菜品流程",
      items: {
        ideation: ["研发 Brief", "需求确认"],
        blueprint: ["机器人数据", "执行参数"],
        versions: ["实验版本", "打样对比"],
        localization: ["本地化适配", "市场变体"],
        final: ["最终菜谱", "可归档版本"]
      }
    },
    privacy: {
      title: "企业空间",
      private: "内部研发",
      expert: "专家协作",
      privateState: "内部研发",
      expertState: "专家协作已开放",
      privateCopy: "当前项目归属于企业团队空间，客户菜谱与实验记录默认不对外共享。",
      expertCopy: "已开放专家审核访问；受邀专家可查看最终机器人数据、实验版本和质检记录。",
      privateMode: "内部研发",
      expertMode: "专家协作",
      privateCta: "查看最终菜谱",
      expertCta: "管理专家审核"
    },
    top: {
      label: "TasteLab AI 菜品研发平台",
      title: "新建菜品研发项目",
      save: "保存进度",
      saving: "保存中",
      saved: "已保存",
      savedButton: "已保存",
      savedJustNow: "刚刚保存",
      unsaved: "有未保存更改",
      stagePrefix: "当前阶段",
      login: "登录",
      workspace: "Botinkit 深圳研发空间",
      accountUser: "Hannah Ma · 产品设计",
      accountMenuTitle: "企业账号",
      logout: "退出登录"
    },
    workflow: {
      statuses: {
        current: "当前",
        complete: "已完成",
        available: "可继续",
        locked: "未解锁",
        notStarted: "未开始",
        pending: "待确认",
        archived: "已归档",
        notArchived: "未归档",
        ready: "可新建"
      },
      stages: {
        dashboard: "项目中心",
        ideation: "研发 Brief",
        blueprint: "机器人数据",
        versions: "实验版本",
        localization: "本地化适配",
        final: "最终菜谱",
        archive: "归档记录",
        review: "专家审核"
      }
    },
    login: {
      kicker: "企业登录",
      title: "登录 TasteLab AI",
      intro: "使用企业邮箱或手机号进入团队研发空间。",
      heroTitle: "企业菜品研发入口",
      heroCopy: "登录后进入企业空间，继续管理菜品 Brief、机器人数据、实验版本、最终菜谱和归档记录。",
      proof: {
        workspace: "企业空间",
        privacy: "项目私有",
        archive: "最终归档"
      },
      labels: {
        email: "企业邮箱 / 手机号",
        password: "密码或验证码",
        workspace: "企业空间"
      },
      workspaces: ["Botinkit 深圳研发空间", "Botinkit Global Taste Lab"],
      cancel: "取消",
      submit: "登录",
      close: "关闭登录面板"
    },
    dashboard: {
      kicker: "当前项目",
      title: "从菜品创意到机器人可执行数据",
      intro: "AI 将主厨目标、菜谱语言和地区限制转成可打样的火候、投料、翻炒和质检方案。主厨确认后，再进入专家审核。",
      dataStrip: ["机器人后厨", "计算风味", "数据 V4"],
      start: "开始新实验",
      viewBlueprint: "查看机器人数据",
      figcaptionLabel: "原型 V4",
      figcaptionTitle: "麻香层次提升",
      readinessKicker: "机器人数据完成度",
      readinessTitle: "机器人数据完成度",
      readinessStatus: "可进入试吃",
      metrics: ["批量", "出餐", "成本"],
      pipelineKicker: "研发管线",
      pipelineTitle: "项目管线",
      pipelineStatus: "2 项待处理",
      pipeline: [
        ["创意确认", "概念已锁定"],
        ["机器人化草案", "参数草案"],
        ["门店打样", "试吃中"],
        ["最终菜谱", "可归档"]
      ],
      thermalKicker: "机器人可执行数据",
      thermalTitle: "执行参数摘要",
      thermalStages: [
        ["预热", "180C"],
        ["煎香", "198C"],
        ["收汁", "158C"],
        ["出锅", "142C"]
      ],
      thermalNotes: ["预热 12 秒", "峰值 198C", "24 份上限"],
      reviewKicker: "专家队列",
      reviewTitle: "专家待审",
      reviewStatus: "私有",
      reviewerTitle: "国际御厨审核",
      reviewerNote: "口感目标与批量稳定性",
      inviteCompact: "邀请"
    },
    projectCenter: {
      kicker: "项目中心",
      title: "企业研发项目",
      intro: "所有保存中的菜品研发都会先回到这里。继续编辑进行中项目；确认完成后再归档为正式菜谱。",
      newProject: "新建研发项目",
      viewAllArchive: "查看全部",
      activeKicker: "In progress",
      activeTitle: "进行中项目",
      todoKicker: "Action needed",
      todoTitle: "待我处理",
      todoNote: "需要你确认、处理冲突或查看反馈的事项。",
      archiveKicker: "Archive",
      archiveTitle: "已归档项目",
      continue: "继续编辑",
      processTodo: "处理待办",
      viewRecipe: "查看正式菜谱",
      inProgressLabel: "进行中",
      needsActionLabel: "需处理",
      emptyActive: "暂无进行中项目。新建研发项目后，保存的草稿会出现在这里。",
      emptyTodo: "当前没有需要处理的冲突、反馈或确认项。",
      emptyArchive: "暂无归档项目。最终菜谱归档后会出现在这里。",
      todoActions: {
        confirm: "去确认",
        process: "去处理",
        review: "查看反馈"
      },
      todoDetails: {
        final: "最终菜谱已生成，请确认是否归档为正式菜谱，或先邀请专家审核。",
        ideation: "项目仍在 Brief 阶段，请补齐项目名称、菜品工作名和菜品目标。",
        feedback: "专家意见已返回，请查看后决定是否采纳并更新最终菜谱。",
        default: "该项目有一项需要你处理的流程事项。"
      },
      labels: {
        dish: "菜品工作名",
        stage: "当前阶段",
        saved: "保存时间",
        owner: "负责人",
        progress: "完成度",
        archivedAt: "归档时间",
        version: "版本",
        batch: "批量",
        markets: "市场"
      }
    },
    projectNaming: {
      title: "项目命名",
      projectName: "项目名称",
      dishName: "菜品工作名",
      note: "AI 可以建议菜品名，但不会自动覆盖项目名称或菜品工作名。",
      suggestionsLabel: "AI 推荐菜品名",
      suggestions: ["麻香鸡肉饭", "椒香嫩鸡饭", "Sichuan Pepper Chicken Rice"],
      applied: "已应用到菜品工作名",
      placeholders: {
        projectName: "例如：2026 Q3 海外午餐鸡肉饭研发",
        dishName: "例如：川味鸡肉饭"
      }
    },
    ideation: {
      kicker: "AI 主厨副驾",
      title: "新菜研发 Brief",
      status: "主入口",
      dishLabel: "菜品目标",
      dishPlaceholder: "例如：为海外门店开发一款川味鸡肉饭，适合午餐高峰，微辣可选，保留花椒香气，目标成本低于 3 美元。",
      error: "请输入菜品目标，AI 才能生成机器人数据。",
      selectPlaceholder: "请选择",
      marketPlaceholder: "请选择目标市场",
      marketMore: (count) => `+${count}`,
      requiredHint: "请先完成必填项",
      completion: (done, total) => `Brief 完成度：${done}/${total} 必填已完成`,
      fieldStates: {
        filled: "已填写",
        required: "必填",
        suggested: "建议补充",
        optional: "可选"
      },
      requiredFields: {
        projectName: "项目名称",
        dishName: "菜品工作名",
        dishGoal: "菜品目标",
        type: "研发类型",
        markets: "目标市场",
        batch: "目标批量"
      },
      sections: {
        context: "研发上下文",
        positioning: "菜品定位",
        boundaries: "可选补充"
      },
      briefFields: {
        type: ["研发类型", ["新菜研发", "现有菜谱机器人化", "地区本地化", "季节菜单升级"]],
        scene: ["门店场景", ["午餐高峰", "晚餐正餐", "外卖碗饭", "商场快餐", "海外门店试点"]],
        markets: ["目标市场", ""],
        audience: ["目标客群", ["海外白领午餐", "家庭客群", "学生", "高客单商务", "夜宵人群"]],
        protein: ["主蛋白", ["鸡腿肉", "牛肉", "虾仁", "豆腐", "混合蔬菜"]],
        price: ["价格 / 成本", "例如：$8.90-$10.90 / 成本 $2.84"],
        spice: ["口味目标", ["清淡低油", "咸鲜均衡", "麻辣突出", "酸甜平衡", "香气保留", "儿童友好"]],
        aroma: ["感官目标", ["花椒香强保留", "锅气优先", "低油清爽", "酱香浓郁"]],
        constraints: ["限制条件", "例如：不含花生、微辣档、低钠酱汁"],
        batch: ["目标批量", "例如：18-24 份"],
        prep: ["预处理程度", ["鸡肉预切配", "门店现切", "中央厨房腌制", "冷冻半成品"]],
        robot: ["机器人动作边界", ["标准翻炒强度", "柔和翻炒", "高火快炒", "低速收汁"]]
      },
      marketOptions: ["中国大陆", "新加坡", "美国", "马来西亚", "日本", "韩国", "澳大利亚", "阿联酋"],
      analysis: {
        kicker: "AI 解析",
        title: "AI 实时解析与冲突检查",
        emptyStatus: "等待输入 Brief",
        analyzingStatus: "解析中",
        readyStatus: "已识别",
        conflictStatus: (count) => `${count} 项需确认`,
        detectedTitle: "从描述识别到",
        sensoryTitle: "AI 识别的感官关键词",
        emptyDetected: "填写菜品目标后，AI 会识别场景、口味、成本和限制条件。",
        analyzingDetected: "正在解析菜品目标...",
        defaultDetected: "已识别菜品目标",
        confirmedTitle: "用户已确认",
        emptyConfirmed: "选择结构化字段后会在这里同步。",
        conflictTitle: "需要主厨确认",
        noConflicts: "暂未发现需要确认的冲突。",
        resolved: "已处理",
        conflictActions: ["使用结构化选项", "使用自然语言", "生成两个变体"],
        conflict: ["口味目标冲突", "自然语言提到“微辣可选”，但结构化选项为“麻辣突出”。AI 默认不覆盖，等待主厨确认。"],
        tokens: {
          lunch: "午餐高峰",
          mild: "微辣可选",
          pepper: "花椒香保留",
          cost: "成本低于 $3"
        },
        sensoryKeywords: {
          numbing: "麻感中高",
          pepper: "花椒香保留",
          rice: "米饭颗粒感",
          lowOil: "低油收尾",
          savory: "咸鲜平衡"
        }
      },
      generate: "生成机器人数据",
      generating: "生成中",
      robotizeKicker: "已有菜谱入口",
      robotizeTitle: "已有厨师菜谱？转成机器人步骤",
      robotizeStatus: "可选入口",
      chefLabel: "厨师原始描述",
      chefPlaceholder: "粘贴厨师自然语言菜谱，例如：热锅下油，鸡腿肉炒到边缘焦香，加豆瓣、姜蒜和花椒油，最后用高汤收汁。",
      robotizeButton: "标准化步骤",
      emptySteps: "输入厨师原始描述后，可生成标准机器人步骤。",
      generatedSteps: [
        "识别主料、酱料、香气油和收汁目标，生成标准投料清单。",
        "将厨师语言拆成预热、煎香、混合、收汁、出锅五个机器人阶段。",
        "标记口味风险：花椒油不进入高温段，避免香气挥发。"
      ]
    },
    blueprint: {
      kicker: "机器人可执行数据",
      title: "机器人可执行数据",
      state: "V4 已生成",
      temperatureTitle: "火力阶段",
      temperatureSubtitle: "温度按阶段锁定展示，不与锅体动作混在同一图中。",
      temperatureStages: [
        ["0-12s", "180C", "预热"],
        ["12-54s", "198C", "煎香"],
        ["54-96s", "158C", "收汁"],
        ["96-120s", "142C", "出锅"]
      ],
      ingredientTitle: "投料节奏",
      ingredientHeaders: ["时间", "投料", "用量"],
      ingredients: [
        ["12s", "鸡腿肉", "220 g"],
        ["54s", "酱料", "36 g"],
        ["78s", "高汤", "42 ml"],
        ["108s", "点缀", "8 g"]
      ],
      actionKicker: "锅体动作策略",
      actionTitle: "锅体动作",
      actions: [
        ["轻翻", "12-42s / 38 rpm / 鸡肉上色"],
        ["混合", "54-78s / 22 rpm / 酱料均匀包裹"],
        ["收汁", "78-104s / 16 rpm / 控制米饭颗粒感"]
      ],
      parameters: ["预热温度", "翻炒速度", "酱料投放", "批量范围"],
      qualityKicker: "质量检查点",
      qualityTitle: "质检点",
      quality: [
        ["鸡肉边缘焦香", "42-48 秒出现可见焦化边缘"],
        ["花椒香气保留", "高温段结束后再加入香气油"],
        ["米饭颗粒感", "收汁浓度控制在 34 Brix 以下"],
        ["高峰批量风险", "超过 24 份可能让点缀变软"]
      ]
    },
    versions: {
      kicker: "实验版本",
      title: "实验版本对比",
      selectedKicker: "当前版本",
      rows: [
        ["V4", "麻香后置", "评分 8.6，成本 $2.84"],
        ["V3", "酱料提前", "评分 7.9，成本 $2.79"],
        ["V2", "高火快炒", "评分 7.4，成本 $2.92"]
      ],
      details: {
        V4: ["V4 麻香后置", "8.6 试吃评分", "花椒油后置，香气提升，辣度更稳定。"],
        V3: ["V3 酱料提前", "7.9 试吃评分", "酱料提前融合更快，但鸡肉焦香被覆盖。"],
        V2: ["V2 高火快炒", "7.4 试吃评分", "高火带来香气，但 24 份批量时边缘过干。"]
      },
      detailLabels: ["主要变化", "审核记录", "下一步"],
      audit: "AI 草案 -> 主厨确认 -> 专家待审",
      next: "在新加坡试点门店运行 24 份批量测试。"
    },
    localization: {
      kicker: "区域适配",
      title: "多地区本地化变体",
      compare: "比较",
      cards: [
        ["中国大陆", "保留中辣和豆瓣香，午餐套餐可加青笋丁。", ["辣度", "成本", "替换"], ["3.5/5", "$2.42", "本地鸡腿肉"]],
        ["新加坡", "辣度分层，增加微辣档，减少油感并保留花椒香。", ["辣度", "成本", "替换"], ["2.5/5", "$2.84", "清真高汤"]],
        ["美国", "突出香辣甜平衡，配菜改为玉米和青葱，适配碗饭菜单。", ["辣度", "成本", "替换"], ["2/5", "$3.08", "低钠酱汁"]]
      ]
    },
    stageActions: {
      blueprintNext: "创建实验版本",
      versionsNext: "确认版本",
      localizationNext: "生成最终菜谱"
    },
    finalRecipe: {
      kicker: "最终菜谱",
      title: "川味鸡肉饭最终菜谱",
      statusTeam: "团队确认版",
      statusExpert: "专家已审核版",
      labels: {
        blueprint: "机器人数据",
        version: "实验版本",
        market: "市场适配"
      },
      copies: {
        blueprint: "火力、投料、锅体动作和质检点已可用于门店打样。",
        version: "试吃评分 8.6，保留花椒香气并降低收尾油感。",
        market: "三地辣度、成本和替换食材已形成可执行差异。"
      },
      market: "中国 / 新加坡 / 美国",
      handoff: "交付内容",
      handoffItems: {
        robot: "机器人执行参数：预热 180C，峰值 198C，批量上限 24 份。",
        qc: "质检点：鸡肉焦香、花椒香保留、米饭颗粒感、批量风险。",
        market: "区域版本：保留本地食材替换和辣度分层。"
      },
      archive: "归档项目"
    },
    expertModule: {
      kicker: "高级功能",
      title: "专家审核",
      points: {
        scopeTitle: "审核范围可控",
        scope: "只共享最终机器人数据、实验版本和质检记录。",
        feedbackTitle: "专家可反馈意见",
        feedback: "收到意见后，用户可返回修改并重新生成最终菜谱。"
      },
      actions: {
        enable: "开通高级功能",
        invite: "邀请专家审核",
        receive: "模拟收到反馈",
        apply: "采纳意见并更新最终菜谱"
      },
      states: {
        locked: ["高级功能", "专家审核为高级功能。不开通也可以生成团队确认版并归档。"],
        available: ["可邀请", "已开通专家审核。你可以在认可当前菜谱后邀请专家反馈意见。"],
        pending: ["专家审核中", "专家正在查看最终机器人数据、实验版本和质检记录。"],
        feedback_received: ["专家已反馈意见", "专家建议：微辣版本保留花椒香气，24 份以上需降低收汁粘度风险。"],
        applied: ["专家已审核版", "专家意见已采纳，最终菜谱已更新为专家已审核版。"]
      }
    },
    archive: {
      kicker: "归档记录",
      title: "已归档菜品项目",
      statusOpen: "未归档",
      statusArchived: "已归档",
      projectTitle: "川味鸡肉饭全球化研发",
      emptyTitle: "还没有归档项目",
      emptyCopy: "最终菜谱确认后，可以归档为只读记录。",
      archivedCopy: "最终菜谱已归档。项目可回看，但不会继续推进。",
      viewRecipe: "查看正式菜谱",
      labels: {
        status: "已归档",
        version: "版本",
        batch: "批量",
        markets: "市场"
      },
      values: {
        batch: "24 份",
        markets: "3 个"
      }
    },
    formalRecipe: {
      kicker: "正式菜谱",
      title: "川味鸡肉饭",
      statusTeam: "团队确认版",
      statusExpert: "专家已审核版",
      subtitle: "归档后的只读菜谱格式，用于门店复现、专家回看和内部审计。",
      back: "返回归档",
      metaLabels: {
        project: "项目",
        batch: "批量",
        cycle: "单锅周期",
        markets: "适配市场"
      },
      metaValues: {
        project: "川味鸡肉饭全球化研发",
        batch: "24 份",
        cycle: "120 秒",
        markets: "中国 / 新加坡 / 美国"
      },
      sections: {
        brief: "菜品定义",
        ingredients: "标准原料",
        robot: "机器人执行步骤",
        qc: "质检点",
        audit: "归档审计"
      },
      brief: "面向海外午餐高峰的川味鸡肉饭，保留花椒香气，提供微辣档，目标成本低于 3 美元。",
      ingredientsHeaders: ["原料", "用量", "备注"],
      ingredients: [
        ["鸡腿肉", "220 g", "预切配"],
        ["复合酱料", "36 g", "低钠版本"],
        ["高汤", "42 ml", "按市场替换"],
        ["花椒香气油", "8 ml", "高温后加入"]
      ],
      robotHeaders: ["阶段", "温度", "时间", "动作"],
      robotRows: [
        ["预热", "180C", "0-12s", "空锅稳定"],
        ["煎香", "198C", "12-54s", "38 rpm 轻翻"],
        ["收汁", "158C", "54-96s", "22 rpm 混合"],
        ["出锅", "142C", "96-120s", "加入点缀"]
      ],
      qc: {
        browning: "42-48 秒出现鸡肉可见焦化边缘。",
        aroma: "花椒油不进入高温段，保留香气。",
        batch: "超过 24 份需重新测试点缀软化风险。"
      },
      audit: {
        readonly: "归档后为只读记录。",
        owner: "团队确认版由主厨确认。",
        source: "保留 V4 实验版本和机器人数据来源。"
      }
    },
    review: {
      kicker: "专家审核室",
      title: "专家审核室",
      logTitle: "可回溯记录",
      trustKicker: "信任控制",
      trustTitle: "隐私与协作",
      shareTitle: "共享范围",
      states: {
        private: {
          avatar: "IN",
          chefTitle: "尚未开放专家协作",
          chefNote: "当前项目仅团队可见。确认机器人数据版本后，可邀请 Botinkit Taste Lab 或外部专家审核。",
          log: [
            ["AI 提案", "已生成花椒油后置的 V4 机器人数据。"],
            ["主厨确认", "已接受口感目标，并要求降低收尾油感。"],
            ["专家待邀请", "尚未共享给外部专家。"]
          ],
          trust: [
            ["团队内可见", "客户菜谱、机器人数据和试吃记录仅保留在团队空间。"],
            ["专家需主动邀请", "Botinkit Taste Lab 不会默认访问项目。"],
            ["邀请前可确认范围", "可先选择共享机器人数据、实验版本和质检记录。"]
          ],
          shareScope: [
            ["check", "可共享 V4 机器人数据"],
            ["check", "可共享实验版本与质检记录"],
            ["lock-keyhole", "原始客户菜谱保持私有"]
          ],
          sendInvite: "邀请专家审核"
        },
        expert: {
          avatar: "YC",
          chefTitle: "国际御厨",
          chefNote: "已获得花椒油后置策略建议：保留香气层次，但 24 份以上需要降低收汁粘度风险。",
          log: [
            ["AI 提案", "已生成花椒油后置的 V4 机器人数据。"],
            ["主厨确认", "已接受口感目标，并要求降低收尾油感。"],
            ["专家意见", "建议微辣版本保留花椒香气，批量上限暂定 24 份。"]
          ],
          trust: [
            ["已开放专家协作", "受邀专家可查看机器人数据、版本和质检记录。"],
            ["客户菜谱仍私有", "原始配方和内部实验记录不会默认共享。"],
            ["权限可撤回", "项目负责人可随时关闭专家访问。"]
          ],
          shareScope: [
            ["check", "已共享 V4 机器人数据"],
            ["check", "已共享实验版本与质检记录"],
            ["lock-keyhole", "原始客户菜谱未共享"]
          ],
          sendInvite: "管理协作权限"
        }
      }
    },
    units: {
      "preheat-value": "C",
      "speed-value": " rpm",
      "sauce-value": " 秒",
      "batch-value": " 份"
    },
    toasts: {
      missingBrief: "需要先填写菜品目标。",
      generated: "AI 已生成 V5 机器人数据草案，可进入机器人数据页确认。",
      invite: "专家协作已开启，已共享机器人数据、实验版本和质检记录。",
      permissions: "可在这里管理专家访问权限与共享范围。",
      conflictChoice: "已记录主厨选择，AI 将保留冲突依据并更新机器人数据草案。",
      robotized: "厨师描述已转成机器人步骤草案。",
      compared: "已比较三地食材替换、辣度和成本假设。",
      privacyPrivate: "已切回内部研发，专家访问已关闭。",
      privacyExpert: "专家协作模式已开启。",
      language: "已切换为中文。",
      saved: "当前项目进度已保存。",
      loginSuccess: "已进入企业研发空间。",
      logout: "已退出登录。",
      premiumEnabled: "专家审核高级功能已开通。",
      expertInvited: "已向专家发送审核邀请。",
      expertFeedback: "已收到专家反馈，可返回修改或采纳意见。",
      expertApplied: "已采纳专家意见，最终菜谱更新为专家已审核版。",
      archived: "项目已归档为只读记录。",
      noActiveProject: "没有进行中的研发项目，请先从项目中心新建或继续编辑项目。",
      newProject: "已创建新的研发项目，请先命名项目并填写菜品目标。",
      workflowAdvanced: "已解锁下一步，可继续推进菜品研发。",
      missingBriefRequired: "请先完成 Brief 必填项。",
      missingChefRecipe: "请先输入厨师原始描述。"
    }
  },
  en: {
    langAttr: "en",
    aria: {
      sideRail: "TasteLab navigation",
      mainNav: "Primary navigation",
      privacy: "Project visibility",
      language: "Language switcher",
      blueprintChart: "Segmented temperature schedule from preheat to finish",
      ingredientSchedule: "Ingredient timing schedule",
      thermalMini: "Temperature stage summary",
      readiness: "Robot data readiness 82 percent",
      versions: "Experiment versions"
    },
    skip: "Skip to workspace",
    panelNav: {
      section: "Work panels",
      items: {
        dashboard: ["Project center", "Project and tasks"],
        archive: ["Archive", "Completed projects"]
      }
    },
    workflowNav: {
      section: "Current dish workflow",
      items: {
        ideation: ["R&D Brief", "Needs confirmed"],
        blueprint: ["Robot data", "Execution parameters"],
        versions: ["Experiment versions", "Tasting comparison"],
        localization: ["Localization", "Market variants"],
        final: ["Final recipe", "Archivable package"]
      }
    },
    privacy: {
      title: "Enterprise workspace",
      private: "Internal R&D",
      expert: "Expert collaboration",
      privateState: "Internal R&D",
      expertState: "Expert collaboration is open",
      privateCopy: "This project belongs to the enterprise workspace. Customer recipes and lab records stay private by default.",
      expertCopy: "Expert review access is open. Invited experts can view the final robot data, versions, and QC records.",
      privateMode: "Internal R&D",
      expertMode: "Expert collaboration",
      privateCta: "View final recipe",
      expertCta: "Manage expert review"
    },
    top: {
      label: "TasteLab AI Culinary R&D platform",
      title: "New culinary R&D project",
      save: "Save progress",
      saving: "Saving",
      saved: "Saved",
      savedButton: "Saved",
      savedJustNow: "Saved just now",
      unsaved: "Unsaved changes",
      stagePrefix: "Current stage",
      login: "Login",
      workspace: "Botinkit Shenzhen R&D",
      accountUser: "Hannah Ma · Product design",
      accountMenuTitle: "Enterprise account",
      logout: "Log out"
    },
    workflow: {
      statuses: {
        current: "Current",
        complete: "Complete",
        available: "Available",
        locked: "Locked",
        notStarted: "Not started",
        pending: "Needs confirm",
        archived: "Archived",
        notArchived: "Not archived",
        ready: "Ready"
      },
      stages: {
        dashboard: "Project center",
        ideation: "R&D Brief",
        blueprint: "Robot data",
        versions: "Experiment versions",
        localization: "Localization",
        final: "Final recipe",
        archive: "Archive",
        review: "Expert review"
      }
    },
    login: {
      kicker: "Enterprise login",
      title: "Log in to TasteLab AI",
      intro: "Use an enterprise email or phone number to enter the team R&D workspace.",
      heroTitle: "Enterprise culinary R&D entry",
      heroCopy: "Log in to enter the enterprise workspace and continue managing briefs, robot data, experiment versions, final recipes, and archives.",
      proof: {
        workspace: "Workspace",
        privacy: "Private project",
        archive: "Final archive"
      },
      labels: {
        email: "Enterprise email / phone",
        password: "Password or code",
        workspace: "Enterprise workspace"
      },
      workspaces: ["Botinkit Shenzhen R&D", "Botinkit Global Taste Lab"],
      cancel: "Cancel",
      submit: "Log in",
      close: "Close login panel"
    },
    dashboard: {
      kicker: "Active project",
      title: "From dish idea to robot-executable data",
      intro: "AI turns chef goals, recipe language, and regional constraints into testable heat, ingredient timing, tossing, and QC plans. Chefs approve the draft before expert review.",
      dataStrip: ["Robot in Kitchen", "Computational flavor", "Data V4"],
      start: "Start experiment",
      viewBlueprint: "View robot data",
      figcaptionLabel: "Prototype V4",
      figcaptionTitle: "Aroma lift",
      readinessKicker: "Robot data readiness",
      readinessTitle: "Robot data readiness",
      readinessStatus: "Ready for tasting",
      metrics: ["Batch", "Cycle", "Cost"],
      pipelineKicker: "R&D pipeline",
      pipelineTitle: "Project pipeline",
      pipelineStatus: "2 pending",
      pipeline: [
        ["Concept locked", "Approved concept"],
        ["Robot draft", "Parameter draft"],
        ["Store tasting", "In tasting"],
        ["Final recipe", "Ready to archive"]
      ],
      thermalKicker: "Robot executable data",
      thermalTitle: "Execution summary",
      thermalStages: [
        ["Preheat", "180C"],
        ["Sear", "198C"],
        ["Reduce", "158C"],
        ["Finish", "142C"]
      ],
      thermalNotes: ["12s preheat", "198C peak", "24 portion cap"],
      reviewKicker: "Expert queue",
      reviewTitle: "Expert review",
      reviewStatus: "Private",
      reviewerTitle: "International chef review",
      reviewerNote: "Texture target and batch stability",
      inviteCompact: "Invite"
    },
    projectCenter: {
      kicker: "Project center",
      title: "Enterprise R&D projects",
      intro: "Saved culinary R&D work returns here first. Continue draft projects, then archive approved final recipes as formal records.",
      newProject: "New R&D project",
      viewAllArchive: "View all",
      activeKicker: "In progress",
      activeTitle: "In-progress projects",
      todoKicker: "Action needed",
      todoTitle: "Needs my action",
      todoNote: "Confirmations, conflicts, or feedback that need your attention.",
      archiveKicker: "Archive",
      archiveTitle: "Archived projects",
      continue: "Continue editing",
      processTodo: "Handle action",
      viewRecipe: "View formal recipe",
      inProgressLabel: "In progress",
      needsActionLabel: "Action needed",
      emptyActive: "No in-progress projects yet. Saved drafts will appear here after you create a new R&D project.",
      emptyTodo: "No conflicts, feedback, or confirmations need action right now.",
      emptyArchive: "No archived projects yet. Final recipes appear here after archive.",
      todoActions: {
        confirm: "Review",
        process: "Handle",
        review: "View feedback"
      },
      todoDetails: {
        final: "The final recipe is ready. Confirm whether to archive it as a formal recipe or invite expert review first.",
        ideation: "This project is still in Brief. Add the project name, working dish name, and dish goal.",
        feedback: "Expert feedback has returned. Review it before deciding whether to update the final recipe.",
        default: "This project has a workflow item that needs your attention."
      },
      labels: {
        dish: "Working dish name",
        stage: "Current stage",
        saved: "Saved",
        owner: "Owner",
        progress: "Progress",
        archivedAt: "Archived",
        version: "Version",
        batch: "Batch",
        markets: "Markets"
      }
    },
    projectNaming: {
      title: "Project naming",
      projectName: "Project name",
      dishName: "Working dish name",
      note: "AI can suggest dish names, but it will not overwrite the project name or working dish name.",
      suggestionsLabel: "AI suggested dish names",
      suggestions: ["Mala chicken rice", "Pepper aroma chicken rice", "Sichuan Pepper Chicken Rice"],
      applied: "Applied to working dish name",
      placeholders: {
        projectName: "Example: 2026 Q3 overseas lunch chicken rice R&D",
        dishName: "Example: Sichuan chicken rice"
      }
    },
    ideation: {
      kicker: "AI chef co-pilot",
      title: "New dish R&D Brief",
      status: "Primary entry",
      dishLabel: "Dish goal",
      dishPlaceholder: "Example: Develop a Sichuan-style chicken rice for overseas stores, lunch-rush friendly, with a mild option, preserved Sichuan pepper aroma, and target cost under $3.",
      error: "Enter a dish goal before generating robot data.",
      selectPlaceholder: "Select",
      marketPlaceholder: "Select target markets",
      marketMore: (count) => `+${count}`,
      requiredHint: "Complete required fields first",
      completion: (done, total) => `Brief completion: ${done}/${total} required fields complete`,
      fieldStates: {
        filled: "Filled",
        required: "Required",
        suggested: "Suggested",
        optional: "Optional"
      },
      requiredFields: {
        projectName: "Project name",
        dishName: "Working dish name",
        dishGoal: "Dish goal",
        type: "R&D type",
        markets: "Target markets",
        batch: "Target batch"
      },
      sections: {
        context: "R&D context",
        positioning: "Dish positioning",
        boundaries: "Optional supplements"
      },
      briefFields: {
        type: ["R&D type", ["New dish development", "Robotize existing recipe", "Regional localization", "Seasonal menu upgrade"]],
        scene: ["Store scene", ["Lunch rush", "Dinner service", "Delivery rice bowl", "Mall quick service", "Overseas pilot store"]],
        markets: ["Target markets", ""],
        audience: ["Target audience", ["Office lunch", "Family dining", "Students", "Business guests", "Late-night diners"]],
        protein: ["Main protein", ["Chicken thigh", "Beef", "Shrimp", "Tofu", "Mixed vegetables"]],
        price: ["Price / cost", "Example: $8.90-$10.90 / cost $2.84"],
        spice: ["Taste target", ["Light low-oil", "Balanced savory", "Mala-forward", "Sweet-sour balance", "Aroma retention", "Family friendly"]],
        aroma: ["Sensory target", ["Preserve Sichuan pepper aroma", "Wok hei first", "Light low-oil finish", "Rich sauce aroma"]],
        constraints: ["Constraints", "Example: no peanuts, mild option, low-sodium sauce"],
        batch: ["Target batch", "Example: 18-24 portions"],
        prep: ["Prep level", ["Pre-cut chicken", "Store-cut", "Central kitchen marinated", "Frozen semi-prep"]],
        robot: ["Robot motion limit", ["Standard toss intensity", "Gentle toss", "High-heat fast toss", "Low-speed reduction"]]
      },
      marketOptions: ["Mainland China", "Singapore", "United States", "Malaysia", "Japan", "South Korea", "Australia", "United Arab Emirates"],
      analysis: {
        kicker: "AI parsing",
        title: "Live AI parsing and conflict check",
        emptyStatus: "Waiting for Brief",
        analyzingStatus: "Analyzing",
        readyStatus: "Recognized",
        conflictStatus: (count) => `${count} to confirm`,
        detectedTitle: "Detected from description",
        sensoryTitle: "AI-detected sensory keywords",
        emptyDetected: "After you write the dish goal, AI will identify scene, taste, cost, and constraints.",
        analyzingDetected: "Parsing the dish goal...",
        defaultDetected: "Dish goal recognized",
        confirmedTitle: "User confirmed",
        emptyConfirmed: "Structured fields you select will appear here.",
        conflictTitle: "Chef confirmation needed",
        noConflicts: "No conflicts need confirmation yet.",
        resolved: "Resolved",
        conflictActions: ["Use structured option", "Use natural language", "Generate two variants"],
        conflict: ["Taste target conflict", "The natural-language goal says “mild option available,” but the structured field says “mala-forward.” AI will not override either value without chef confirmation."],
        tokens: {
          lunch: "Lunch rush",
          mild: "Mild option available",
          pepper: "Sichuan pepper aroma retained",
          cost: "Cost under $3"
        },
        sensoryKeywords: {
          numbing: "Medium-high numbing",
          pepper: "Pepper aroma retained",
          rice: "Distinct rice grains",
          lowOil: "Low-oil finish",
          savory: "Balanced savory"
        }
      },
      generate: "Generate robot data",
      generating: "Generating",
      robotizeKicker: "Existing recipe entry",
      robotizeTitle: "Have a chef recipe? Convert it to robot steps",
      robotizeStatus: "Optional entry",
      chefLabel: "Chef note",
      chefPlaceholder: "Paste a chef's natural-language recipe, for example: heat the wok, add oil, sear chicken thigh, add doubanjiang, ginger, garlic, and Sichuan pepper oil, then reduce with stock.",
      robotizeButton: "Standardize steps",
      emptySteps: "Enter the chef note to generate standard robot steps.",
      generatedSteps: [
        "Identify proteins, sauces, aroma oil, and reduction targets to generate a standard ingredient list.",
        "Split the chef note into five robot stages: preheat, sear, mix, reduce, and finish.",
        "Flag flavor risk: keep Sichuan pepper oil out of the high-heat stage to preserve aroma."
      ]
    },
    blueprint: {
      kicker: "Robot executable data",
      title: "Robot executable data",
      state: "V4 generated",
      temperatureTitle: "Temperature stages",
      temperatureSubtitle: "Temperature is shown as locked stages, separate from wok motion.",
      temperatureStages: [
        ["0-12s", "180C", "Preheat"],
        ["12-54s", "198C", "Sear"],
        ["54-96s", "158C", "Reduce"],
        ["96-120s", "142C", "Finish"]
      ],
      ingredientTitle: "Ingredient timing",
      ingredientHeaders: ["Time", "Ingredient", "Amount"],
      ingredients: [
        ["12s", "Chicken thigh", "220 g"],
        ["54s", "Sauce", "36 g"],
        ["78s", "Stock", "42 ml"],
        ["108s", "Garnish", "8 g"]
      ],
      actionKicker: "Wok action strategy",
      actionTitle: "Wok actions",
      actions: [
        ["Gentle toss", "12-42s / 38 rpm / build browning"],
        ["Mix", "54-78s / 22 rpm / coat sauce evenly"],
        ["Reduce", "78-104s / 16 rpm / protect rice texture"]
      ],
      parameters: ["Preheat", "Toss speed", "Sauce timing", "Batch size"],
      qualityKicker: "Quality gates",
      qualityTitle: "Quality gates",
      quality: [
        ["Chicken edge browning", "Visible browning at 42-48 seconds"],
        ["Sichuan pepper aroma", "Add aroma oil after the high-heat stage"],
        ["Distinct rice grains", "Keep sauce viscosity under 34 Brix"],
        ["Peak batch risk", "Above 24 portions may soften garnish"]
      ]
    },
    versions: {
      kicker: "Experiment versions",
      title: "Experiment comparison",
      selectedKicker: "Selected version",
      rows: [
        ["V4", "Late pepper oil", "Score 8.6, cost $2.84"],
        ["V3", "Early sauce", "Score 7.9, cost $2.79"],
        ["V2", "High heat", "Score 7.4, cost $2.92"]
      ],
      details: {
        V4: ["V4 late pepper oil", "8.6 tasting score", "Pepper oil moved later, aroma improved, spice level became more stable."],
        V3: ["V3 early sauce", "7.9 tasting score", "Sauce integrated faster, but it covered the chicken browning."],
        V2: ["V2 high heat", "7.4 tasting score", "High heat improved aroma, but edges dried out at 24 portions."]
      },
      detailLabels: ["Change", "Audit", "Next step"],
      audit: "AI draft -> Chef approved -> Expert pending",
      next: "Run a 24-portion batch in the Singapore pilot store."
    },
    localization: {
      kicker: "Regional adaptation",
      title: "Regional variants",
      compare: "Compare",
      cards: [
        ["China", "Keep medium spice and doubanjiang aroma, with diced asparagus lettuce as a lunch set option.", ["Spice", "Cost", "Swap"], ["3.5/5", "$2.42", "Local chicken thigh"]],
        ["Singapore", "Layer the spice level, add a mild option, reduce oiliness, and preserve Sichuan pepper aroma.", ["Spice", "Cost", "Swap"], ["2.5/5", "$2.84", "Halal stock"]],
        ["United States", "Balance spicy, sweet, and savory notes, then adapt sides to corn and scallion for bowl menus.", ["Spice", "Cost", "Swap"], ["2/5", "$3.08", "Low-sodium sauce"]]
      ]
    },
    stageActions: {
      blueprintNext: "Create experiment version",
      versionsNext: "Confirm version",
      localizationNext: "Generate final recipe"
    },
    finalRecipe: {
      kicker: "Final recipe",
      title: "Sichuan chicken rice final recipe",
      statusTeam: "Team-confirmed",
      statusExpert: "Expert-reviewed",
      labels: {
        blueprint: "Robot data",
        version: "Experiment version",
        market: "Market fit"
      },
      copies: {
        blueprint: "Heat, ingredient timing, wok motion, and QC gates are ready for store sampling.",
        version: "Tasting score 8.6, with Sichuan pepper aroma preserved and a lighter finish.",
        market: "Spice, cost, and ingredient swaps are executable across three markets."
      },
      market: "China / Singapore / United States",
      handoff: "Handoff package",
      handoffItems: {
        robot: "Robot parameters: 180C preheat, 198C peak, 24-portion cap.",
        qc: "QC gates: chicken browning, pepper aroma, rice texture, batch risk.",
        market: "Regional versions: local ingredient swaps and spice tiers retained."
      },
      archive: "Archive project"
    },
    expertModule: {
      kicker: "Premium feature",
      title: "Expert review",
      points: {
        scopeTitle: "Review scope is controlled",
        scope: "Only the final robot data, experiment versions, and QC records are shared.",
        feedbackTitle: "Experts can return feedback",
        feedback: "After feedback arrives, the user can revise and regenerate the final recipe."
      },
      actions: {
        enable: "Enable premium feature",
        invite: "Invite expert review",
        receive: "Simulate feedback received",
        apply: "Apply feedback and update final recipe"
      },
      states: {
        locked: ["Premium feature", "Expert review is a premium feature. You can still create a team-confirmed recipe and archive it."],
        available: ["Available", "Expert review is enabled. Invite an expert after the team accepts the current recipe."],
        pending: ["Expert review in progress", "The expert is reviewing the final robot data, experiment versions, and QC records."],
        feedback_received: ["Expert feedback received", "Expert note: keep pepper aroma for the mild version and reduce viscosity risk above 24 portions."],
        applied: ["Expert-reviewed", "Expert feedback has been applied. The final recipe is now expert-reviewed."]
      }
    },
    archive: {
      kicker: "Archive",
      title: "Archived dish projects",
      statusOpen: "Not archived",
      statusArchived: "Archived",
      projectTitle: "Global Sichuan chicken rice R&D",
      emptyTitle: "No archived projects yet",
      emptyCopy: "Once the final recipe is confirmed, archive it as a read-only record.",
      archivedCopy: "The final recipe is archived. The project can be reviewed, but it will no longer move forward.",
      viewRecipe: "View formal recipe",
      labels: {
        status: "Archived",
        version: "Version",
        batch: "Batch",
        markets: "Markets"
      },
      values: {
        batch: "24 portions",
        markets: "3"
      }
    },
    formalRecipe: {
      kicker: "Formal recipe",
      title: "Sichuan chicken rice",
      statusTeam: "Team-confirmed",
      statusExpert: "Expert-reviewed",
      subtitle: "A read-only archived recipe format for store reproduction, expert review, and internal audit.",
      back: "Back to archive",
      metaLabels: {
        project: "Project",
        batch: "Batch",
        cycle: "Cycle",
        markets: "Markets"
      },
      metaValues: {
        project: "Global Sichuan chicken rice R&D",
        batch: "24 portions",
        cycle: "120 seconds",
        markets: "China / Singapore / United States"
      },
      sections: {
        brief: "Dish definition",
        ingredients: "Standard ingredients",
        robot: "Robot execution steps",
        qc: "QC gates",
        audit: "Archive audit"
      },
      brief: "A Sichuan-style chicken rice for overseas lunch rush, preserving Sichuan pepper aroma, offering a mild tier, and targeting cost under $3.",
      ingredientsHeaders: ["Ingredient", "Amount", "Note"],
      ingredients: [
        ["Chicken thigh", "220 g", "Pre-cut"],
        ["Compound sauce", "36 g", "Low-sodium version"],
        ["Stock", "42 ml", "Market-specific swap"],
        ["Pepper aroma oil", "8 ml", "Add after high heat"]
      ],
      robotHeaders: ["Stage", "Temp", "Time", "Motion"],
      robotRows: [
        ["Preheat", "180C", "0-12s", "Empty wok stabilization"],
        ["Sear", "198C", "12-54s", "38 rpm gentle toss"],
        ["Reduce", "158C", "54-96s", "22 rpm mix"],
        ["Finish", "142C", "96-120s", "Add garnish"]
      ],
      qc: {
        browning: "Visible chicken edge browning appears at 42-48 seconds.",
        aroma: "Keep pepper oil out of the high-heat stage to preserve aroma.",
        batch: "Above 24 portions requires retesting garnish softening risk."
      },
      audit: {
        readonly: "Archived records are read-only.",
        owner: "Team-confirmed version approved by the lead chef.",
        source: "V4 experiment version and robot data source are retained."
      }
    },
    review: {
      kicker: "Expert review room",
      title: "Expert review room",
      logTitle: "Decision log",
      trustKicker: "Trust controls",
      trustTitle: "Privacy and collaboration",
      shareTitle: "Shared scope",
      states: {
        private: {
          avatar: "IN",
          chefTitle: "Expert collaboration is not open",
          chefNote: "This project is visible to the internal team only. Invite Botinkit Taste Lab or an external expert after the robot data version is confirmed.",
          log: [
            ["AI proposal", "Generated robot data V4 with late pepper oil."],
            ["Chef approval", "Accepted texture target and requested a lower-oil finish."],
            ["Expert invite pending", "Nothing has been shared with external experts yet."]
          ],
          trust: [
            ["Team-only visibility", "Customer recipes, robot data, and tasting notes stay in the team workspace."],
            ["Experts are invited manually", "Botinkit Taste Lab does not access the project by default."],
            ["Scope confirmed before sharing", "Choose whether to share robot data, versions, and QC records first."]
          ],
          shareScope: [
            ["check", "V4 robot data can be shared"],
            ["check", "Experiment versions and QC records can be shared"],
            ["lock-keyhole", "Original customer recipes stay private"]
          ],
          sendInvite: "Invite expert review"
        },
        expert: {
          avatar: "YC",
          chefTitle: "International royal chef",
          chefNote: "Expert note received: keep the late pepper oil for aroma lift, but reduce viscosity risk above a 24-portion batch.",
          log: [
            ["AI proposal", "Generated robot data V4 with late pepper oil."],
            ["Chef approval", "Accepted texture target and requested a lower-oil finish."],
            ["Expert note", "Preserve Sichuan pepper aroma for the mild version and cap the batch at 24 portions."]
          ],
          trust: [
            ["Expert collaboration open", "Invited experts can view robot data, versions, and QC records."],
            ["Customer recipes stay private", "Original formulas and internal experiment records are not shared by default."],
            ["Access can be revoked", "The project owner can close expert access at any time."]
          ],
          shareScope: [
            ["check", "V4 robot data shared"],
            ["check", "Experiment versions and QC records shared"],
            ["lock-keyhole", "Original customer recipes not shared"]
          ],
          sendInvite: "Manage access"
        }
      }
    },
    units: {
      "preheat-value": "C",
      "speed-value": " rpm",
      "sauce-value": "s",
      "batch-value": " portions"
    },
    toasts: {
      missingBrief: "Enter a dish goal first.",
      generated: "AI generated the V5 robot data draft. Open the robot data page to confirm it.",
      invite: "Expert collaboration is now open. Robot data, versions, and QC records are shared.",
      permissions: "Manage expert access and shared scope here.",
      conflictChoice: "Chef choice recorded. AI will keep the conflict evidence and update the robot data draft.",
      robotized: "The chef note has been converted into draft robot steps.",
      compared: "Ingredient swaps, spice level, and cost assumptions were compared across markets.",
      privacyPrivate: "Internal R&D is back on. Expert access is closed.",
      privacyExpert: "Expert collaboration mode is on.",
      language: "Switched to English.",
      saved: "Project progress saved.",
      loginSuccess: "Entered the enterprise R&D workspace.",
      logout: "Logged out.",
      premiumEnabled: "Expert review premium feature is enabled.",
      expertInvited: "Expert review invitation sent.",
      expertFeedback: "Expert feedback received. You can revise or apply it.",
      expertApplied: "Expert feedback applied. The final recipe is now expert-reviewed.",
      archived: "Project archived as a read-only record.",
      noActiveProject: "There is no active R&D project. Start or continue a project from the project center first.",
      newProject: "New R&D project created. Name it and fill in the dish goal first.",
      workflowAdvanced: "Next step unlocked. Continue the dish R&D workflow.",
      missingBriefRequired: "Complete the required Brief fields first.",
      missingChefRecipe: "Enter the chef note first."
    }
  }
};

function text(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

function attr(selector, name, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute(name, value);
  }
}

function labelText(selector, value) {
  const label = document.querySelector(selector);
  if (label && label.firstChild) {
    label.firstChild.textContent = `${value} `;
  }
}

function renderIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setButtonContent(button, iconName, label) {
  if (!button) return;
  button.innerHTML = `<i data-lucide="${iconName}" aria-hidden="true"></i><span>${label}</span>`;
  renderIcons();
}

function currentCopy() {
  return copy[state.language];
}

function localizeProject(project) {
  return { ...project, ...(project[state.language] || project.zh) };
}

function getActiveProject() {
  return state.activeProjects.find((project) => project.id === state.activeProjectId) || null;
}

function hasActiveProject() {
  return Boolean(getActiveProject());
}

function getSelectedArchiveProject() {
  return state.archivedProjects.find((project) => project.id === state.selectedArchiveId) || state.archivedProjects[0] || null;
}

const requiredBriefFields = ["projectName", "dishName", "dishGoal", "type", "markets", "batch"];
const suggestedBriefFields = ["scene", "audience", "protein", "price", "spice", "aroma"];
const supplementalBriefFields = ["constraints", "prep", "robot"];
const selectBriefFields = ["type", "scene", "audience", "protein", "spice", "aroma", "prep", "robot"];

function blankBriefForm() {
  return {
    projectName: "",
    dishName: "",
    dishGoal: "",
    type: "",
    scene: "",
    markets: "",
    audience: "",
    protein: "",
    price: "",
    spice: "",
    aroma: "",
    constraints: "",
    batch: "",
    prep: "",
    robot: "",
    chefRecipe: ""
  };
}

function ensureProjectForm(project) {
  if (!project) return blankBriefForm();
  project.form = { ...blankBriefForm(), ...(project.form || {}) };
  return project.form;
}

function getActiveBriefForm() {
  return ensureProjectForm(getActiveProject());
}

function getControlField(control) {
  if (!control) return "";
  if (control === projectNameInput) return "projectName";
  if (control === dishNameInput) return "dishName";
  if (control === dishBrief) return "dishGoal";
  if (control === chefRecipeInput) return "chefRecipe";
  return control.dataset.briefControl || "";
}

function markBriefTouched(field) {
  if (!field || state.briefTouchedFields.includes(field)) return;
  state.briefTouchedFields.push(field);
}

function markBriefDirty() {
  state.lastSavedAt = null;
  state.saveFeedbackState = "idle";
}

function selectDisplayValue(key, form = getActiveBriefForm()) {
  const field = currentCopy().ideation.briefFields[key];
  const options = field?.[1];
  if (!Array.isArray(options) || form[key] === "") return "";
  return options[Number(form[key])] || "";
}

function marketDisplayValue(form = getActiveBriefForm()) {
  const options = currentCopy().ideation.marketOptions;
  const separator = state.language === "zh" ? "、" : ", ";
  return (form.markets || "")
    .split(",")
    .filter(Boolean)
    .map((index) => options[Number(index)])
    .filter(Boolean)
    .join(separator);
}

function displayBriefValue(key, form = getActiveBriefForm()) {
  if (key === "markets") return marketDisplayValue(form);
  return selectBriefFields.includes(key) ? selectDisplayValue(key, form) : form[key];
}

function syncBriefFormFromControls() {
  const project = getActiveProject();
  if (!project) return blankBriefForm();
  const form = ensureProjectForm(project);
  form.projectName = projectNameInput?.value.trim() || "";
  form.dishName = dishNameInput?.value.trim() || "";
  form.dishGoal = dishBrief?.value.trim() || "";
  form.chefRecipe = chefRecipeInput?.value.trim() || "";
  document.querySelectorAll("[data-brief-control]").forEach((control) => {
    form[control.dataset.briefControl] = control.value.trim();
  });
  return form;
}

function applyBriefFormToProject(project, form, markSaved = false) {
  if (!project) return;
  project.zh.projectName = form.projectName || "未命名菜品研发项目";
  project.en.projectName = form.projectName || "Untitled culinary R&D project";
  project.zh.dishName = form.dishName || "待命名菜品";
  project.en.dishName = form.dishName || "Unnamed dish";
  project.zh.summary = form.dishGoal || "新的研发项目草稿。请先填写项目名称、菜品工作名和菜品目标。";
  project.en.summary = form.dishGoal || "New R&D draft. Add a project name, working dish name, and dish goal first.";
  if (markSaved) {
    project.zh.savedAt = "刚刚";
    project.en.savedAt = "Just now";
  }
}

function isFieldFilled(field, form = getActiveBriefForm()) {
  return Boolean((form[field] || "").trim());
}

function getMissingRequiredFields(form = getActiveBriefForm()) {
  return requiredBriefFields.filter((field) => !isFieldFilled(field, form));
}

function getBriefCompletion(form = getActiveBriefForm()) {
  const done = requiredBriefFields.length - getMissingRequiredFields(form).length;
  return { done, total: requiredBriefFields.length, complete: done === requiredBriefFields.length };
}

function resetBriefInteractionState() {
  state.briefTouchedFields = [];
  state.briefResolvedConflicts = [];
  state.briefAnalysisState = "empty";
  state.selectedNameSuggestion = null;
  window.clearTimeout(briefAnalysisTimer);
}

function versionLabel(project) {
  const c = currentCopy();
  return project?.versionStatus === "expert" ? c.formalRecipe.statusExpert : c.formalRecipe.statusTeam;
}

function syncActiveProjectFromForm() {
  const project = getActiveProject();
  if (!project) return;
  const form = syncBriefFormFromControls();
  applyBriefFormToProject(project, form, true);
  project.progress = Math.max(project.progress || 8, Math.min(94, getWorkflowIndex(project.stageKey) * 16 + 18));
}

function createDraftProject() {
  const id = `project-${Date.now()}`;
  const draft = {
    id,
    stageKey: "ideation",
    progress: 8,
    versionStatus: "team",
    form: blankBriefForm(),
    zh: {
      projectName: "未命名菜品研发项目",
      dishName: "待命名菜品",
      summary: "新的研发项目草稿。请先填写项目名称、菜品工作名和菜品目标。",
      stage: "研发 Brief",
      savedAt: "尚未保存",
      owner: "Hannah Ma",
      need: "填写研发 Brief"
    },
    en: {
      projectName: "Untitled culinary R&D project",
      dishName: "Unnamed dish",
      summary: "New R&D draft. Add a project name, working dish name, and dish goal first.",
      stage: "R&D Brief",
      savedAt: "Not saved",
      owner: "Hannah Ma",
      need: "Fill R&D brief"
    }
  };

  state.activeProjects.unshift(draft);
  state.activeProjectId = id;
  state.selectedVersion = "V4";
  state.robotized = false;
  state.blueprintDraft = false;
  state.privacyMode = "private";
  state.expertReviewStatus = "locked";
  state.isPremiumExpertEnabled = false;
  state.lastSavedAt = null;
  state.saveFeedbackState = "idle";
  resetBriefInteractionState();
  return draft;
}

function archiveCurrentProject() {
  const project = getActiveProject();
  if (!project) return null;
  syncActiveProjectFromForm();
  project.versionStatus = state.expertReviewStatus === "applied" ? "expert" : "team";
  ["zh", "en"].forEach((lang) => {
    project[lang].archivedAt = lang === "zh" ? "今天" : "Today";
    project[lang].batch = lang === "zh" ? "24 份" : "24 portions";
    project[lang].cycle = lang === "zh" ? "120 秒" : "120 seconds";
    project[lang].markets = lang === "zh" ? "中国 / 新加坡 / 美国" : "China / Singapore / United States";
    project[lang].marketCount = lang === "zh" ? "3 个" : "3";
    project[lang].brief = dishBrief?.value.trim() || project[lang].summary;
  });
  state.archivedProjects.unshift(project);
  state.activeProjects = state.activeProjects.filter((item) => item.id !== project.id);
  state.activeProjectId = state.activeProjects[0]?.id || null;
  state.selectedArchiveId = project.id;
  state.projectStage = "dashboard";
  state.lastSavedAt = null;
  state.saveFeedbackState = "idle";
  return project;
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.hidden = true;
  }, 3200);
}

function getWorkflowIndex(stage) {
  return workflowOrder.indexOf(stage);
}

function isWorkflowStage(stage) {
  return workflowStages.includes(stage);
}

function previousWorkflowStage(stage) {
  const index = workflowStages.indexOf(stage);
  return index > 0 ? workflowStages[index - 1] : null;
}

function workflowLockedMessage(stage) {
  const c = currentCopy();
  const previousStage = previousWorkflowStage(stage) || "ideation";
  const previousName = c.workflow.stages[previousStage];
  const targetName = c.workflow.stages[stage];
  return state.language === "zh"
    ? `请先完成 ${previousName}，再进入 ${targetName}。`
    : `Complete ${previousName} before entering ${targetName}.`;
}

function canOpenWorkflowStage(stage) {
  if (!isWorkflowStage(stage)) return { ok: true };
  const project = getActiveProject();
  if (!project) {
    return { ok: false, message: currentCopy().toasts.noActiveProject };
  }

  const targetIndex = getWorkflowIndex(stage);
  const unlockedIndex = getWorkflowIndex(project.stageKey || "ideation");
  return targetIndex <= unlockedIndex
    ? { ok: true }
    : { ok: false, message: workflowLockedMessage(stage) };
}

function syncProjectStageCopy(project, stage) {
  if (!project) return;
  const zhStage = copy.zh.workflow.stages[stage];
  const enStage = copy.en.workflow.stages[stage];
  const zhNeeds = {
    ideation: "填写研发 Brief",
    blueprint: "确认机器人数据",
    versions: "确认实验版本",
    localization: "确认本地化适配",
    final: "确认最终菜谱"
  };
  const enNeeds = {
    ideation: "Fill R&D brief",
    blueprint: "Confirm robot data",
    versions: "Confirm experiment version",
    localization: "Confirm localization variants",
    final: "Confirm final recipe"
  };

  project.zh.stage = zhStage;
  project.en.stage = enStage;
  project.zh.need = zhNeeds[stage];
  project.en.need = enNeeds[stage];
}

function advanceWorkflowTo(stage) {
  const project = getActiveProject();
  if (!project || !isWorkflowStage(stage)) return false;

  const nextIndex = getWorkflowIndex(stage);
  const unlockedIndex = getWorkflowIndex(project.stageKey || "ideation");
  if (nextIndex > unlockedIndex) {
    project.stageKey = stage;
  }

  syncProjectStageCopy(project, project.stageKey);
  project.progress = Math.max(project.progress || 8, Math.min(94, getWorkflowIndex(project.stageKey) * 16 + 18));
  return true;
}

function getWorkflowNavStage() {
  const activeProject = getActiveProject();
  if (!activeProject) return null;
  if (isWorkflowStage(state.projectStage) && canOpenWorkflowStage(state.projectStage).ok) {
    return state.projectStage;
  }
  return activeProject.stageKey || "ideation";
}

function getWorkflowStageStatus(stage) {
  const project = getActiveProject();
  if (!project) return "locked";

  const stageIndex = getWorkflowIndex(stage);
  const unlockedIndex = getWorkflowIndex(project.stageKey || "ideation");
  if (stage === state.projectStage && stageIndex <= unlockedIndex) return "current";
  if (stageIndex < unlockedIndex) return "complete";
  if (stageIndex === unlockedIndex) return "available";
  return "locked";
}

function renderWorkflow() {
  const c = currentCopy();

  document.querySelectorAll("[data-workflow-step][data-stage-key]").forEach((button) => {
    const key = button.dataset.stageKey;
    const statusKey = getWorkflowStageStatus(key);
    const status = c.workflow.statuses[statusKey] || c.workflow.statuses.notStarted;
    const project = getActiveProject();
    const unlockedIndex = getWorkflowIndex(project?.stageKey || "ideation");
    const stepIndex = getWorkflowIndex(key);

    button.classList.remove("is-complete", "is-current", "is-pending", "is-locked", "is-available");
    button.classList.add(`is-${statusKey}`);
    if (project && stepIndex < unlockedIndex) {
      button.classList.add("is-complete");
    }
    if (statusKey === "locked") {
      button.setAttribute("aria-disabled", "true");
    } else {
      button.removeAttribute("aria-disabled");
    }

    const statusNode = button.querySelector("em");
    if (statusNode) {
      statusNode.textContent = status;
    }
  });
}

function renderTopState() {
  const c = currentCopy();
  const stageName = c.workflow.stages[state.projectStage] || c.workflow.stages.dashboard;
  const activeProject = getActiveProject();
  const isProjectEditingStage = Boolean(activeProject) && workflowOrder.includes(state.projectStage) && state.projectStage !== "dashboard";

  text(".top-title-block h1", activeProject ? localizeProject(activeProject).projectName : c.top.title);
  if (currentStageLabel) {
    const separator = state.language === "zh" ? "：" : ": ";
    currentStageLabel.textContent = `${c.top.stagePrefix}${separator}${stageName}`;
  }
  if (saveStateLabel) {
    saveStateLabel.hidden = !isProjectEditingStage;
    saveStateLabel.textContent = state.saveFeedbackState === "saving"
      ? c.top.saving
      : state.lastSavedAt ? c.top.savedJustNow : c.top.unsaved;
  }
  if (saveProgressButton) {
    saveProgressButton.hidden = !isProjectEditingStage;
  }
  renderSaveProgressButton();
}

function renderAuth() {
  const c = currentCopy();
  const isSignedIn = state.authState === "signedIn";
  const loginButton = document.querySelector("[data-action='open-login']");
  const accountButton = document.querySelector("[data-action='toggle-account']");
  const defaultWorkspaceNames = [copy.zh.top.workspace, copy.en.top.workspace];
  const displayWorkspace = defaultWorkspaceNames.includes(state.currentWorkspace) ? c.top.workspace : state.currentWorkspace;

  document.body.classList.toggle("is-authenticated", isSignedIn);
  if (appShell) {
    appShell.hidden = !isSignedIn;
  }
  if (loginPanel) {
    loginPanel.hidden = isSignedIn;
  }
  if (skipLink) {
    skipLink.hidden = !isSignedIn;
  }
  window.scrollTo({ top: 0, left: 0 });
  if (loginButton) {
    loginButton.hidden = isSignedIn;
    text("[data-action='open-login'] span", c.top.login);
  }
  if (accountButton) {
    accountButton.hidden = !isSignedIn;
  }
  if (accountMenu) {
    accountMenu.hidden = true;
  }
  text("[data-account-workspace]", displayWorkspace);
  text("[data-account-user]", c.top.accountUser);
  text("[data-account-menu-title]", c.top.accountMenuTitle);
  text("[data-account-menu-workspace]", displayWorkspace);
  text("[data-action='logout']", c.top.logout);
  if (currentWorkspaceLabel) {
    currentWorkspaceLabel.textContent = displayWorkspace;
  }
}

function renderLoginPanel() {
  const c = currentCopy();
  text("[data-login-kicker]", c.login.kicker);
  text("#login-title", c.login.title);
  text("[data-login-intro]", c.login.intro);
  text("[data-login-hero-title]", c.login.heroTitle);
  text("[data-login-hero-copy]", c.login.heroCopy);
  text("[data-login-proof='workspace']", c.login.proof.workspace);
  text("[data-login-proof='privacy']", c.login.proof.privacy);
  text("[data-login-proof='archive']", c.login.proof.archive);
  text("[data-login-label='email']", c.login.labels.email);
  text("[data-login-label='password']", c.login.labels.password);
  text("[data-login-label='workspace']", c.login.labels.workspace);
  text("[data-login-action='submit']", c.login.submit);
  const workspaceSelect = document.querySelector("[data-login-workspace]");
  if (workspaceSelect) {
    workspaceSelect.innerHTML = c.login.workspaces.map((item) => `<option>${item}</option>`).join("");
  }
}

function renderProjectNaming() {
  const c = currentCopy();
  const activeProject = getActiveProject();
  const form = activeProject ? ensureProjectForm(activeProject) : blankBriefForm();

  text("[data-project-naming-title]", c.projectNaming.title);
  text("[data-project-name-label]", c.projectNaming.projectName);
  text("[data-dish-name-label]", c.projectNaming.dishName);
  text("[data-ai-name-note]", c.projectNaming.note);
  attr("[data-ai-name-suggestions]", "aria-label", c.projectNaming.suggestionsLabel);
  if (projectNameInput) {
    projectNameInput.value = form.projectName || "";
    projectNameInput.placeholder = c.projectNaming.placeholders.projectName;
  }
  if (dishNameInput) {
    dishNameInput.value = form.dishName || "";
    dishNameInput.placeholder = c.projectNaming.placeholders.dishName;
  }
  const suggestions = document.querySelector("[data-ai-name-suggestions]");
  if (suggestions) {
    suggestions.innerHTML = c.projectNaming.suggestions
      .map((item) => `
        <button class="${state.selectedNameSuggestion === item ? "is-selected" : ""}" type="button" data-action="apply-name-suggestion" data-suggestion="${item}">
          ${item}
        </button>
      `)
      .join("");
  }
  const nameFeedback = document.querySelector("[data-ai-name-feedback]");
  if (nameFeedback) {
    nameFeedback.hidden = !state.selectedNameSuggestion;
    nameFeedback.textContent = state.selectedNameSuggestion ? c.projectNaming.applied : "";
  }
}

function getProjectTodoItems(project) {
  const c = currentCopy();
  const item = localizeProject(project);
  const stageKey = project.stageKey || "ideation";
  const stage = c.workflow.stages[stageKey] || item.stage;
  const todos = [];

  if (item.need) {
    const isFinal = stageKey === "final";
    const detailKey = isFinal ? "final" : stageKey === "ideation" ? "ideation" : "default";
    todos.push({
      id: `${project.id}-${stageKey}`,
      projectId: project.id,
      targetView: stageKey,
      title: item.need,
      projectName: item.projectName,
      stage,
      detail: c.projectCenter.todoDetails[detailKey],
      action: isFinal ? c.projectCenter.todoActions.confirm : c.projectCenter.todoActions.process
    });
  }

  if (project.id === state.activeProjectId && state.expertReviewStatus === "feedback_received") {
    todos.push({
      id: `${project.id}-expert-feedback`,
      projectId: project.id,
      targetView: "final",
      title: c.expertModule.states.feedback_received[0],
      projectName: item.projectName,
      stage,
      detail: c.projectCenter.todoDetails.feedback,
      action: c.projectCenter.todoActions.review
    });
  }

  return todos;
}

function projectCard(project, type = "active") {
  const c = currentCopy();
  const item = localizeProject(project);
  const isArchive = type === "archive";
  const hasTodo = !isArchive && getProjectTodoItems(project).length > 0;
  const action = isArchive
    ? `<button class="secondary-button compact" type="button" data-view-target="recipe" data-archive-id="${project.id}"><i data-lucide="book-open-check" aria-hidden="true"></i><span>${c.projectCenter.viewRecipe}</span></button>`
    : `<button class="primary-button compact" type="button" data-action="continue-project" data-project-id="${project.id}"><i data-lucide="arrow-right" aria-hidden="true"></i><span>${hasTodo ? c.projectCenter.processTodo : c.projectCenter.continue}</span></button>`;
  const meta = isArchive
    ? [
        [c.projectCenter.labels.version, versionLabel(project)],
        [c.projectCenter.labels.batch, item.batch],
        [c.projectCenter.labels.markets, item.marketCount]
      ]
    : [
        [c.projectCenter.labels.stage, c.workflow.stages[project.stageKey] || item.stage],
        [c.projectCenter.labels.saved, item.savedAt],
        [c.projectCenter.labels.progress, `${project.progress || 8}%`]
      ];

  return `
    <article class="project-card ${isArchive ? "is-archive" : ""}">
      <div class="project-card-main">
        <span>${isArchive ? `${c.projectCenter.labels.archivedAt}: ${item.archivedAt}` : hasTodo ? c.projectCenter.needsActionLabel : c.projectCenter.inProgressLabel}</span>
        <h3>${item.projectName}</h3>
        <p><strong>${c.projectCenter.labels.dish}:</strong> ${item.dishName}</p>
        <p>${item.summary}</p>
        ${action}
      </div>
      <dl>
        ${meta.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}
      </dl>
    </article>
  `;
}

function todoItemRow(todo) {
  const c = currentCopy();
  return `
    <article class="todo-item">
      <div class="todo-item-main">
        <span>${todo.title}</span>
        <h3>${todo.projectName}</h3>
        <p>${todo.detail}</p>
      </div>
      <div class="todo-item-side">
        <span>${c.projectCenter.labels.stage}</span>
        <strong>${todo.stage}</strong>
        <button class="primary-button compact" type="button" data-action="open-todo" data-project-id="${todo.projectId}" data-target-view="${todo.targetView}">
          <i data-lucide="arrow-right" aria-hidden="true"></i>
          <span>${todo.action}</span>
        </button>
      </div>
    </article>
  `;
}

function renderProjectList(selector, projects, emptyCopy, type) {
  const list = document.querySelector(selector);
  if (!list) return;
  list.innerHTML = projects.length
    ? projects.map((project) => projectCard(project, type)).join("")
    : `<div class="project-empty"><i data-lucide="folder-open" aria-hidden="true"></i><p>${emptyCopy}</p></div>`;
}

function renderTodoList(selector, todos, emptyCopy) {
  const list = document.querySelector(selector);
  if (!list) return;
  list.innerHTML = todos.length
    ? todos.map((todo) => todoItemRow(todo)).join("")
    : `<div class="project-empty"><i data-lucide="circle-check" aria-hidden="true"></i><p>${emptyCopy}</p></div>`;
}

function renderProjectCenter() {
  const c = currentCopy();
  const todoItems = state.activeProjects.flatMap((project) => getProjectTodoItems(project));
  const archivePreview = state.archivedProjects.slice(0, 3);

  text("[data-project-center-kicker]", c.projectCenter.kicker);
  text("[data-project-center-title]", c.projectCenter.title);
  text("[data-project-center-intro]", c.projectCenter.intro);
  text("[data-project-center-action]", c.projectCenter.newProject);
  text("[data-project-center-view-archive]", c.projectCenter.viewAllArchive);
  text("[data-project-list-kicker='active']", c.projectCenter.activeKicker);
  text("[data-project-list-title='active']", c.projectCenter.activeTitle);
  text("[data-project-list-kicker='todo']", c.projectCenter.todoKicker);
  text("[data-project-list-title='todo']", c.projectCenter.todoTitle);
  text("[data-project-list-note='todo']", c.projectCenter.todoNote);
  text("[data-project-list-kicker='archive']", c.projectCenter.archiveKicker);
  text("[data-project-list-title='archive']", c.projectCenter.archiveTitle);
  text("[data-project-count='active']", String(state.activeProjects.length));
  text("[data-project-count='todo']", String(todoItems.length));
  renderProjectList("[data-project-list='active']", state.activeProjects, c.projectCenter.emptyActive, "active");
  renderTodoList("[data-project-list='todo']", todoItems, c.projectCenter.emptyTodo);
  renderProjectList("[data-project-list='archive-preview']", archivePreview, c.projectCenter.emptyArchive, "archive");
}

function renderExpertModule() {
  const c = currentCopy();
  const statusKey = state.expertReviewStatus;
  const status = c.expertModule.states[statusKey] || c.expertModule.states.locked;

  text("[data-expert-kicker]", c.expertModule.kicker);
  text("#final-expert-title", c.expertModule.title);
  text("[data-expert-status]", status[0]);
  text("[data-expert-copy]", status[1]);
  text("[data-expert-point='scopeTitle']", c.expertModule.points.scopeTitle);
  text("[data-expert-point='scope']", c.expertModule.points.scope);
  text("[data-expert-point='feedbackTitle']", c.expertModule.points.feedbackTitle);
  text("[data-expert-point='feedback']", c.expertModule.points.feedback);
  text("[data-expert-action='enable']", c.expertModule.actions.enable);
  text("[data-expert-action='invite']", c.expertModule.actions.invite);
  text("[data-expert-action='receive']", c.expertModule.actions.receive);
  text("[data-expert-action='apply']", c.expertModule.actions.apply);

  const enableButton = document.querySelector("[data-action='enable-premium']");
  const inviteButton = document.querySelector("[data-action='invite-expert-review']");
  const receiveButton = document.querySelector("[data-action='receive-expert-feedback']");
  const applyButton = document.querySelector("[data-action='apply-expert-feedback']");

  if (enableButton) enableButton.hidden = state.isPremiumExpertEnabled;
  if (inviteButton) inviteButton.hidden = !state.isPremiumExpertEnabled || statusKey !== "available";
  if (receiveButton) receiveButton.hidden = statusKey !== "pending";
  if (applyButton) applyButton.hidden = statusKey !== "feedback_received";
}

function renderFinalRecipe() {
  const c = currentCopy();
  const isExpertVersion = state.expertReviewStatus === "applied";

  text("[data-final-kicker]", c.finalRecipe.kicker);
  text("#final-title", c.finalRecipe.title);
  text("[data-final-status]", isExpertVersion ? c.finalRecipe.statusExpert : c.finalRecipe.statusTeam);
  text("[data-final-label='blueprint']", c.finalRecipe.labels.blueprint);
  text("[data-final-label='version']", c.finalRecipe.labels.version);
  text("[data-final-label='market']", c.finalRecipe.labels.market);
  text("[data-final-version]", c.versions.details[state.selectedVersion][0]);
  text("[data-final-copy='blueprint']", c.finalRecipe.copies.blueprint);
  text("[data-final-copy='version']", c.finalRecipe.copies.version);
  text("[data-final-copy='market']", c.finalRecipe.copies.market);
  text("[data-final-market]", c.finalRecipe.market);
  text("[data-final-section='handoff']", c.finalRecipe.handoff);
  text("[data-handoff-item='robot']", c.finalRecipe.handoffItems.robot);
  text("[data-handoff-item='qc']", c.finalRecipe.handoffItems.qc);
  text("[data-handoff-item='market']", c.finalRecipe.handoffItems.market);
  text("[data-final-action='archive']", c.finalRecipe.archive);
  renderExpertModule();
}

function renderArchive() {
  const c = currentCopy();
  const archiveEmpty = document.querySelector("[data-archive-empty]");
  const archiveList = document.querySelector("[data-archive-list]");
  const hasArchive = state.archivedProjects.length > 0;

  text("[data-archive-kicker]", c.archive.kicker);
  text("#archive-title", c.archive.title);
  text("[data-archive-status]", hasArchive ? `${c.archive.statusArchived} ${state.archivedProjects.length}` : c.archive.statusOpen);
  text("[data-archive-empty] strong", c.archive.emptyTitle);
  text("[data-archive-empty] p", c.archive.emptyCopy);

  if (archiveList) {
    archiveList.innerHTML = hasArchive
      ? state.archivedProjects.map((project) => projectCard(project, "archive")).join("")
      : "";
  }
  if (archiveEmpty) archiveEmpty.hidden = hasArchive;
}

function renderFormalRecipe() {
  const c = currentCopy();
  const recipe = c.formalRecipe;
  const archiveProject = getSelectedArchiveProject();
  const project = archiveProject ? localizeProject(archiveProject) : null;

  text("[data-recipe-kicker]", recipe.kicker);
  text("#recipe-title", project?.dishName || recipe.title);
  text("[data-recipe-status]", archiveProject ? versionLabel(archiveProject) : recipe.statusTeam);
  text("[data-recipe-subtitle]", recipe.subtitle);
  text("[data-recipe-back]", recipe.back);
  Object.entries(recipe.metaLabels).forEach(([key, value]) => {
    text(`[data-recipe-meta-label="${key}"]`, value);
  });
  const metaValues = project
    ? {
        project: project.projectName,
        batch: project.batch || recipe.metaValues.batch,
        cycle: project.cycle || recipe.metaValues.cycle,
        markets: project.markets || recipe.metaValues.markets
      }
    : recipe.metaValues;
  Object.entries(metaValues).forEach(([key, value]) => {
    text(`[data-recipe-meta-value="${key}"]`, value);
  });
  Object.entries(recipe.sections).forEach(([key, value]) => {
    text(`[data-recipe-section="${key}"]`, value);
  });
  text("[data-recipe-brief]", project?.brief || recipe.brief);

  const ingredientRows = document.querySelectorAll("[data-view='recipe'] .recipe-table:not(.robot-table) .recipe-table-row");
  ingredientRows.forEach((row, index) => {
    const values = index === 0 ? recipe.ingredientsHeaders : recipe.ingredients[index - 1];
    row.querySelectorAll("span").forEach((cell, cellIndex) => {
      cell.textContent = values[cellIndex];
    });
  });

  const robotRows = document.querySelectorAll("[data-view='recipe'] .robot-table .recipe-table-row");
  robotRows.forEach((row, index) => {
    const values = index === 0 ? recipe.robotHeaders : recipe.robotRows[index - 1];
    row.querySelectorAll("span").forEach((cell, cellIndex) => {
      cell.textContent = values[cellIndex];
    });
  });

  Object.entries(recipe.qc).forEach(([key, value]) => {
    text(`[data-recipe-qc="${key}"]`, value);
  });
  Object.entries(recipe.audit).forEach(([key, value]) => {
    text(`[data-recipe-audit="${key}"]`, value);
  });
}

function switchView(viewName) {
  if (isWorkflowStage(viewName)) {
    const access = canOpenWorkflowStage(viewName);
    if (!access.ok) {
      if (!hasActiveProject()) {
        switchView("dashboard");
      }
      showToast(access.message);
      renderWorkflow();
      return false;
    }
  }

  const activeView = viewName === "recipe" ? "archive" : viewName;
  views.forEach((view) => {
    view.classList.toggle("is-visible", view.dataset.view === viewName);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTarget === activeView);
  });

  if (viewName === "recipe") {
    state.projectStage = "archive";
  } else if (workflowOrder.includes(viewName) || viewName === "archive") {
    state.projectStage = viewName;
  }
  renderWorkflow();
  renderTopState();
  return true;
}

function renderPrivacy() {
  const c = currentCopy();
  const isExpert = state.privacyMode === "expert";
  privacyButtons.forEach((button) => {
    const isActive = button.dataset.privacyMode === state.privacyMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  text("[data-privacy-mode='private']", c.privacy.private);
  text("[data-privacy-mode='expert']", c.privacy.expert);
  text("#privacy-title", c.privacy.title);
  if (privacyStateLabel) {
    privacyStateLabel.textContent = isExpert ? c.privacy.expertState : c.privacy.privateState;
  }
  privacyCopy.textContent = isExpert ? c.privacy.expertCopy : c.privacy.privateCopy;
  if (privacyCta) {
    privacyCta.textContent = isExpert ? c.privacy.expertCta : c.privacy.privateCta;
  }
  privacyPanel?.classList.toggle("is-expert", isExpert);
  reviewMode.textContent = isExpert ? c.privacy.expertMode : c.privacy.privateMode;
  renderReview();
  renderIcons();
}

function renderRangeOutputs() {
  const c = currentCopy();
  document.querySelectorAll("[data-range-output]").forEach((range) => {
    const output = document.querySelector(`#${range.dataset.rangeOutput}`);
    if (output) {
      output.textContent = `${range.value}${c.units[range.dataset.rangeOutput]}`;
    }
  });
}

function renderSteps() {
  const c = currentCopy();
  if (!robotizedSteps) return;
  if (!state.robotized) {
    robotizedSteps.innerHTML = `<li class="is-empty">${c.ideation.emptySteps}</li>`;
    return;
  }
  robotizedSteps.innerHTML = c.ideation.generatedSteps.map((step) => `<li>${step}</li>`).join("");
}

function renderSaveProgressButton() {
  if (!saveProgressButton) return;
  const c = currentCopy();
  const isSaving = state.saveFeedbackState === "saving";
  const isSaved = state.saveFeedbackState === "saved";
  const icon = isSaving ? "loader-circle" : isSaved ? "check" : "save";
  const label = isSaving ? c.top.saving : isSaved ? c.top.savedButton : c.top.save;

  saveProgressButton.classList.toggle("is-saving", isSaving);
  saveProgressButton.classList.toggle("is-saved", isSaved);
  saveProgressButton.classList.toggle("is-loading", isSaving);
  saveProgressButton.disabled = isSaving;
  saveProgressButton.setAttribute("aria-busy", String(isSaving));
  setButtonContent(saveProgressButton, icon, label);
}

function renderSimpleList(selector, items) {
  const list = document.querySelector(selector);
  if (!list) return;
  list.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderMarketOptions() {
  const c = currentCopy();
  const form = getActiveBriefForm();
  const selected = new Set((form.markets || "").split(",").filter(Boolean));
  const marketOptions = document.querySelector("[data-market-options]");
  const marketControl = document.querySelector("[data-brief-control='markets']");
  const marketTrigger = document.querySelector("[data-action='toggle-market-menu']");
  const marketSummary = document.querySelector("[data-market-summary]");
  if (marketControl) {
    marketControl.value = form.markets || "";
  }
  const selectedLabels = Array.from(selected)
    .sort((a, b) => Number(a) - Number(b))
    .map((index) => c.ideation.marketOptions[Number(index)])
    .filter(Boolean);
  if (marketSummary) {
    const separator = state.language === "zh" ? "、" : ", ";
    const visibleLabels = selectedLabels.slice(0, 2).join(separator);
    marketSummary.textContent = selectedLabels.length > 2
      ? `${visibleLabels} ${c.ideation.marketMore(selectedLabels.length - 2)}`
      : selectedLabels.length
        ? visibleLabels
        : c.ideation.marketPlaceholder;
  }
  if (marketTrigger) {
    marketTrigger.classList.toggle("is-placeholder", selectedLabels.length === 0);
    marketTrigger.setAttribute("aria-expanded", String(state.marketMenuOpen));
  }
  if (!marketOptions) return;
  marketOptions.setAttribute("aria-label", state.language === "zh" ? "目标市场选项" : "Target market options");
  marketOptions.hidden = !state.marketMenuOpen;
  marketOptions.innerHTML = c.ideation.marketOptions
    .map((item, index) => {
      const value = String(index);
      const isSelected = selected.has(value);
      return `
        <button class="${isSelected ? "is-selected" : ""}" type="button" data-action="toggle-market" data-market-index="${value}" aria-pressed="${isSelected}">
          <span>${item}</span>
          ${isSelected ? `<i data-lucide="check" aria-hidden="true"></i>` : ""}
        </button>
      `;
    })
    .join("");
  renderIcons();
}

function renderBriefBuilder() {
  const c = currentCopy();
  const form = getActiveBriefForm();

  Object.entries(c.ideation.sections).forEach(([key, value]) => {
    text(`[data-brief-section-title="${key}"]`, value);
  });

  Object.entries(c.ideation.briefFields).forEach(([key, field]) => {
    const [label, value] = field;
    const control = document.querySelector(`[data-brief-control="${key}"]`);

    text(`[data-brief-label="${key}"]`, label);

    if (!control) return;
    if (key === "markets") {
      renderMarketOptions();
      return;
    }
    if (control.tagName === "SELECT") {
      const optionsHtml = value
        .map((option, index) => `<option value="${index}"${form[key] === String(index) ? " selected" : ""}>${option}</option>`)
        .join("");
      control.innerHTML = `<option value="" disabled ${form[key] ? "" : "selected"}>${c.ideation.selectPlaceholder}</option>${optionsHtml}`;
    } else {
      control.value = form[key] || "";
      control.placeholder = value;
    }
  });

  renderBriefFeedback();
}

function renderAnalysisList(selector, items, isEmpty = false) {
  const list = document.querySelector(selector);
  if (!list) return;
  list.innerHTML = items
    .map((item) => `<li class="${isEmpty ? "is-empty" : ""}">${item}</li>`)
    .join("");
}

function buildDetectedItems(form, analysis) {
  const goal = form.dishGoal.toLowerCase();
  const items = [];
  if (/午餐|高峰|lunch|rush/.test(goal)) items.push(analysis.tokens.lunch);
  if (/微辣|mild/.test(goal)) items.push(analysis.tokens.mild);
  if (/花椒|pepper/.test(goal)) items.push(analysis.tokens.pepper);
  if (/\$?3|成本|cost/.test(goal)) items.push(analysis.tokens.cost);
  return items.length ? items : [analysis.defaultDetected];
}

function buildSensoryKeywords(form, analysis) {
  const goal = form.dishGoal.toLowerCase();
  const keywords = [];
  if (/麻|微辣|mala|numbing|mild/.test(goal)) keywords.push(analysis.sensoryKeywords.numbing);
  if (/花椒|pepper/.test(goal)) keywords.push(analysis.sensoryKeywords.pepper);
  if (/米饭|颗粒|rice|grain/.test(goal)) keywords.push(analysis.sensoryKeywords.rice);
  if (/低油|少油|low-oil|light/.test(goal)) keywords.push(analysis.sensoryKeywords.lowOil);
  if (/咸鲜|鲜味|savory|umami/.test(goal)) keywords.push(analysis.sensoryKeywords.savory);
  return Array.from(new Set(keywords));
}

function buildConfirmedItems(form) {
  const c = currentCopy();
  const confirmed = [];
  ["type", "markets", "batch", "spice", "price", "protein", "aroma"].forEach((key) => {
    const value = displayBriefValue(key, form);
    if (!value) return;
    const label = c.ideation.briefFields[key][0];
    confirmed.push(`${label}: ${value}`);
  });
  return confirmed;
}

function getBriefConflicts(form) {
  const goal = form.dishGoal.toLowerCase();
  const hasMildGoal = /微辣|mild/.test(goal);
  const isBoldSpice = form.spice === "2";
  return hasMildGoal && isBoldSpice ? ["spice"] : [];
}

function renderIdeationAnalysis() {
  const c = currentCopy();
  const analysis = c.ideation.analysis;
  const conflictList = document.querySelector("[data-conflict-list]");
  const sensoryPanel = document.querySelector("[data-sensory-keywords-panel]");
  const sensoryKeywords = document.querySelector("[data-sensory-keywords]");
  const form = getActiveBriefForm();
  const hasGoal = Boolean(form.dishGoal);
  const isAnalyzing = state.briefAnalysisState === "analyzing";
  const conflicts = hasGoal && !isAnalyzing ? getBriefConflicts(form) : [];
  const unresolvedConflicts = conflicts.filter((id) => !state.briefResolvedConflicts.includes(id));
  const status = !hasGoal
    ? analysis.emptyStatus
    : isAnalyzing
      ? analysis.analyzingStatus
      : unresolvedConflicts.length
        ? analysis.conflictStatus(unresolvedConflicts.length)
        : analysis.readyStatus;

  text(".conflict-panel .section-kicker", analysis.kicker);
  text("#conflict-title", analysis.title);
  text("[data-conflict-status]", status);
  text("[data-analysis-title='detected']", analysis.detectedTitle);
  text("[data-analysis-title='confirmed']", analysis.confirmedTitle);
  text("[data-analysis-title='sensory']", analysis.sensoryTitle);
  if (!hasGoal) {
    renderAnalysisList("[data-analysis-list='detected']", [analysis.emptyDetected], true);
    renderAnalysisList("[data-analysis-list='confirmed']", [analysis.emptyConfirmed], true);
  } else if (isAnalyzing) {
    renderAnalysisList("[data-analysis-list='detected']", [analysis.analyzingDetected], true);
    renderAnalysisList("[data-analysis-list='confirmed']", buildConfirmedItems(form).length ? buildConfirmedItems(form) : [analysis.emptyConfirmed], !buildConfirmedItems(form).length);
  } else {
    const confirmed = buildConfirmedItems(form);
    renderAnalysisList("[data-analysis-list='detected']", buildDetectedItems(form, analysis));
    renderAnalysisList("[data-analysis-list='confirmed']", confirmed.length ? confirmed : [analysis.emptyConfirmed], !confirmed.length);
  }

  if (sensoryPanel && sensoryKeywords) {
    const keywords = hasGoal && !isAnalyzing ? buildSensoryKeywords(form, analysis) : [];
    sensoryPanel.hidden = keywords.length === 0;
    sensoryKeywords.innerHTML = keywords.map((item) => `<span>${item}</span>`).join("");
  }

  if (!conflictList) return;
  if (!hasGoal || isAnalyzing) {
    conflictList.innerHTML = `<h3>${analysis.conflictTitle}</h3><p class="analysis-empty">${analysis.noConflicts}</p>`;
    return;
  }

  if (!conflicts.length) {
    conflictList.innerHTML = `<h3>${analysis.conflictTitle}</h3><p class="analysis-empty">${analysis.noConflicts}</p>`;
    return;
  }

  conflictList.innerHTML = `
    <h3>${analysis.conflictTitle}</h3>
    ${conflicts
      .map((id) => {
        const isResolved = state.briefResolvedConflicts.includes(id);
        return `
        <article class="conflict-item ${isResolved ? "is-resolved" : ""}">
          <div>
            <strong>${analysis.conflict[0]}</strong>
            <p>${analysis.conflict[1]}</p>
            ${isResolved ? `<small>${analysis.resolved}</small>` : ""}
          </div>
          <div class="conflict-actions">
            ${analysis.conflictActions.map((action, index) => `<button class="${isResolved && index === 0 ? "is-selected" : ""}" type="button" data-action="resolve-conflict" data-conflict-id="${id}">${action}</button>`).join("")}
          </div>
        </article>
      `;
      })
      .join("")}
  `;
}

function renderFieldStatus(control, force = false) {
  if (!control) return;
  const c = currentCopy();
  const field = getControlField(control);
  const label = field === "dishGoal"
    ? document.querySelector("label[for='dish-brief']")
    : field === "markets"
      ? document.querySelector("[data-market-field]")
      : control.closest("label");
  const isRequired = requiredBriefFields.includes(field);
  const isSuggested = suggestedBriefFields.includes(field);
  const touched = state.briefTouchedFields.includes(field) || force;
  const filled = isFieldFilled(field);
  const showRequired = isRequired && touched && !filled;
  const stateText = filled
    ? c.ideation.fieldStates.filled
    : showRequired
      ? c.ideation.fieldStates.required
      : isRequired
        ? c.ideation.fieldStates.required
      : isSuggested
        ? c.ideation.fieldStates.suggested
        : supplementalBriefFields.includes(field)
          ? c.ideation.fieldStates.optional
          : "";

  control.classList.toggle("is-filled", filled);
  control.classList.toggle("is-invalid", showRequired);
  if (label) {
    label.classList.toggle("is-filled", filled);
    label.classList.toggle("is-invalid", showRequired);
    if (stateText) {
      label.dataset.feedback = stateText;
    } else {
      delete label.dataset.feedback;
    }
  }
  if (showRequired) {
    control.setAttribute("aria-invalid", "true");
  } else {
    control.removeAttribute("aria-invalid");
  }
}

function renderBriefFeedback(forceMissing = false) {
  const c = currentCopy();
  const form = getActiveBriefForm();
  const completion = getBriefCompletion(form);
  const progressNode = document.querySelector("[data-brief-progress]");

  [projectNameInput, dishNameInput, dishBrief, ...document.querySelectorAll("[data-brief-control]")].forEach((control) => {
    renderFieldStatus(control, forceMissing && requiredBriefFields.includes(getControlField(control)));
  });

  if (progressNode) {
    progressNode.textContent = c.ideation.completion(completion.done, completion.total);
    progressNode.classList.toggle("is-complete", completion.complete);
  }

  if (dishError) {
    const showDishError = forceMissing && !form.dishGoal;
    dishError.hidden = !showDishError;
    if (showDishError) {
      dishBrief?.setAttribute("aria-describedby", "dish-brief-error");
    } else {
      dishBrief?.removeAttribute("aria-describedby");
    }
  }

  if (generateButton && !generateButton.classList.contains("is-loading")) {
    generateButton.disabled = !completion.complete;
    generateButton.classList.toggle("is-disabled", !completion.complete);
    generateButton.title = completion.complete ? "" : c.ideation.requiredHint;
    setButtonContent(generateButton, "sparkles", completion.complete ? c.ideation.generate : c.ideation.requiredHint);
  }

  if (robotizeButton) {
    const canRobotize = Boolean(form.chefRecipe);
    robotizeButton.disabled = !canRobotize;
    robotizeButton.classList.toggle("is-disabled", !canRobotize);
  }

  renderIdeationAnalysis();
  renderTopState();
}

function scheduleBriefAnalysis(field) {
  const form = getActiveBriefForm();
  window.clearTimeout(briefAnalysisTimer);

  if (!form.dishGoal) {
    state.briefAnalysisState = "empty";
    renderBriefFeedback();
    return;
  }

  if (field === "dishGoal") {
    state.briefAnalysisState = "analyzing";
    renderBriefFeedback();
    briefAnalysisTimer = window.setTimeout(() => {
      state.briefAnalysisState = "ready";
      renderBriefFeedback();
    }, 420);
    return;
  }

  state.briefAnalysisState = "ready";
  renderBriefFeedback();
}

function handleBriefControlChange(event) {
  const control = event.target.closest("input, textarea, select");
  if (!control || (!control.matches("[data-project-name], [data-dish-name], #dish-brief, #chef-recipe, [data-brief-control]"))) return;

  const field = getControlField(control);
  markBriefTouched(field);
  markBriefDirty();
  const form = syncBriefFormFromControls();
  applyBriefFormToProject(getActiveProject(), form);
  if (field === "dishGoal" || field === "spice") {
    state.briefResolvedConflicts = [];
  }
  scheduleBriefAnalysis(field);
}

function renderShareScope(items) {
  if (!shareScopeList) return;
  shareScopeList.innerHTML = items
    .map(([icon, label]) => `<li><i data-lucide="${icon}" aria-hidden="true"></i><span>${label}</span></li>`)
    .join("");
}

function renderReview() {
  const c = currentCopy();
  const reviewState = c.review.states[state.privacyMode];
  if (!reviewState) return;

  const avatar = reviewSummary?.querySelector(".avatar");
  if (avatar) {
    avatar.textContent = reviewState.avatar;
  }

  text(".review-summary strong", reviewState.chefTitle);
  text(".review-summary p", reviewState.chefNote);
  text(".decision-log h3", c.review.logTitle);
  document.querySelectorAll(".decision-log li").forEach((item, index) => {
    item.querySelector("strong").textContent = reviewState.log[index][0];
    item.querySelector("span").textContent = reviewState.log[index][1];
  });
  attr(".share-scope", "aria-label", c.review.shareTitle);
  text(".share-scope h3", c.review.shareTitle);
  renderCheckList("[data-view='review'] .check-list", reviewState.trust);
  renderShareScope(reviewState.shareScope);
  text(".full[data-action='invite-reviewer'] span", reviewState.sendInvite);
}

function renderVersions() {
  const c = currentCopy();
  document.querySelectorAll(".version-row").forEach((button, index) => {
    const row = c.versions.rows[index];
    button.querySelector("span").textContent = row[0];
    button.querySelector("strong").textContent = row[1];
    button.querySelector("small").textContent = row[2];
    button.classList.toggle("is-selected", button.dataset.version === state.selectedVersion);
  });

  const detail = c.versions.details[state.selectedVersion];
  text("[data-version-title]", detail[0]);
  text("[data-version-score]", detail[1]);
  text("[data-version-change]", detail[2]);

  const versionDetailRows = document.querySelectorAll(".version-detail dl div");
  c.versions.detailLabels.forEach((label, index) => {
    const row = versionDetailRows[index];
    if (row) {
      row.querySelector("dt").textContent = label;
    }
  });
  if (versionDetailRows[1]) versionDetailRows[1].querySelector("dd").textContent = c.versions.audit;
  if (versionDetailRows[2]) versionDetailRows[2].querySelector("dd").textContent = c.versions.next;
}

function renderLocalization() {
  const c = currentCopy();
  document.querySelectorAll(".locale-card").forEach((card, index) => {
    const item = c.localization.cards[index];
    card.querySelector("h3").textContent = item[0];
    card.querySelector("p").textContent = item[1];
    card.querySelectorAll("dt").forEach((dt, dtIndex) => {
      dt.textContent = item[2][dtIndex];
    });
    card.querySelectorAll("dd").forEach((dd, ddIndex) => {
      dd.textContent = item[3][ddIndex];
    });
  });
}

function renderCheckList(selector, items) {
  document.querySelectorAll(`${selector} li`).forEach((item, index) => {
    const copyItem = items[index];
    item.querySelector("strong").textContent = copyItem[0];
    item.querySelector("small").textContent = copyItem[1];
  });
}

function applyLanguage() {
  const c = currentCopy();

  document.documentElement.lang = c.langAttr;
  document.body.dataset.lang = state.language;
  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === state.language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  text(".skip-link", c.skip);
  attr(".side-rail", "aria-label", c.aria.sideRail);
  attr(".main-nav", "aria-label", c.aria.mainNav);
  attr(".segmented-control", "aria-label", c.aria.privacy);
  attr(".language-switcher", "aria-label", c.aria.language);

  text("[data-nav-section='panels']", c.panelNav.section);
  Object.entries(c.panelNav.items).forEach(([key, labels]) => {
    const button = document.querySelector(`[data-nav-key="${key}"]`);
    if (!button) return;
    button.querySelector("strong").textContent = labels[0];
    button.querySelector("small").textContent = labels[1];
  });
  text("[data-nav-section='workflow']", c.workflowNav.section);
  Object.entries(c.workflowNav.items).forEach(([key, labels]) => {
    const button = document.querySelector(`[data-workflow-step][data-stage-key="${key}"]`);
    if (!button) return;
    button.querySelector("strong").textContent = labels[0];
    button.querySelector("small").textContent = labels[1];
  });

  text("#privacy-title", c.privacy.title);
  text(".workspace-label", c.top.label);
  text(".top-title-block h1", c.top.title);
  renderTopState();
  renderAuth();
  renderLoginPanel();
  renderProjectCenter();

  text(".hero-copy .section-kicker", c.dashboard.kicker);
  text("#dashboard-title", c.dashboard.title);
  text(".hero-copy > p", c.dashboard.intro);
  document.querySelectorAll(".brand-data-strip span").forEach((item, index) => {
    item.textContent = c.dashboard.dataStrip[index];
  });
  text(".hero-actions .primary-button span", c.dashboard.start);
  text(".hero-actions .ghost-button span", c.dashboard.viewBlueprint);
  text(".dish-preview figcaption span", c.dashboard.figcaptionLabel);
  text(".dish-preview figcaption strong", c.dashboard.figcaptionTitle);
  text(".blueprint-status .section-kicker", c.dashboard.readinessKicker);
  text("#readiness-title", c.dashboard.readinessTitle);
  text(".blueprint-status .status-pill", c.dashboard.readinessStatus);
  attr(".readiness-meter", "aria-label", c.aria.readiness);
  document.querySelectorAll(".metric-strip dt").forEach((item, index) => {
    item.textContent = c.dashboard.metrics[index];
  });
  text(".pipeline-panel .section-kicker", c.dashboard.pipelineKicker);
  text("#pipeline-title", c.dashboard.pipelineTitle);
  text(".pipeline-panel .status-pill", c.dashboard.pipelineStatus);
  document.querySelectorAll(".timeline-list li").forEach((item, index) => {
    item.querySelector("strong").textContent = c.dashboard.pipeline[index][0];
    item.querySelector("small").textContent = c.dashboard.pipeline[index][1];
  });
  text(".thermal-panel .section-kicker", c.dashboard.thermalKicker);
  text("#thermal-title", c.dashboard.thermalTitle);
  attr(".mini-blueprint", "aria-label", c.aria.thermalMini);
  document.querySelectorAll(".mini-stage").forEach((item, index) => {
    const stage = c.dashboard.thermalStages[index];
    item.querySelector("small").textContent = stage[0];
    item.querySelector("strong").textContent = stage[1];
  });
  document.querySelectorAll(".thermal-notes span").forEach((item, index) => {
    item.textContent = c.dashboard.thermalNotes[index];
  });
  text(".review-panel .section-kicker", c.dashboard.reviewKicker);
  text("#review-title", c.dashboard.reviewTitle);
  text(".review-panel .status-pill", c.dashboard.reviewStatus);
  text(".review-row strong", c.dashboard.reviewerTitle);
  text(".review-row small", c.dashboard.reviewerNote);
  text(".review-row [data-action='invite-reviewer'] span", c.dashboard.inviteCompact);

  text("[data-view='ideation'] .panel:first-child .section-kicker", c.ideation.kicker);
  text("#ideation-title", c.ideation.title);
  text("[data-view='ideation'] .panel:first-child .status-pill", c.ideation.status);
  renderProjectNaming();
  labelText("label[for='dish-brief']", c.ideation.dishLabel);
  if (dishBrief) {
    const form = getActiveBriefForm();
    dishBrief.value = form.dishGoal || "";
    dishBrief.placeholder = c.ideation.dishPlaceholder;
  }
  dishError.textContent = c.ideation.error;
  renderBriefBuilder();
  text("[data-view='ideation'] .panel:nth-child(2) .section-kicker", c.ideation.robotizeKicker);
  text("#robotize-title", c.ideation.robotizeTitle);
  text("[data-view='ideation'] .panel:nth-child(2) .status-pill", c.ideation.robotizeStatus);
  labelText("label[for='chef-recipe']", c.ideation.chefLabel);
  if (chefRecipeInput) {
    const form = getActiveBriefForm();
    chefRecipeInput.value = form.chefRecipe || "";
    chefRecipeInput.placeholder = c.ideation.chefPlaceholder;
  }
  text("[data-action='robotize'] span", c.ideation.robotizeButton);
  renderSteps();
  renderBriefFeedback();

  text("[data-view='blueprint'] .section-kicker", c.blueprint.kicker);
  text("#blueprint-title", c.blueprint.title);
  blueprintState.textContent = state.blueprintDraft
    ? (state.language === "zh" ? "V5 草案就绪" : "V5 draft ready")
    : c.blueprint.state;
  attr(".temperature-schedule", "aria-label", c.aria.blueprintChart);
  text("[data-temperature-title]", c.blueprint.temperatureTitle);
  text("[data-temperature-subtitle]", c.blueprint.temperatureSubtitle);
  document.querySelectorAll(".temperature-stage").forEach((item, index) => {
    const stage = c.blueprint.temperatureStages[index];
    item.querySelector("span").textContent = stage[0];
    item.querySelector("strong").textContent = stage[1];
    item.querySelector("small").textContent = stage[2];
  });
  text("[data-ingredient-title]", c.blueprint.ingredientTitle);
  attr(".schedule-table", "aria-label", c.aria.ingredientSchedule);
  document.querySelectorAll(".schedule-header span").forEach((item, index) => {
    item.textContent = c.blueprint.ingredientHeaders[index];
  });
  document.querySelectorAll(".schedule-row:not(.schedule-header)").forEach((item, index) => {
    const row = c.blueprint.ingredients[index];
    item.querySelectorAll("span").forEach((cell, cellIndex) => {
      cell.textContent = row[cellIndex];
    });
  });
  document.querySelectorAll(".parameter-grid label").forEach((label, index) => {
    labelText(`.parameter-grid label:nth-child(${index + 1})`, c.blueprint.parameters[index]);
  });
  text(".action-panel .section-kicker", c.blueprint.actionKicker);
  text("#action-title", c.blueprint.actionTitle);
  document.querySelectorAll(".action-list li").forEach((item, index) => {
    const action = c.blueprint.actions[index];
    item.querySelector("strong").textContent = action[0];
    item.querySelector("span").textContent = action[1];
  });
  text(".quality-panel .section-kicker", c.blueprint.qualityKicker);
  text("#quality-title", c.blueprint.qualityTitle);
  renderCheckList("[data-view='blueprint'] .check-list", c.blueprint.quality);
  text("[data-stage-action='blueprintNext']", c.stageActions.blueprintNext);

  text("[data-view='versions'] .panel:first-child .section-kicker", c.versions.kicker);
  text("#versions-title", c.versions.title);
  text("[data-view='versions'] .panel:nth-child(2) .section-kicker", c.versions.selectedKicker);
  attr(".version-list", "aria-label", c.aria.versions);
  renderVersions();
  text("[data-stage-action='versionsNext']", c.stageActions.versionsNext);

  text("[data-view='localization'] .section-kicker", c.localization.kicker);
  text("#localization-title", c.localization.title);
  text("[data-action='compare-locales'] span", c.localization.compare);
  renderLocalization();
  text("[data-stage-action='localizationNext']", c.stageActions.localizationNext);
  renderFinalRecipe();
  renderArchive();
  renderFormalRecipe();

  text("[data-view='review'] .panel:first-child .section-kicker", c.review.kicker);
  text("#expert-title", c.review.title);
  text("[data-view='review'] .panel:nth-child(2) .section-kicker", c.review.trustKicker);
  text("#trust-title", c.review.trustTitle);

  renderPrivacy();
  renderWorkflow();
  renderRangeOutputs();
  renderIcons();
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view-target]");
  if (!button) return;
  const target = button.dataset.viewTarget;
  if (target === "recipe" && button.dataset.archiveId) {
    state.selectedArchiveId = button.dataset.archiveId;
  }
  if (!hasActiveProject() && workflowOrder.includes(target) && target !== "dashboard") {
    switchView("dashboard");
    showToast(currentCopy().toasts.noActiveProject);
    return;
  }
  switchView(target);
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.language = button.dataset.language;
    applyLanguage();
    showToast(currentCopy().toasts.language);
  });
});

privacyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.privacyMode = button.dataset.privacyMode;
    renderPrivacy();
    const c = currentCopy();
    showToast(state.privacyMode === "expert" ? c.toasts.privacyExpert : c.toasts.privacyPrivate);
  });
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const c = currentCopy();

  if (button.dataset.action === "open-login") {
    state.authState = "signedOut";
    renderAuth();
    renderIcons();
  }

  if (button.dataset.action === "toggle-account") {
    accountMenu.hidden = !accountMenu.hidden;
  }

  if (button.dataset.action === "logout") {
    state.authState = "signedOut";
    renderAuth();
    showToast(c.toasts.logout);
  }

  if (button.dataset.action === "save-progress") {
    if (state.saveFeedbackState === "saving") return;
    window.clearTimeout(saveFeedbackTimer);
    window.clearTimeout(saveFeedbackResetTimer);

    state.saveFeedbackState = "saving";
    renderTopState();

    saveFeedbackTimer = window.setTimeout(() => {
      syncActiveProjectFromForm();
      state.lastSavedAt = new Date();
      state.saveFeedbackState = "saved";
      renderProjectCenter();
      renderTopState();
      showToast(currentCopy().toasts.saved);

      saveFeedbackResetTimer = window.setTimeout(() => {
        if (state.saveFeedbackState !== "saved") return;
        state.saveFeedbackState = "idle";
        renderTopState();
      }, 1200);
    }, 360);
  }

  if (button.dataset.action === "start-new-project") {
    createDraftProject();
    state.projectStage = "ideation";
    applyLanguage();
    switchView("ideation");
    showToast(c.toasts.newProject);
  }

  if (button.dataset.action === "continue-project") {
    const project = state.activeProjects.find((item) => item.id === button.dataset.projectId);
    if (!project) return;
    state.activeProjectId = project.id;
    state.projectStage = project.stageKey || "ideation";
    resetBriefInteractionState();
    applyLanguage();
    switchView(state.projectStage);
  }

  if (button.dataset.action === "open-todo") {
    const project = state.activeProjects.find((item) => item.id === button.dataset.projectId);
    if (!project) return;
    state.activeProjectId = project.id;
    state.projectStage = button.dataset.targetView || project.stageKey || "ideation";
    resetBriefInteractionState();
    applyLanguage();
    switchView(state.projectStage);
  }

  if (button.dataset.action === "apply-name-suggestion") {
    const suggestion = button.dataset.suggestion || "";
    if (!suggestion || !dishNameInput) return;
    dishNameInput.value = suggestion;
    state.selectedNameSuggestion = suggestion;
    markBriefTouched("dishName");
    markBriefDirty();
    const form = syncBriefFormFromControls();
    applyBriefFormToProject(getActiveProject(), form);
    renderProjectNaming();
    renderBriefFeedback();
  }

  if (button.dataset.action === "toggle-market-menu") {
    state.marketMenuOpen = !state.marketMenuOpen;
    renderMarketOptions();
  }

  if (button.dataset.action === "toggle-market") {
    const marketIndex = button.dataset.marketIndex;
    const form = getActiveBriefForm();
    const selected = new Set((form.markets || "").split(",").filter(Boolean));
    if (selected.has(marketIndex)) {
      selected.delete(marketIndex);
    } else {
      selected.add(marketIndex);
    }
    form.markets = Array.from(selected).sort((a, b) => Number(a) - Number(b)).join(",");
    const marketControl = document.querySelector("[data-brief-control='markets']");
    if (marketControl) marketControl.value = form.markets;
    markBriefTouched("markets");
    markBriefDirty();
    applyBriefFormToProject(getActiveProject(), form);
    state.marketMenuOpen = true;
    renderMarketOptions();
    scheduleBriefAnalysis("markets");
  }

  if (button.dataset.action === "advance-workflow") {
    const nextStage = button.dataset.nextStage;
    if (!isWorkflowStage(nextStage)) return;
    const requiredStage = previousWorkflowStage(nextStage);
    const access = requiredStage ? canOpenWorkflowStage(requiredStage) : canOpenWorkflowStage(nextStage);
    if (!access.ok) {
      if (!hasActiveProject()) {
        switchView("dashboard");
      }
      showToast(access.message);
      return;
    }

    syncActiveProjectFromForm();
    advanceWorkflowTo(nextStage);
    renderProjectCenter();
    renderTopState();
    renderWorkflow();
    switchView(nextStage);
    showToast(c.toasts.workflowAdvanced);
  }

  if (button.dataset.action === "enable-premium") {
    state.isPremiumExpertEnabled = true;
    state.expertReviewStatus = "available";
    renderFinalRecipe();
    renderWorkflow();
    showToast(c.toasts.premiumEnabled);
  }

  if (button.dataset.action === "invite-expert-review") {
    state.privacyMode = "expert";
    state.expertReviewStatus = "pending";
    renderFinalRecipe();
    renderPrivacy();
    renderWorkflow();
    showToast(c.toasts.expertInvited);
  }

  if (button.dataset.action === "receive-expert-feedback") {
    state.expertReviewStatus = "feedback_received";
    renderFinalRecipe();
    renderWorkflow();
    showToast(c.toasts.expertFeedback);
  }

  if (button.dataset.action === "apply-expert-feedback") {
    state.expertReviewStatus = "applied";
    renderFinalRecipe();
    renderArchive();
    renderFormalRecipe();
    renderProjectCenter();
    renderWorkflow();
    showToast(c.toasts.expertApplied);
  }

  if (button.dataset.action === "archive-project") {
    archiveCurrentProject();
    switchView("archive");
    renderProjectCenter();
    renderArchive();
    renderFormalRecipe();
    renderTopState();
    renderWorkflow();
    showToast(c.toasts.archived);
  }
});

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const workspace = document.querySelector("[data-login-workspace]")?.value || currentCopy().top.workspace;
    state.authState = "signedIn";
    state.currentWorkspace = workspace;
    renderAuth();
    renderWorkflow();
    renderTopState();
    showToast(currentCopy().toasts.loginSuccess);
  });
}

if (dishForm) {
  dishForm.addEventListener("input", handleBriefControlChange);
  dishForm.addEventListener("change", handleBriefControlChange);

  dishForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const c = currentCopy();
    const form = syncBriefFormFromControls();
    const missingRequired = getMissingRequiredFields(form);

    if (missingRequired.length) {
      missingRequired.forEach(markBriefTouched);
      renderBriefFeedback(true);
      showToast(c.toasts.missingBriefRequired);
      return;
    }

    dishBrief.removeAttribute("aria-invalid");
    dishBrief.removeAttribute("aria-describedby");
    dishError.hidden = true;
    generateButton.classList.add("is-loading");
    setButtonContent(generateButton, "loader-circle", c.ideation.generating);

    window.setTimeout(() => {
      generateButton.classList.remove("is-loading");
      setButtonContent(generateButton, "sparkles", currentCopy().ideation.generate);
      state.blueprintDraft = true;
      blueprintState.textContent = state.language === "zh" ? "V5 草案就绪" : "V5 draft ready";
      syncActiveProjectFromForm();
      advanceWorkflowTo("blueprint");
      renderProjectCenter();
      renderWorkflow();
      renderTopState();
      showToast(currentCopy().toasts.generated);
      switchView("blueprint");
    }, 850);
  });
}

document.querySelectorAll("[data-range-output]").forEach((range) => {
  range.addEventListener("input", renderRangeOutputs);
});

document.querySelectorAll(".version-row").forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedVersion = button.dataset.version;
    renderVersions();
  });
});

document.querySelectorAll("[data-action='invite-reviewer']").forEach((button) => {
  button.addEventListener("click", () => {
    const c = currentCopy();
    switchView("final");

    if (!state.isPremiumExpertEnabled) {
      showToast(c.expertModule.states.locked[1]);
      return;
    }

    if (state.expertReviewStatus === "available") {
      state.privacyMode = "expert";
      state.expertReviewStatus = "pending";
      renderPrivacy();
      renderFinalRecipe();
      showToast(c.toasts.expertInvited);
      return;
    }

    showToast(c.toasts.permissions);
  });
});

robotizeButton?.addEventListener("click", () => {
  syncBriefFormFromControls();
  if (!getActiveBriefForm().chefRecipe) {
    showToast(currentCopy().toasts.missingChefRecipe);
    renderBriefFeedback();
    return;
  }
  state.robotized = true;
  renderSteps();
  showToast(currentCopy().toasts.robotized);
});

document.querySelector("[data-action='compare-locales']").addEventListener("click", () => {
  showToast(currentCopy().toasts.compared);
});

document.querySelector("[data-conflict-list]")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action='resolve-conflict']");
  if (!button) return;
  const conflictId = button.dataset.conflictId;
  if (conflictId && !state.briefResolvedConflicts.includes(conflictId)) {
    state.briefResolvedConflicts.push(conflictId);
  }
  markBriefDirty();
  renderBriefFeedback();
  showToast(currentCopy().toasts.conflictChoice);
});

document.addEventListener("click", (event) => {
  if (!state.marketMenuOpen || event.target.closest("[data-market-dropdown]")) return;
  state.marketMenuOpen = false;
  renderMarketOptions();
});

applyLanguage();
