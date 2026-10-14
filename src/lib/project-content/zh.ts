import type { ProjectTranslations } from "./types";

export const zhProjects = {
  "invisible-window-research": {
    title: "隐形窗口研究",
    description:
      "IEEE 格式论文，揭示 WebRTC 在线监考的结构性缺陷：利用有文档支持的系统显示 API，在测试的 Windows 10/11 和 macOS 14–26 实验室配置中实现 100% 规避，并向厂商负责任地披露。",
    fullDescription:
      "这篇 13 页的 IEEE 格式论文记录了 WebRTC 在线监考的结构性缺陷。Windows 的 SetWindowDisplayAffinity 和 macOS 的 NSWindow.SharingType.none 都是有文档支持的 API，可将窗口排除在测试的捕获路径之外，同时保持它在物理屏幕上可见。这挑战了基于捕获的监考系统的信任假设。概念验证在测试的 Windows 和 macOS 实验室配置中达到 100% 规避，包括此前被认为已缓解该问题的 macOS 26。配置为模拟环境，并非商业监考产品；macOS 26 使用原生 CGWindowListCreateImage 和 screencapture，而非浏览器 getDisplayMedia()，Linux 未测试。结果反映截至 2026 年 3 月的测试软件版本，后续补丁可能改变行为。",
    problem:
      "远程监考通过 WebRTC getDisplayMedia() 捕获考生屏幕以识别违禁内容，隐含假设是捕获帧忠实反映物理屏幕。研究展示了该假设中的缺口：有文档支持的系统显示 API 无需提权或修改内核，就能将窗口排除在测试的捕获路径之外。结论只针对受控、模拟的 Windows 和 macOS 配置，不证明可以绕过所有浏览器或商业监考产品。",
    solution: [
      "形式化分析 W3C 屏幕捕获 API 与系统图像合成管线之间的信任边界破坏。",
      "研究 Win32 SetWindowDisplayAffinity 和 macOS NSWindow.SharingType.none；两者均载于官方 SDK 文档。",
      "使用 Win32 C 和 Swift 构建概念验证，演示完整的屏幕捕获规避。",
      "在受控实验室中，用 Windows 10/11 和 macOS 14–26 评估模拟监考配置；未测试商业产品，macOS 26 使用原生捕获而非浏览器 getDisplayMedia()。",
      "分析视线跟踪、鼠标行为和进程枚举等检测方法的能力与局限。",
      "提出并评估五项对策，从可部署的标志枚举到长期的硬件证明。",
      "协调系统厂商披露：Microsoft MSRC（2026 年 2 月 通知，2026 年 4 月 分类）与 Apple Product Security（2026 年 3 月 通知并分类）均给出正式分类。",
    ],
    proof: [
      "Windows 10/11 和 macOS 14–26 上规避率为 100%，每种配置测量超过 10,000 帧。",
      "捕获帧中未发现视觉伪影，包括黑色矩形、合成错误或闪烁。",
      "尽管 macOS 15 中有文档记录的 ScreenCaptureKit 变更，macOS 26.3.1 测试的原生捕获路径仍可排除窗口；macOS 26 未直接测试 ScreenCaptureKit 或浏览器 getDisplayMedia()。",
      "Linux（X11/Wayland）未评估；结果只适用于测试的 Windows 和 macOS 配置。",
      "在此样本量下，行为检测未呈现显著效果：视线跟踪 p = 0.41、n = 8，统计效能不足；鼠标行为也在正常考试变异范围内。这不证明行为检测在所有场景中都不可能有效。",
      "以 CC BY 4.0 在 Zenodo 发布预印本，DOI 10.5281/zenodo.20376495；IEEE 会议格式，13 页、53 篇参考文献。",
    ],
    stack: [
      "Win32 C（Windows 概念验证）",
      "Swift / AppKit（macOS 概念验证）",
      "Python（像素级取证验证）",
      "LaTeX（IEEE 会议模板，13 页、53 篇参考文献）",
    ],
    features: [
      "Windows 10 v2004+ 的 SetWindowDisplayAffinity + WDA_EXCLUDEFROMCAPTURE 将窗口排除在测试的 Windows 屏幕捕获路径之外，不产生视觉伪影。",
      "在 macOS 14–26 测试的原生捕获路径中验证 NSWindow.SharingType.none 的窗口排除；macOS 26 使用 CGWindowListCreateImage 和 screencapture，未使用浏览器 getDisplayMedia() 或直接测试 ScreenCaptureKit。",
      "像素级取证：Windows 捕获区域像素差异为 80.27%；macOS 的 1,170,560 像素捕获结果完全透明。",
    ],
    measures: [
      "发现与验证于 2026 年 1 月 完成。",
      "2026 年 2 月 通知 Microsoft MSRC；2026 年 4 月 被归类为设计行为，而非安全漏洞。",
      "2026 年 3 月 通知 Apple Product Security；当月被归类为符合文档的功能，而非安全问题。",
      "收到系统厂商回复后，于 2026 年 5 月 公开发布。",
      "概念验证代码未公开；经验证的安全研究人员可申请获取。",
      "仅使用用户级、有文档支持的系统 API；无内核利用或提权。",
      "遵循 ACM、IEEE 道德准则及 CISA 协调披露指南。",
    ],
    papers: [
      {
        label: "IEEE 格式预印本",
        status: "CC BY 4.0 预印本",
        description:
          "13 页论文，记录跨平台屏幕捕获规避及与厂商协调披露的过程。",
      },
    ],
  },
  "project-simurgh": {
    description:
      "面向 AI 智能体、与提供方无关的可验证遏制证明框架，由 The Invisible Window 的防御研究演进而来。生成 Ed25519 签名、可离线复现的证据，记录防护失效后智能体获准执行的行为；遏制了分类器漏检的 138/138 个案例，并将 AgentDojo 中运行中的智能体的攻击成功数从 9/140 降至 0/140。",
    fullDescription:
      "Project Simurgh 是与提供方无关的智能体 AI 遏制证明框架。它源自 The Invisible Window 面向高风险会话、仅使用元数据的完整性层，发展为一个记录系统：记录部署中的智能体在某道防护失效后被允许执行的操作。Simurgh 对智能体接入工具、文件、上下文和外部系统后获准执行的操作生成签名且可离线复现的记录。独立审查者无需访问证据生产方即可验证该记录。",
    problem:
      "输入分类器可能漏过攻击。此时，智能体仍可能拥有使用工具或访问文件和外部系统的权限。运营方需要能限制这些操作的下游控制，以及独立审查者可以核查的证据。Simurgh 假定证据生产方可能试图让一次运行看起来已被遏制，并围绕这一风险设计验证。",
    solution: [
      "以四道遏制边界包围智能体，将每次运行封装成仅含元数据、Ed25519 签名、可离线逐字节重建的证据包。",
      "假设证据生产方会撒谎，通过决策重放和证据输出完整性检查，让外部审查者确认真实声明并证伪虚假声明。",
      "发布遏制与效用的帕累托前沿及 12 级复现阶梯，外部人员无需模型或生产方权限即可重新计算。",
      "作为内联分类器的纵深防御补充，覆盖分类器无法约束的智能体权限；签名限制声明明确指出它无法发现 2026 年 6 月 的内容生成绕过事件。",
      "保留已发表的研究脉络：Invisible Window 完整性研究和 Banking Shield 的机器检查关于数据不存在的声明，共同构成当前证明契约。",
    ],
    proof: [
      "使用真实 Llama Guard 4 12B 输入分类器测试 180 个案例：遏制其漏检的 138/138 个恶意案例，包括仅检查输入的分类器结构上无法看到的 120 个下游注入和 18 个直接输入漏检；组合目标攻击成功数为 0/150，无不安全工具执行或导出。",
      "自托管 Llama-3.3-70B 运行中的智能体在 AgentDojo 工作区套件中测试 140 个预注册注入案例：权限门将成功数从 9/140 降至 0/140，保留正常任务效用。",
      "AgentDojo 四套件完整确定性运行（v2.49.0）：正常案例 97/97，无攻击效用 949/949，攻击成功数 0/949。",
      "第二独立来源根使用 GitHub OIDC 身份而非开发者密钥签署发布结论；实际结果与已提交结论即使相差一字节，也会在签名前关闭流程。",
      "3,057 项自动测试；一条命令离线复现签名发布阶梯；AGPL-3.0 许可。",
      "以 CC BY 4.0 在 Zenodo 发布研究脉络：原始完整性预印本 DOI 10.5281/zenodo.20374849、投票相关流程背景下的 Phase C 试点及 Banking Shield 关于数据不存在的声明原型。",
    ],
    stack: [
      "Node.js / JavaScript 遏制网关",
      "Ed25519 签名、可离线复现的证据包",
      "JS ↔ Python 字节一致性验证器",
      "Lean 4 机器检查定理",
      "GitHub OIDC 第二来源根",
    ],
    features: [
      "四道遏制边界：输入防火墙、上下文来源守卫、工具调用门和输出泄漏防火墙；各自生成签名证据。",
      "不诚实生产方威胁模型：决策重放与输出完整性检查发现伪造或遗漏的证据，可供严格审查者离线验证。",
      "多类别逃逸分类，包括遏制逃逸、验证器欺骗、范围外行为和门边界规避，并提供可复现的自适应红队活动。",
      "可验证的审批凭证（friction receipts）证明每次受保护权限跨越前都已通过审批；不同密钥构成的双重约束阻止自我批准和倒签时间。",
    ],
    measures: [
      "独立于生产方的验证器仅信任签名者公钥，在无网络条件下确认真实遏制声明并证伪不诚实声明。",
      "对证明核心进行八类自我红队攻击：篡改、换钥、规范化洗白、摘要碰撞、跨阶段重放、自我证明修改和政策漂移；信任根保持有效，两个检测弱点已在 detector-v2 中修订并复测。",
      "独立见证方逐一将签名凭证与独立后果判定器交叉核验；测试夹具中误指控和漏检谎言均为零。",
      "五项 Lean 机器检查定理：fail-closed、friction precedence、same-key-fails、friction coverage、no-silent-exemption。",
      "限制声明明确且带签名：不是越狱检测器，而是补充性后置过滤器；无法发现 2026 年 6 月 内容生成绕过本身。",
    ],
    papers: [
      {
        label: "IEEE 格式预印本",
        status: "CC BY 4.0 预印本",
        description:
          "12 页防御性后续论文，继承 The Invisible Window 研究，以仅含元数据的完整性证明替代视觉监控。",
      },
      {
        label: "补充预印本",
        status: "Phase C 预印本",
        description:
          "5 页投票相关流程背景下的试点，记录 Macquarie 学生社团活动同期开展的 31 次知情同意会话；不收集选票选择，采用 HMAC 审计链和禁止字段拒绝机制，并通过 5/5 数据收集结束检查关卡。",
      },
      {
        label: "银行邻接场景预印本",
        status: "作者准备的预印本",
        description:
          "虚构、非银行研究原型，将隐私与过度声明边界转换为机器可检查证据：包含 46 个禁止字段名的防火墙，将拒绝记为审计事件；确定性离线 AI 隐私防火墙；以及锚定在会话 HMAC 审计链上的逐响应隐私凭证。在证据冻结时，417/417 单元测试、43/43 端到端检查和 27/27 安全检查均通过，涵盖三轮隐私审计和无外传静态门。五名测试者的形成性试运行共 30 次会话，证据中敏感值为零，对限制声明核对清单的理解为 5/5。",
      },
    ],
  },
  "project-zurvan": {
    description:
      "本地优先的 LLM 知识引擎：摄取文档，提取声明、概念、实体和决策，再通过 MCP stdio 服务器向 AI 智能体提供知识。218 项测试通过。",
    fullDescription:
      "Project Zurvan 将原始文档转换为互相链接、可搜索、适合 git 管理的维基，再通过 Model Context Protocol（MCP）服务器提供给 AI 智能体。这个本地优先的 LLM 知识引擎受 Andrej Karpathy 的个人知识管理笔记启发，面向需要长期结构化记忆、又不希望被云服务绑定的研究者、工程师和智能体。",
    problem:
      "LLM 智能体缺少能够跨会话保留的结构化记忆。现有 RAG 管线要么依赖云基础设施，要么丢失知识关系，例如哪项声明支持哪个决策、哪些概念互相矛盾。本地方案需要摄取任意文档，以图结构保留关系，并以可查询、保护隐私的形式提供给智能体。",
    solution: [
      "构建本地 MD、PDF、TXT 和图像摄取管线，写入 SQLite 知识存储。",
      "LLM 提取声明、概念、实体和决策等类型化节点，随语料增长跨来源增量积累。",
      "融合 FTS5 与语义搜索，通过图邻居扩展为智能体构建深层上下文。",
      "MCP stdio 服务器向 Claude Code 和 Cursor 提供 zurvan_search、zurvan_context、zurvan_remember、zurvan_decision_add 及图工具。",
      "多项目联邦管理独立知识库，支持跨库搜索、矛盾检测和政策漂移监测。",
    ],
    proof: [
      "18 个已完成开发阶段中，218 项测试通过。",
      "MCP 服务器已验证，并提供 Claude Code 和 Cursor 客户端配置指南。",
      "集成 Obsidian 知识库，使用颜色区分 7 类知识：声明、概念、实体、决策、会话、矛盾和综合。",
      "证据包、报告、审查、发布管线可完全离线运行。",
      "为 Claude Code 和 Codex 记录智能体工作流：预检、编辑后检查和会话结束。",
    ],
    stack: [
      "Python 3.10+",
      "SQLite FTS5（混合搜索）",
      "MCP stdio 服务器",
      "OpenAI / Anthropic / Mock LLM 提供方",
      "兼容 Obsidian 的知识库布局",
    ],
    features: [
      "将 Markdown、PDF、TXT 和图像摄取为互相链接、可搜索、适合 git 的维基。",
      "LLM 提取类型化的声明、概念、实体和决策，并跨来源增量积累。",
      "FTS5 与语义混合搜索结合图邻居扩展，构建密集上下文包。",
      "MCP stdio 服务器向 Claude Code 和 Cursor 提供 zurvan_search、zurvan_context、zurvan_remember、zurvan_decision_add 及图工具。",
      "多项目联邦支持跨库搜索、矛盾检测和独立知识库政策监测。",
      "18 个已完成阶段中，218 项测试通过。",
    ],
    measures: [
      "本地优先设计，不使用云存储或向外部传输文档内容。",
      "MCP 默认只读，写入需显式启用标志。",
      "项目路径保存在 ~/.zurvan/projects.json，绝不提交到版本控制。",
      "Mock LLM 提供方支持安全开发和测试，避免暴露 API 密钥。",
      "智能体记忆按知识库隔离，跨库联邦需显式注册。",
    ],
  },
  gitswitch: {
    description:
      "AI 驱动的 Git 客户端，用于管理多个身份并生成语义化提交消息，使用 Electron 和 React 构建。",
    fullDescription:
      "GitSwitch 是面向管理多个账户和仓库的开发者的 AI Git 客户端，可切换 git 身份并编写语义化提交消息。",
    problem: "开发者常常难以管理个人和工作 git 身份，也难以保持提交消息一致。",
    solution: [
      "为全局及本地 git 配置构建身份切换器。",
      "集成 Gemini 3 生成语义化提交消息。",
      "以严格隔离构建安全、现代的 Electron 应用。",
      "实现智能差异查看，改善代码审查。",
    ],
    proof: [
      "安全集成系统钥匙串。",
      "从内存中清除 API 密钥。",
      "现代技术栈 React 19 + Electron 33。",
      "赛博朋克风格界面。",
    ],
    features: [
      "管理多个个人和工作账户。",
      "Gemini 3 AI 提交消息生成。",
      "带语法高亮的智能差异查看器。",
      "拖放管理仓库。",
    ],
    measures: [
      "在日志中隐去 API 密钥，并从内存中清除。",
      "通过系统钥匙串安全保存秘密。",
      "强制超时与输入清理。",
      "隐私优先设计。",
    ],
  },
  "mehr-guard": {
    description:
      "隐私优先的离线 QR 和 URL 安全扫描器，使用 Kotlin Multiplatform 构建，100% 离线分析，面向 5 个平台。",
    fullDescription:
      "Mehr Guard 是使用 Kotlin Multiplatform 构建的隐私优先 QR 和 URL 安全扫描器，在设备本地检测钓鱼、品牌冒充及恶意重定向。",
    problem:
      "QR 码是常见钓鱼入口，但多数扫描器将数据上传云端，损害隐私。用户需要验证 URL 而不泄露浏览记录。",
    solution: [
      "使用 Kotlin Multiplatform 构建 100% 离线分析引擎。",
      "实现集成机器学习模型，并配有 25 项以上的启发式检查用于威胁检测。",
      "面向 5 个平台，涵盖 Android、iOS、JVM、JS 和 Wasm；共享 ~100% 检测逻辑，占总代码的 ~52%。",
      "实现 <5ms 延迟以支持实时扫描。",
    ],
    proof: [
      "红队语料上的 F1 分数为 87%。",
      "性能：P99 延迟 <5ms。",
      "1,248+ 项自动测试及内置红队套件，含 19 个精选攻击场景。",
      "隐私：通过 ./judge/verify_offline.sh 验证 0 次网络调用。",
      "代码共享：~100% 检测逻辑，占总代码的 ~52%。",
    ],
    features: [
      "5 个平台目标：Android、iOS、JVM、JS、Wasm。",
      "集成机器学习模型：逻辑回归与梯度提升。",
      "检测品牌冒充、同形字符攻击和恶意重定向。",
      "启发式引擎提供 25+ 项检查。",
      "内置红队套件含 19 个精选攻击场景。",
    ],
    measures: [
      "100% 离线分析，零网络调用。",
      "设备端机器学习与启发式分析。",
      "不收集数据。",
      "通过架构保护隐私。",
    ],
  },
  "syllabus-sync": {
    description:
      "AI 原生校园操作系统，将大学 PDF 教学大纲转换为智能体可读的结构化数据。已作为正式初创项目加入 Macquarie 大学孵化器；完整学生事务套件，92 个文件中有 503 项测试，线上运行于 syllabus-sync.app。",
    fullDescription:
      "Syllabus Sync 是 AI 原生校园操作系统，将静态 PDF 教学大纲转换为智能体可读的结构化数据，整合日历、地图、通知和多档案管理。它已作为正式初创项目加入 Macquarie 大学孵化器，并在 syllabus-sync.app 生产环境运行。",
    problem:
      "澳大利亚大学以非结构化 PDF 发布教学大纲。学生需手动将考核日期复制到日历；AI 助手由于缺乏机器可读的可信来源，会编造截止日期。",
    solution: [
      "构建 LLM OCR 管线，从 PDF 提取结构化 JSON 并用 Zod 校验。",
      "实现 Syllabus-as-Code，将考核和截止日期保存为可版本管理、可比较的资料。",
      "构建完整学生系统，提供日历、Leaflet + Google Maps 校园导航和推送通知。",
      "采用可分叉架构，澳大利亚大学可替换 data/ 与环境变量后使用。",
    ],
    proof: [
      "2026 年作为正式初创项目加入 Macquarie 大学孵化器。",
      "在 syllabus-sync.app 生产环境运行。",
      "92 个文件中 503 项测试全部在 CI 通过。",
      "零信任代理默认捕获错误配置，已在生产环境验证。",
      "设计服务~47,000 名 MQ 学生，可分叉至其他澳大利亚大学。",
      "WebAuthn 通行密钥认证，共享秘密不离开设备。",
    ],
    features: [
      "LLM OCR 从 PDF 大纲提取结构化 JSON。",
      "Syllabus-as-Code：将考核和截止日期纳入版本控制。",
      "完整学生系统：日历、提醒、校园地图和通知。",
      "92 个文件中 503 项测试，配合 CI/CD 质量门。",
    ],
    measures: [
      "零信任代理中间件，所有路由默认要求认证。",
      "在数据库层实施 Supabase 行级安全。",
      "WebAuthn/FIDO2 通行密钥认证，不存储密码。",
      "通过模式约束输出和输入清理缓解 LLM 提示注入。",
      "CI 秘密扫描阻止凭证模式进入提交。",
    ],
  },
  "divan-open-day": {
    title: "Divan · 开放日",
    description:
      "为波斯学生会开放日展位构建的英语／波斯语双语、离线优先的哈菲兹与鲁米诗歌体验。访客选择诗人，即可获得经过审校的诗句、译文、出处和吟诵；没有 cookie、追踪器或后端。",
    fullDescription:
      "Divan 是为波斯学生会开放日展位构建的双语波斯诗歌体验。访客选择哈菲兹或鲁米，心怀一个愿望，获得经过审校的诗句、英文译文、来源及可选吟诵。它以离线和隐私为基础，不使用 cookie、追踪器、后端或访客输入，因此在活动场地不稳定的网络下仍可靠运行，且不收集使用者的数据。",
    problem:
      "公共开放日展位需要快速、愉快的文化体验，能在不稳定的 Wi-Fi 下运行，充分保护隐私，并以文化与学术诚信展示波斯诗歌；不编造诗句、不将书法栅格化，也不收集数据。",
    solution: [
      "精选 60 首哈菲兹诗句 + 60 首鲁米诗句，共 120 条，每条绑定不可变版本与可核验的出处。",
      "通过手写服务工作线程让整套应用离线优先，无网络也能运行。",
      "Web Crypto 随机排序候选池（shuffle bag）在设备端选择诗句；没有服务器记录访客抽到的内容。",
      "使用 Nastaliq 文本字体和诗人独立视觉设计，保留文化真实性而非扁平图像。",
      "从开始纳入无障碍：双语／RTL 标记、双向隔离、实时区域、强制颜色及减少动态效果。",
    ],
    proof: [
      "零数据收集；无 cookie、追踪器或后端，仅在 sessionStorage 保存公开诗句 ID。",
      "首次加载后，经完整性验证的服务工作线程支持完全离线运行。",
      "生产编译器在部署前拒绝合成测试数据，只发布经过审校的语料。",
      "Vitest 覆盖单元、组件、无障碍、离线、分享、性能与安全测试，另有 Playwright Chromium 端到端测试。",
    ],
    stack: [
      "Vite",
      "React 19",
      "严格 TypeScript",
      "手写服务工作线程",
      "Web Crypto（随机排序的候选池（shuffle bag））",
      "Vitest（单元／组件／无障碍／离线）",
      "Playwright（Chromium 端到端）",
      "pnpm 10.33 · Node 22.16",
    ],
    features: [
      "审校双语语料：60 哈菲兹 + 60 鲁米 = 120 条诗句，各自绑定不可变版本及可追溯出处。",
      "诗句选择使用在设备端计算的 Web Crypto 随机排序候选池（shuffle bag），无服务器参与。",
      "手写服务工作线程检查完整性，在场地不稳定网络中保持离线运行。",
      "每位诗人独立文化视觉与 Nastaliq 文本字体，使用真实波斯文字而非栅格图像。",
      "双语标记支持方向处理、双向隔离、实时区域、强制颜色和减少动态效果。",
    ],
    measures: [
      "隐私源于设计：无 cookie、标识符、追踪器或访客输入，不传输任何数据。",
      "纯静态客户端，无后端、数据库或分析基础设施。",
      "sessionStorage 仅保存公开版本／诗句 ID，动态效果偏好仅存本地。",
      "生产编译器在部署前拒绝合成及测试数据。",
      "绑定来源并核验权利：代码为 MIT；诗歌和译文保留各自许可，如 CC BY-SA。",
      "以静态容器通过出站隧道提供服务，无入站攻击面。",
    ],
  },
  "nexus-archive": {
    description:
      "赛博朋克风个人媒体库，采用 React 前端、Litestar API 与 Supabase 认证，提供 AI 推荐、加密心得和强化的 cookie 认证。",
    fullDescription:
      "Nexus Archive 是赛博朋克风个人媒体库，结合 React 前端、Litestar API 以及 Supabase 身份和持久化存储，在一个仪表板中管理书籍、电影、动漫、评分、心得、对话和 AI 推荐。",
    problem:
      "媒体追踪工具把娱乐收藏分散在不同平台，安全控制也可能薄弱。Nexus Archive 将标题、评分、笔记和推荐汇聚到一个账户，并采用行级访问控制。",
    solution: [
      "使用 React 19、Litestar 和具备行级安全的 Supabase PostgreSQL 构建全栈媒体库。",
      "以后端管理的 HttpOnly 认证 cookie 替代前端可读取的 Supabase 令牌。",
      "集成 Gemini 媒体推荐，提供共享的单用户限流和本地回退。",
      "增加加密心得存储，并通过个人信息遮蔽隔离 AI 提示。",
    ],
    proof: [
      "强化认证：HttpOnly + SameSite=Strict cookie，配合静默令牌轮换。",
      "CI 安全门：Bandit、pip-audit、npm audit 和秘密扫描。",
      "Locust 负载测试验证性能。",
      "Terraform 基础设施即代码框架，支持可复现的 Supabase + Vercel 部署。",
    ],
    features: [
      "Gemini AI 媒体推荐，故障时平稳降级。",
      "实时对话记录，按用户范围清理输入。",
      "动漫、电影和书籍的状态追踪、评分及评论。",
      "整个媒体库的智能筛选与搜索。",
    ],
    measures: [
      "HttpOnly、SameSite=Strict 认证 cookie，无前端可读取令牌。",
      "短期访问令牌，通过 /auth/refresh 静默轮换。",
      "以 XML 分隔、字符串清理和个人信息遮蔽隔离 AI 提示。",
      "通过 TAKEAWAY_ENCRYPTION_KEY 使用 AES 加密保存心得。",
      "CI 使用 Bandit、pip-audit、npm audit 和秘密扫描。",
    ],
  },
  nanomatch: {
    description:
      "C++20 高性能限价订单簿与撮合引擎；单线程合成基准达到每秒 1M+ 订单，取消订单耗时低于一微秒。",
    fullDescription:
      "NanoMatch 是使用现代 C++20 构建的高性能限价订单簿与撮合引擎。它模拟金融交易所核心操作，以价格与时间优先匹配买卖订单，每秒可执行数百万操作。",
    problem:
      "金融交易所需要超低延迟的订单撮合。要从系统层面理解引擎，必须在真实性能约束下从零构建。",
    solution: [
      "实现价格与时间优先 FIFO 撮合，支持 Limit、Market、IOC 和 FOK 订单。",
      "通过哈希表索引实现 O(1) 取消和修改订单。",
      "构建自定义内存池，移除热路径的堆分配开销。",
      "为每个交易符号提供独立订单簿，支持多标的。",
    ],
    proof: [
      "吞吐量：每秒 1M+ 订单，单线程合成基准。",
      "完整测试套件含 p50/p99 延迟基准。",
      "18 个测试套件中的 60+ 单元测试全部通过。",
      "每次推送执行 ASan、UBSan、cppcheck 和 clang-format。",
    ],
    features: [
      "价格与时间优先 FIFO 撮合。",
      "4 种订单：Limit、Market、IOC、Fill-or-Kill。",
      "通过哈希表 O(1) 取消或修改订单。",
      "自定义内存池移除堆分配开销。",
    ],
    measures: [
      "CI 使用 AddressSanitizer 与 UndefinedBehaviorSanitizer。",
      "18 个套件中的 60+ 单元测试。",
      "每次推送执行 cppcheck 静态分析。",
      "无外部运行时依赖。",
    ],
  },
  sentinelflow: {
    description:
      "C++17 实时网络入侵检测系统，提供分层协议解析、受 Snort 启发的规则引擎和有状态威胁检测；单线程、纯解析、合成 SYN 流量基准达到每秒 500K+ 包。",
    fullDescription:
      "SentinelFlow 实时网络入侵检测系统可捕获实时流量或处理 pcap 文件，解析多个 OSI 层的协议头，识别已知攻击签名与异常，并将安全告警导出到控制台和 CSV。",
    problem:
      "网络入侵检测需要在线速下执行深度包检测。商业 IDS 不透明；从零构建可以展示协议解析、签名匹配和有状态分析的工作原理。",
    solution: [
      "实现 Ethernet、IPv4、TCP、UDP、ICMP、DNS 和 ARP 分层解析。",
      "构建受 Snort 启发、可配置的规则引擎，灵活匹配签名。",
      "加入端口扫描、SYN 洪泛和 DNS 隧道的有状态检测。",
      "吞吐量优化达到每秒 500K+ 包，单线程解析、合成 SYN 流量。",
    ],
    proof: [
      "每秒 500K+ 包，单线程解析、合成 SYN 流量。",
      "覆盖 7 个协议和 2-7 层。",
      "27 项单元／集成测试全部通过。",
      "支持实时捕获和 pcap 文件分析。",
    ],
    stack: [
      "C++17",
      "libpcap",
      "CMake",
      "Google Test",
      "受 Snort 启发的规则",
      "BPF 过滤器",
    ],
    features: [
      "使用 libpcap 实时捕获，配合可配置 BPF 过滤器。",
      "分层解析 Ethernet、IPv4、TCP、UDP、ICMP、DNS 和 ARP。",
      "受 Snort 启发、可配置且支持签名匹配的规则引擎。",
      "有状态检测端口扫描、SYN 洪泛和 DNS 隧道。",
    ],
    measures: [
      "按严重程度着色告警，范围 LOW 至 CRITICAL。",
      "27 项单元／集成测试覆盖所有协议层。",
      "CSV 导出用于取证分析和 SIEM 集成。",
      "可配置 BPF 过滤器用于定向捕获。",
    ],
  },
  ecrsm: {
    title: "eBPF 云运行时安全监控器",
    description:
      "合成、只读的运行时可视化栈，结合内核 eBPF、Go 采集代理和 React 仪表板；用于教学的运行时监控器。",
    fullDescription:
      "ECRSM 是基于 eBPF 的教学用云运行时安全监控器，以内核 eBPF、Go 采集代理和 React 仪表板组成合成、只读的运行时可视化栈。",
    problem:
      "理解内核层面的运行时安全十分复杂。ECRSM 提供安全的教学平台，用于学习 eBPF 监控。",
    solution: [
      "实现 eBPF 钩子以安全追踪系统调用。",
      "构建 Go 采集代理收集并丰富元数据。",
      "创建实时 React 可视化仪表板。",
      "设计安全的合成攻击模拟。",
    ],
    proof: [
      "检测反向 shell、进程注入和可疑执行。",
      "使用低开销 perf buffer 传输数据。",
      "丰富容器／K8s 元数据。",
      "可通过合成攻击脚本验证。",
    ],
    stack: [
      "eBPF (C)",
      "Go（智能体）",
      "React（仪表板）",
      "Kubernetes（Helm）",
    ],
    features: [
      "内核跟踪点：execve、connect、ptrace、mmap。",
      "Go 采集代理用于元数据丰富和规则处理。",
      "实时 WebSocket 仪表板。",
      "Kubernetes DaemonSet 部署。",
    ],
    measures: [
      "只读检查，不写入内核。",
      "仅元数据，不收集载荷或秘密。",
      "最小权限，仅 BPF/SYS_ADMIN 能力。",
      "安全的合成模拟。",
    ],
  },
  simurghforge: {
    description:
      "macOS 通用文件转换器，以 9 个引擎支持图像、文档、音频、视频和数据的 49 种格式，无云依赖，单一 .app 包。",
    fullDescription:
      "SimurghForge 是以 Tauri v2 构建的 macOS 通用文件转换器，使用 Rust 后端与 React/TypeScript 前端。9 个专用引擎覆盖图像、文档、音频、视频和结构化数据的 49 种格式：4 个原生 Rust 引擎保障性能，5 个 CLI 桥接引擎拓展格式覆盖。全部处理在本地完成，无云依赖。",
    problem:
      "文件转换通常需要把敏感文档上传云端、使用多个专用工具，或安装庞大的 Electron 应用。用户需要统一、快速、尊重隐私的本地转换工具。",
    solution: [
      "构建三层引擎：原生 Rust 追求速度、CLI 工具提供功能、Python 处理表格数据。",
      "用魔数识别 MIME 类型，自动选择引擎。",
      "通过 Tokio 信号量控制并发，协调批量任务。",
      "作为单一 .app 包发布，提供低、中、高和无损质量预设。",
    ],
    proof: [
      "5 个类别支持 49 种格式：图像、文档、音频、视频和数据。",
      "9 个转换引擎依据 MIME 自动路由。",
      "最多 50 个文件批处理，支持 1-8 线程配置。",
      "零网络调用，完全离线的本地处理。",
    ],
    features: [
      "9 个引擎：4 个原生 Rust 和 5 个 CLI 桥接引擎，含 FFmpeg、LibreOffice、Pandoc、Pandas、ImageMagick。",
      "49 种图像、文档、音频、视频和结构化数据格式。",
      "最多 50 个文件批转换，使用 Tokio 信号量配置并发。",
      "用魔数识别 MIME 并自动路由引擎。",
    ],
    measures: [
      "100% 本地处理，零网络调用，无云依赖。",
      "基于 MIME 的魔数检测防止扩展名伪装。",
      "对所有文件操作清理路径。",
      "单一 .app 包，无后台服务或守护进程。",
    ],
  },
  aion: {
    description:
      "AI 圣经助手，使用混合 RAG：关键词与 pgvector 语义向量搜索、Gemini 实时 SSE 流式响应，并以 Tauri v2 支持跨平台。",
    fullDescription:
      "Aion 是 AI 圣经助手，允许用户用自然语言提问。回答依据混合 RAG 检索出的真实经文，结合关键词匹配与 pgvector 语义向量搜索，再由 Gemini 通过 SSE 实时输出。移动端使用 React Native + Expo，桌面端使用 Tauri v2。",
    problem:
      "圣经研读工具要么只有关键词搜索而无法理解语义，要么使用会编造经文的 AI 聊天机器人。用户需要有真实经文依据、引文可核验的对话助手。",
    solution: [
      "构建混合 RAG，结合 regex 关键词提取、1536 维 OpenAI 嵌入与 pgvector 语义搜索。",
      "通过 Supabase Edge Functions 实现 Gemini 实时 SSE 流式响应。",
      "设计内嵌经文卡片，完整标明书卷、章、节以便核验。",
      "移动端支持 React Native，原生桌面端支持 Tauri v2。",
    ],
    proof: [
      "混合 RAG 检索使回答基于真实经文，而非编造内容。",
      "按 IP 限流：5/min、30/3hrs、200/day，错误时默认拒绝。",
      "精确匹配响应缓存消除重复 LLM 成本。",
      "匿名认证，无需注册；所有表均执行 Supabase RLS。",
    ],
    features: [
      "混合 RAG：regex 关键词提取、1536 维 OpenAI 嵌入与 pgvector 语义搜索。",
      "Gemini 经 Supabase Edge Functions 实时 SSE 输出。",
      "内嵌经文卡片，注明书卷、章和节。",
      "跨平台：React Native 支持 iOS/Android；Tauri v2 支持 macOS/Windows/Linux。",
    ],
    measures: [
      "所有 OpenAI、Gemini 和 service_role 密钥仅保存在服务端 Edge Function 秘密中。",
      "IP 限流：突发 5/min，每 IP 30/3hrs，全局 200/day。",
      "所有 Supabase 表启用行级安全 RLS。",
      "消息最多 500 字符，防止令牌填充。",
      "精确匹配响应缓存，重复查询的 LLM 成本为零。",
      "限流错误默认拒绝，遇到错误时拒绝请求。",
    ],
    papers: [
      {
        label: "预印本",
        status: "试点基准预印本",
        description:
          "8 页论文提出 40 问圣经 RAG 基准，评估引文忠实度和错误前提鲁棒性；v3 检索达到 R@5 = 0.941、平均 citation_support = 0.978，无无依据引文，并拒绝了 6/6 错误前提。",
      },
    ],
  },
} satisfies ProjectTranslations;
