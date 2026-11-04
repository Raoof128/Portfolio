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
      "公开仓库现已包含 Windows 和 macOS 概念验证源码与评估工具；论文早期关于源码未公开的说明不代表当前仓库的可获取状态。",
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
      "面向工具型 AI 智能体、可检查的授权与遏制研究原型。2026 年 10 月匹配对照研究：Llama-3.2-3B 中产生新效果的受限状态试验从 17/24 降至 0/24，保留 23/24 次有效完成。gpt-6-luna 基线已为 0/24，因此未观察到增量保护。",
    fullDescription:
      "Project Simurgh 是由一人创作的开源研究原型，用于检查 AI 智能体获准执行的操作。委托、停止、租期和凭证状态保存在主机上；每项工具提案都在模型外与这些状态核对。当前研究证据采用以 SHA-256 固定、绑定源码版本的归档，并通过新建本地服务重放；早期冻结的证明阶段使用 Ed25519。2026 年 10 月的迁移研究在一个模型上报告收益，在另一个模型上报告零增益。较早的分类器漏检和 AgentDojo 结果保留为独立冻结实验，原始设备完整性预印本则记录早期研究脉络。",
    problem:
      "工具型智能体可能在委托、停止、租期或凭证状态变化后继续提议操作。主机控制需要在模型外执行这些状态约束。评估还需要匹配基线、有效任务结果及不确定性报告：原本已无违规结果的模型基线无法展示额外保护。",
    solution: [
      "在主机上保存委托、停止、租期和凭证状态，并在模型外检查每项工具提案；当前证据归档用 SHA-256 绑定保留文件及源码版本，以供本地重放。",
      "2026 年 10 月迁移研究：24 个任务，每项两次试验，三个匹配对照（仅凭证、组合控制、全部拒绝）、两个模型及 288 个重放分支；从协议到发布包用时 2026 年 10 月 15–17 日",
      "在 Meta Llama-3.2-3B 上，组合主机控制将产生新效果的受限状态试验从 17/24 降至 0/24，保留 23/24 次有效完成，未阻止任何有效提案",
      "OpenAI gpt-6-luna 基线已为 0/24；研究未在该模型上报告增量保护",
      "按状态报告不确定性：24 次受限试验分为六个状态；Wilson 95% 区间为 43.6–97.0% 对 0.0–39.0%，部分差距由控制结构本身决定",
    ],
    proof: [
      "2026 年 10 月匹配对照迁移研究：24 个任务 × 两次试验 × 三个对照 × 两个模型，共 288 个重放分支。Llama-3.2-3B 的正向结果与 gpt-6-luna 的零增益结果一并报告",
      "Llama-3.2-3B：产生新效果的受限状态试验 17/24 → 0/24，有效完成 23/24，未阻止有效提案；gpt-6-luna：基线 0/24，未观察到增量保护",
      "聚类范围：24 次受限试验分布于六个状态。按状态计算的 Wilson 95% 区间为 43.6–97.0% 对 0.0–39.0%；部分差异由控制结构本身决定",
      "OpenAI Responses API 集成缺陷：角色放置错误导致 8/8 个工作流拒绝。原始轨迹得到保留；冻结的 developer 角色修正完成 2/3 个授权工作流，拒绝 5/5 个受限工作流，仍有一次拒绝尚未解决",
      "较早的冻结分类器阶段（2026）：真实 Llama Guard 4 12B 测试 180 个案例；遏制证据覆盖其漏检的全部 138/138 个恶意案例，包括输入分类器视野之外的 120 个下游注入。这是覆盖声明，不是分类器排名",
      "较早的冻结 AgentDojo 阶段（2026）：真实 Llama-3.3-70B 在 140 个预注册工作区注入上的目标攻击成功数由 9/140 降至 0/140，但良性任务效用由 7/10 降至 6/10。另一个不使用真实 LLM 的确定性四套件运行记录了攻击成功数 0/949、受攻击时效用 949/949、良性效用 97/97。这些是有范围限制的实验，不是 10 月迁移研究。",
      "39 个 Lean 4 证明文件针对选定数学模型，由拒绝未经证明的“sorry”占位符的检查门验证；5,171 项根目录测试在 2026 年 10 月 19 日冒烟运行中通过；发布了 92 个版本。完整重放当前证据需要原生 Linux x86_64 和 Python 3.12；安装依赖需要访问软件包索引。根包声明 AGPL-3.0-or-later。",
      "审计项目自己的 919 份文档，在 README 链接的公开发现登记表中发布 141 项带日期的发现，包括早期结项报告中的过度陈述。",
      "当前软件归档 DOI 10.5281/zenodo.21737792 与原始设备完整性预印本 DOI 10.5281/zenodo.20374849 及其他预印本分开标识",
    ],
    stack: [
      "Python 3.12 组合授权控制与重放工具",
      "React 证据浏览器与共享 JSON CLI",
      "当前研究归档以 SHA-256 固定并绑定源码；早期冻结阶段使用 Ed25519 证明",
      "支持工具调用的 OpenAI Responses API",
      "自托管 Llama-3.2-3B / Llama-3.3-70B",
      "用于选定属性的 Lean 4 模型",
      "较早的冻结遏制网关（Node.js / JavaScript）",
    ],
    features: [
      "主机保存的委托、停止、租期和凭证状态在模型外逐项检查每个工具提案",
      "匹配的仅凭证、组合控制和全部拒绝对照，将主机控制效果与模型基线及有效任务结果区分开",
      "当前研究归档用 SHA-256 绑定文件与源码版本，并在原生 Linux x86_64 和 Python 3.12 上通过新建本地服务重放；早期冻结的证明阶段使用 Ed25519。",
      "较早的冻结架构采用四道遏制边界：输入防火墙、上下文来源守卫、工具调用门和输出泄漏防火墙",
    ],
    measures: [
      "主机状态检查约束获准的工具提案；研究原型和小规模实验并不构成普遍安全保证",
      "正向和零增益模型结果一同发布，并明确状态聚类不确定性及控制结构本身决定的差距",
      "OpenAI 角色放置失败和冻结修正仍被公开保留；一个授权工作流的拒绝问题尚未解决",
      "39 个 Lean 4 证明文件为选定的早期数学属性建模，并由拒绝未经证明的“sorry”占位符的检查门约束；它们不证明实现等价性或整个智能体的安全。",
      "较早冻结的遏制证据补充输入分类器；它不是通用越狱检测器，也不证明能够阻止所有不安全模型输出",
    ],
    papers: [
      {
        label: "较早的设备完整性预印本",
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
      "本地优先的文档知识引擎，采用 Python 摄取、SQLite FTS5／向量检索及由 Python 支持写入的 Rust MCP stdio 服务器。当前密封评估工作仍未关闭。",
    fullDescription:
      "Project Zurvan 是一个本地优先的知识引擎，将受支持的文本文档转换为相互链接、可搜索、适合 git 管理的维基，并通过 MCP 提供给智能体。Python 负责摄取与权威写入；原生 Rust 服务器提供读取，Python 服务器保留为参考实现与回退。混合检索结合 SQLite FTS5、本地嵌入及图扩展。图像记录为待视觉处理的占位条目，不会被自动解读。公开仓库包含仍在进行的密封评估研究；最新合并主干回执并未声称 Z1b 已关闭。",
    problem:
      "智能体需要持续保留声明、来源与决策之间关系的结构化记忆。有用的本地优先系统还应显示索引何时过期、哪些来源尚未提取，以及检索评估实际证明了什么。",
    solution: [
      "构建 Python 摄取管线，支持 Markdown、含文本的 PDF 和 TXT；图像创建待视觉处理占位条目，PDF 图示被标记为未转录。",
      "将类型化声明、概念、实体和决策提取到相互链接的维基；权威写入经由知识账本。",
      "结合 SQLite FTS5、本地语义嵌入和图邻居扩展，明确提供索引／账本的新鲜度信息。",
      "新增 Rust MCP stdio 读取服务器，写入和评估由 Python 支持；Python 服务器仍是参考实现和回退。",
      "联邦仅连接显式注册的知识库，提供跨项目搜索、决策记忆、矛盾检测和政策监测。",
    ],
    proof: [
      "最新合并主干套件回执，2026 年 10 月 20 日：3,334 项通过、1 项失败、8 项跳过。失败项需要操作员的 sudo 上下文；它按失败记录，未被改成通过。",
      "10 月 20 日 Rust/Python 实际协议一致性回执：每种协议 314 个案例，312 PASS、2 个预期差异、0 FAIL；覆盖 MCP 2025-11-25 和 2026-07-28。这些是仓库报告的测量。",
      "兼容 Obsidian 的知识库包含七种有文档记录的图节点：声明、概念、实体、决策、会话、矛盾和综合。",
      "证据包 → 报告 → 审查 → 发布可在本地运行；提取是否使用网络仍取决于配置的 LLM 提供方。",
      "保留早期 18 阶段功能历史；后续检索、Rust MCP 与密封评估有各自的日期记录。Z1b 在结项前合并，仍明确标记为 NOT CLOSED。",
    ],
    stack: [
      "Python 3.10+ 摄取与写入桥接",
      "Rust 原生 MCP 服务器；Python 参考实现与回退",
      "SQLite FTS5 + sqlite-vec 0.1.6",
      "本地 MiniLM 嵌入用于语义检索",
      "MCP stdio：15 个工具、7 项资源、4 个提示",
      "OpenAI / Anthropic / Ollama / Mock LLM 提供方",
      "兼容 Obsidian 的知识库布局",
    ],
    features: [
      "将 Markdown、含文本的 PDF 和 TXT 摄取到相互链接、可搜索的维基；图像生成待视觉处理的占位条目，不执行自动 OCR 或视觉提取。",
      "LLM 提取类型化声明、概念、实体和决策；未提取的来源与未转录的 PDF 图示仍被明确标记。",
      "混合 FTS5、本地语义检索和图邻居扩展组装上下文，并附带索引／知识账本的新鲜度标记。",
      "Rust MCP stdio 服务器提供原生读取；写入和评估使用 Python 桥接，保留参考实现与显式启用写入的边界。",
      "多项目联邦支持已注册知识库之间的搜索、矛盾检测和政策监测。",
      "2026 年 10 月 20 日合并主干回执：3,334 项通过、1 项失败、8 项跳过；真实操作员测试仍失败，Z1b 密封评估结项仍未关闭。",
    ],
    measures: [
      "文档与本地嵌入检索保留在配置的存储中；LLM 提取可用本地／模拟服务或配置的 OpenAI/Anthropic，是否外部处理取决于所选提供方。",
      "MCP 写入默认关闭，需显式启用；读取允许列表和原始来源限制同时适用于 Rust 与 Python 服务器。",
      "用户知识库注册信息位于项目目录之外的 ~/.zurvan/projects.json；发布和证据输出具有独立的本地脱敏边界。",
      "Mock LLM 提供方支持安全开发和测试，避免暴露 API 密钥。",
      "智能体记忆按知识库隔离，跨库联邦需显式注册。",
    ],
  },
  gitswitch: {
    description:
      "跨平台 Git 客户端，支持多个开发身份、仓库审查与 AI 辅助提交，提供云端、本地模型及离线生成模式。",
    fullDescription:
      "GitSwitch 是面向管理多个身份和仓库的开发者的 Electron／React 跨平台 Git 客户端。它结合 SSH／账户管理、差异审查、GitHub/GitLab 工作流，并可通过云服务、本地模型或离线启发式生成提交消息。特权操作与解密后的凭证由主进程处理。",
    problem:
      "同时管理个人与工作仓库的开发者需要一致的 Git 身份、有效的差异审查，以及对发送给 AI 服务的代码进行明确控制。",
    solution: [
      "围绕全局及仓库本地 Git 身份构建账户与 SSH 管理。",
      "加入可替换的 Gemini、OpenAI、Anthropic 和本地模型提供方，以及离线启发式模式。",
      "通过受限 IPC 桥接隔离渲染器与主进程特权操作。",
      "加入明确的云端 AI 同意、可选差异脱敏及了解仓库上下文的提交验证。",
    ],
    proof: [
      "固定版本的包清单声明 Electron ^39.2.6 和 React ^19.2.1。",
      "源码开启 contextIsolation 和 sandbox，关闭 nodeIntegration。",
      "safeStorage 加密凭证文件，并在加密不可用时拒绝存储。",
      "提供方代码实现云端同意、本地／离线选项及可配置的生成超时。",
    ],
    features: [
      "多账户 SSH 与 Git 身份管理。",
      "通过 Gemini、OpenAI、Anthropic、本地 LLM 或离线启发式生成提交消息。",
      "了解仓库上下文的差异查看器及 GitHub/GitLab 合并请求工作流。",
      "云端 AI 同意门、可选差异脱敏和有界请求。",
    ],
    measures: [
      "使用 Electron safeStorage 静态加密秘密；加密不可用时拒绝存储。",
      "渲染器使用 sandbox 与上下文隔离，并关闭 Node 集成。",
      "验证 IPC 边界，限制输入与操作超时。",
      "云端 AI 同意与可选差异脱敏；清除 JavaScript 引用不保证擦除内存。",
    ],
    stack: [
      "Electron 39",
      "React 19",
      "TypeScript 5.9",
      "Zustand 5",
      "Gemini / OpenAI / Anthropic / 本地 LLM",
      "Vitest + Playwright",
    ],
  },
  "mehr-guard": {
    description:
      "基于 Kotlin Multiplatform、面向 5 个平台的离线二维码与 URL 分析核心。本地启发式规则和集成模型检查 URL 模式，分析期间无需云端查询。",
    fullDescription:
      "Mehr Guard 将本地二维码与 URL 分析核心与原生或浏览器界面结合，覆盖 5 个 Kotlin Multiplatform 目标平台。启发式规则与集成模型标记 URL 模式；已报告的准确率和延迟仅适用于精选案例与桌面 JVM 引擎测试。",
    problem:
      "QR 码是常见钓鱼入口，但多数扫描器将数据上传云端，损害隐私。用户需要验证 URL 而不泄露浏览记录。",
    solution: [
      "使用 Kotlin Multiplatform 构建本地 URL 分析核心",
      "将逻辑回归、梯度提升和决策规则与 25+ 项启发式检查结合",
      "面向 5 个平台（Android、iOS、JVM、JS、Wasm）；仓库报告约 ~100% 的检测逻辑共享（约占总代码 ~52%）",
      "仓库桌面 JVM 基准报告引擎分析中位耗时低于 5ms；摄像头/界面延迟和其他平台不在此结果范围内",
    ],
    proof: [
      "仓库报告精选 URL 语料上的 F1 为 87%；人工构造的模式不能证明真实场景检测准确率",
      "性能证据仅覆盖桌面 JVM 引擎分析；低于 5ms 的中位耗时不保证所有平台或端到端 P99",
      "仓库报告 1,248+ 项自动化测试和 19 个精选内置红队场景；本次作品集审计未重新运行这些计数所对应的测试",
      "./judge/verify_offline.sh 调用共享引擎单元检查；这些测试不是对出站网络流量的独立抓包",
      "仓库报告约 ~100% 的检测逻辑共享（约占总代码库 ~52%）",
    ],
    features: [
      "5 个目标平台（Android、iOS、JVM、JS、Wasm）",
      "集成模型：逻辑回归、梯度提升和决策规则",
      "检测品牌仿冒、同形字攻击与恶意重定向",
      "启发式引擎（25+ 项检查）",
      "内置红队套件（19 个精选攻击场景）",
    ],
    measures: [
      "本地 PhishingEngine 分析旨在不进行云端 URL 查询",
      "在设备上进行 ML 与启发式评分",
      "分析不要求上传扫描得到的 URL",
      "离线单元检查覆盖完成性、确定性和耗时；网络拦截并未得到独立验证",
    ],
  },
  "syllabus-sync": {
    description:
      "用于规划、截止日期与校园导航的独立学生体验平台。在 Macquarie University Incubator 内共同创立，承担安全/backend 共同维护职责。2026 年 8 月 17 日的 CI 测试作业通过了 155 个文件中的 1,343 项测试。",
    fullDescription:
      "Syllabus-Sync 是最初为 Macquarie University 学生构建的独立学生体验平台，涵盖学业规划、考核截止日期、校园导航、通知和档案管理。Raouf 的角色是共同创始人及安全/backend 共同维护者。提供的职业资料记录了项目获 Macquarie University Incubator 接纳；仓库明确说明项目独立且与大学没有官方隶属关系。当前代码和 CI 证据支持学生平台及其安全工作。仓库也记录了 PDF 提取方向，并将独立提取器列在路线图中。",
    problem:
      "学生需要统一管理考核截止日期、学业规划和校园信息，同时确保账户安全并明确个人数据边界。",
    solution: [
      "共同创立平台，并与主要架构和基础设施维护者合作，贡献安全/backend 工作",
      "实现受保护路由中间件、通行密钥、MFA、按用户限定的数据访问和审计控制",
      "围绕可配置的学业数据集整合规划、日历、校园导航和通知",
      "记录课程大纲的结构化提取和向其他大学的适配，不将路线图工作表述为经独立验证的实现",
    ],
    proof: [
      "提供的简历与职业档案记录了初创项目获 Macquarie University Incubator 接纳以及共同创始人角色",
      "在修订版 0fecd030，2026 年 8 月 17 日的 CI 测试作业通过了 155 个文件中的 1,343 项测试；独立安全作业失败",
      "同一修订版上的独立 Cloudflare Worker 部署作业成功；当前演示可用性未得到独立验证",
      "中间件源码在受保护 API 的身份认证无法确定时返回 503，在未认证时返回 401",
      "README 将 Raouf 列为安全/backend 共同维护者，并说明项目独立于大学的关系",
      "通行密钥使用公钥凭据；这不意味着所有受支持的身份认证流程均无密码",
    ],
    features: [
      "学业规划、考核截止日期、日历、校园导航和通知",
      "已记录的 PDF 转结构化数据流程；独立提取器仍在仓库路线图中",
      "多档案学生工具及特定院校的学业数据集",
      "2026 年 8 月 17 日的 CI 测试作业通过了 155 个文件中的 1,343 项测试；这不代表整个流水线通过",
    ],
    measures: [
      "中间件保护配置的页面路由与非公开 API，明确列出公开例外，并在 API 身份认证无法确定时拒绝放行",
      "Supabase Row-Level Security 与按用户限定的数据库访问",
      "WebAuthn/FIDO2 通行密钥，以及受支持的密码和 MFA 流程",
      "模式校验、CSRF 控制、审计日志和按路由限流",
      "CI 配置了密钥扫描；所审查运行中的独立安全作业在 npm audit 处失败，后续检查未执行",
    ],
    stack: [
      "Next.js 16 + React 19",
      "TypeScript 5",
      "Supabase PostgreSQL",
      "TanStack Query + Zustand",
      "Leaflet + Google Maps",
      "Framer Motion + Radix UI",
      "Cloudflare Workers / OpenNext",
      "Upstash Redis + Sentry",
    ],
  },
  "divan-open-day": {
    title: "Divan · 开放日",
    description:
      "为 Persian Society 开放日摊位构建的英语/波斯语双语哈菲兹与鲁米诗歌体验。访客获得经来源校验的诗句、译文、署名及可选朗诵。离线使用以已验证版本的缓存为前提；诗歌选择保留在设备上，托管连接数据属于另一隐私边界。",
    fullDescription:
      "Divan 是为 Persian Society 开放日摊位构建的双语波斯诗歌体验。访客选择哈菲兹或鲁米，在心中许愿而不提交，然后获得经来源校验的诗句、英语译文、署名和可选朗诵。已验证并缓存的版本支持离线使用。静态应用不设账户、心愿表单、访客数据库或分析端点；托管商与网络边缘处理的有限连接数据仍属于另一隐私边界。",
    problem:
      "公开的开放日摊位需要快速的文化体验，能在不稳定的场地 Wi-Fi 下使用，不收集访客心愿或诗歌选择，并以清晰署名和实时书法字体呈现绑定来源的波斯诗歌。工程来源检查必须与文化审阅批准和手动辅助技术证据区分开。",
    solution: [
      "编译恰好 60 条哈菲兹 + 60 条鲁米记录（共 120 条），绑定不可变版本，具备已记录且可机器验证的来源信息",
      "构建带完整性校验的 service worker，使已验证并缓存的版本在无网络时仍可使用",
      "Web Crypto 洗牌袋在设备上选择诗句；没有服务器记录访客抽到的内容",
      "渲染实时 Nastaliq 字体，并为哈菲兹与鲁米分别设计受波斯细密画启发的美术方向，而非扁平化书法图片",
      "从一开始融入无障碍：双语/RTL 标记、双向隔离、动态区域、forced-colors 和减少动态效果支持",
    ],
    proof: [
      "应用代码无访客表单、跟踪 Cookie、分析端点或 backend；sessionStorage 仅保存公开版本和诗歌选择状态",
      "离线就绪由已验证的版本和缓存状态确定，不能假定每次初次加载后都可离线使用",
      "生产编译拒绝合成 fixtures，并要求绑定来源的语料证据；2026 年 7 月报告记录了 60 条哈菲兹 + 60 条鲁米",
      "配置的 Vitest 套件覆盖单元、组件、无障碍、离线、分享、性能和安全检查，另有 Playwright Chromium e2e；这些是工程检查，并非文化或手动辅助技术认证",
    ],
    stack: [
      "Vite",
      "React 19",
      "严格 TypeScript",
      "手写服务工作线程",
      "Web Crypto（随机排序的候选池（shuffle bag））",
      "Vitest（单元／组件／无障碍 a11y／离线）",
      "Playwright（Chromium 端到端 e2e）",
      "pnpm 10.33 · Node 22.16",
    ],
    features: [
      "经来源校验的双语语料：恰好 60 条哈菲兹 + 60 条鲁米 = 120 条记录，绑定不可变版本，并有可机器验证的来源文档",
      "诗句选择使用在设备上计算的 Web Crypto 洗牌袋，无服务器参与",
      "离线优先：手写 service worker 通过完整性校验，使摊位能在场地网络不稳定时继续运行",
      "每位诗人采用不同的文化美术方向与实时 Nastaliq 字体排版（真正的波斯文字符，绝非栅格图像）",
      "双语标记支持文字方向、双向隔离、动态区域、forced-colors 与减少动态效果",
    ],
    measures: [
      "不设访客账户，也不提交心愿；诗歌选择保留在设备上，无应用数据库或跟踪 Cookie",
      "静态客户端无运行时 backend、访客数据库或应用分析端点；托管商可按其自身设置处理有限的技术连接数据",
      "sessionStorage 仅保存公开版本、诗人和诗歌选择状态；动态效果偏好在本地 localStorage 中保存",
      "生产编译器在部署前拒绝合成/测试数据",
      "绑定来源的署名与权利校验（代码采用 MIT；诗歌和译文保留各自许可，例如 CC BY-SA）",
      "静态源站位于出站隧道之后，主机不公开应用端口",
    ],
  },
  "nexus-archive": {
    description:
      "采用 React、Litestar 与 Supabase 的赛博朋克风格个人媒体库及求职跟踪器。提供 AI 辅助推荐、持久聊天、需配置的摘要笔记 Fernet 加密，以及 backend 签发的认证 Cookie 和刷新流程。",
    fullDescription:
      "Nexus Archive 是赛博朋克风格的个人媒体库及求职跟踪器，结合 React frontend、Litestar API 以及 Supabase 支持的身份与持久存储。在同一仪表板管理书籍、电影、动漫、求职申请、评分、摘要笔记、持久聊天会话和 AI 辅助推荐。摘要写入要求已配置的 Fernet 密钥，生产 Cookie、令牌有效期与数据库控制依赖文档中的部署设置。",
    problem:
      "媒体追踪工具把娱乐收藏分散在不同平台，安全控制也可能薄弱。Nexus Archive 将标题、评分、笔记和推荐汇聚到一个账户，并采用行级访问控制。",
    solution: [
      "构建 React 19 + Litestar API 全栈媒体库，以 Supabase PostgreSQL 和 Row Level Security 为支撑",
      "实现 backend 签发的 HttpOnly SameSite=Strict Cookie 与刷新流程；访问令牌也会在 frontend 可读的会话响应中返回",
      "整合 Gemini AI 媒体推荐、按用户共享的限流与本地回退",
      "为摘要笔记加入强制密钥的 Fernet 加密，并为模型请求加入输入清理、XML 上下文分隔符和基于模式的 PII 掩码",
    ],
    proof: [
      "认证代码设置 HttpOnly SameSite=Strict Cookie 并实现刷新轮换；生产环境安全 Cookie 与令牌有效期需配置",
      "CI 定义包括 Bandit、pip-audit、npm audit 和 gitleaks；存在这些检查不能证明 HEAD 运行通过",
      "Locust 场景执行面向推荐端点的已认证请求；不声称任何实测性能结果",
      "提供用于可复现 Supabase + Vercel 部署的 Terraform IaC 框架",
    ],
    features: [
      "通过 Gemini 提供 AI 辅助媒体推荐，支持平稳降级",
      "持久化 AI 聊天记录，按用户清理内容并更新查询缓存",
      "跟踪动漫、电影和书籍的状态、评分与评论，同时支持求职申请跟踪和结合求职情况的建议",
      "跨整个媒体库的智能筛选与搜索",
    ],
    measures: [
      "由 backend 签发 HttpOnly SameSite=Strict 认证 Cookie；登录与刷新响应也会向 frontend 会话暴露访问令牌",
      "基于 Cookie 的 /auth/refresh 流程与客户端静默重试；短令牌有效期与安全 Cookie 设置依赖部署配置",
      "LLM 输入缓解措施采用 XML 分隔符、字符串清理和基于模式的 PII 掩码；不保证免疫提示注入或彻底移除 PII",
      "摘要笔记的 Fernet 加密要求 TAKEAWAY_ENCRYPTION_KEY；缺少密钥时拒绝写入摘要，而聊天加密取决于该配置",
      "CI 配置 Bandit、pip-audit、npm audit 与密钥扫描；已配置检查并不等于当前工作流通过",
    ],
  },
  nanomatch: {
    description:
      "采用价格—时间优先的 C++20 撮合引擎，支持四种订单类型及按交易品种独立的订单簿。仓库报告在 Apple M-series、Release 模式的单线程合成基准中，混合新增/撤单吞吐为每秒 9.29M 次操作。",
    fullDescription:
      "NanoMatch 是按价格—时间优先撮合的 C++20 限价订单簿与撮合引擎。它支持 Limit、Market、IOC 和 FOK 订单、按交易品种独立的订单簿、CSV 输入/输出，以及混合操作吞吐和插单延迟的合成基准。README 报告 Apple M-series 在 Release 模式下达到每秒 9.29M 次操作；本次审计未重跑该结果。",
    problem:
      "金融交易所需要超低延迟的订单撮合。要从系统层面理解引擎，必须在真实性能约束下从零构建。",
    solution: [
      "实现价格—时间优先（FIFO）撮合，支持 Limit、Market、IOC 和 FOK 订单",
      "实现期望 O(1) 的订单 ID 查找、通过价格档位树进行 O(log M) 撤单，以及先撤再加的改单",
      "构建独立的固定容量内存池分配器，并以基准与 new/delete 比较",
      "添加多交易品种支持，每个品种拥有独立订单簿",
    ],
    proof: [
      "仓库报告的吞吐：Apple M-series、Release -O3 -march=native 下每秒 9.29M 次混合新增/撤单操作；5M 次合成操作，固定随机种子 42",
      "插单延迟基准报告 add_order 的 p50/p99/p99.9；这些不是撤单延迟测量",
      "源码在 18 个测试文件中定义 137 个 Google Test 用例；本次审计未重跑以确定当前通过状态",
      "CI 配置包括针对 main 分支推送和 pull request 的 ASan、UBSan、cppcheck 和 clang-format 检查",
    ],
    features: [
      "价格—时间优先（FIFO）撮合算法",
      "4 种订单类型：Limit、Market、IOC、Fill-or-Kill",
      "订单 ID 查找的期望复杂度为 O(1)；撤单还需以 O(log M) 搜索价格档位树，改单则先撤单再重新添加",
      "独立的固定容量内存池分配器，另附分配基准",
    ],
    measures: [
      "CI 中的 AddressSanitizer 与 UndefinedBehaviorSanitizer",
      "18 个测试源文件中声明 137 个 Google Test 用例",
      "为 main 分支推送和 pull request 配置 cppcheck 静态分析作业",
      "无外部运行时依赖",
    ],
  },
  sentinelflow: {
    description:
      "C++17 网络入侵检测系统，包含 libpcap 抓包、七种协议解析器、受 Snort 启发的规则，以及检测扫描、SYN 洪泛和 DNS 隧道的有状态启发式规则。仓库报告仅含解析器的合成基准吞吐为每秒 28.4M 个数据包。",
    fullDescription:
      "SentinelFlow 实时网络入侵检测系统可捕获实时流量或处理 pcap 文件，解析多个 OSI 层的协议头，识别已知攻击签名与异常，并将安全告警导出到控制台和 CSV。",
    problem:
      "理解网络入侵检测，需要将抓包、协议解析、签名检查与有状态启发式检测视为不同阶段，分别追踪其性能成本。",
    solution: [
      "实现覆盖 Ethernet、IPv4、TCP、UDP、ICMP、DNS 和 ARP 的分层协议解析",
      "构建受 Snort 启发的可配置规则引擎，以支持灵活的签名匹配",
      "添加针对端口扫描、SYN 洪泛和 DNS 隧道的有状态威胁检测",
      "添加单线程解析器微基准，使用 5M 个重复的合成 Ethernet/IPv4/TCP SYN-ACK 数据包；不包括抓包、检测和告警",
    ],
    proof: [
      "仓库报告的解析器吞吐：单线程处理 5M 个重复合成包，达到每秒 28,409,090 个数据包；这不是端到端 IDS 吞吐，此处亦未重跑",
      "协议覆盖：第 2-7 层的 7 种协议",
      "源码在 10 个测试文件中定义 27 个 Google Test 用例；2026 年 3 月变更日志报告历史上 27/27 通过",
      "同时支持实时抓包和 pcap 文件分析",
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
      "按颜色区分严重级别的告警（LOW → CRITICAL）",
      "10 个解析器、检测器、规则及集成测试文件中声明 27 个 Google Test 用例",
      "导出 CSV 以用于取证分析和 SIEM 集成",
      "可配置 BPF 过滤器，用于定向抓包",
    ],
  },
  ecrsm: {
    title: "eBPF 云运行时安全监控器",
    description:
      "教育用途的运行时安全原型，包含只读 eBPF tracepoint 代码、Go 元数据启发式规则、通过 SSE 接收数据的 React 仪表板和 Kubernetes 部署模板。",
    fullDescription:
      "ECRSM 是教育用途的运行时安全原型，包含 eBPF 系统调用 tracepoint 程序、Go perf-buffer 读取器与元数据规则、接收 SSE 的 React 仪表板及 Helm 部署模板。它展示内核级可观测性的组成部分。本次源码审计未验证端到端事件捕获、检测准确率、开销或 Kubernetes 部署。",
    problem:
      "内核级运行时监控难以学习。ECRSM 为隔离实验室中的系统调用元数据收集、启发式告警与仪表板呈现提供教育参考。",
    solution: [
      "编写面向五种系统调用事件类型的只读 eBPF tracepoint 程序",
      "构建 Go perf-buffer 读取器、容器 ID 查找、基于环境的 pod 提示及元数据启发式规则",
      "创建由 Server-Sent Events 告警端点支持的 React 仪表板",
      "添加用于教育实验室的本地模拟脚本和 Helm 资源",
    ],
    proof: [
      "源码定义针对 shell 连接、注入原语和可疑执行路径的启发式规则；此处未测量检测准确率",
      "存在 perf-buffer 传输代码；本次审计未对运行时开销进行基准测试",
      "容器 ID 从 /proc cgroups 中解析；pod 标签是 agent 环境提示，而非经验证的逐进程 Kubernetes 归属",
      "提供本地合成脚本，但本次审计未进行端到端检测运行",
    ],
    stack: [
      "eBPF (C)",
      "Go（智能体）",
      "React（仪表板）",
      "Kubernetes（Helm）",
    ],
    features: [
      "针对 execve、connect、ptrace、memfd_create 和可执行 mmap 的 eBPF tracepoint 程序",
      "Go 元数据补充，以及教育用途的反向 shell、注入原语与可疑执行启发式规则",
      "React 仪表板在 /events 接收 Server-Sent Events",
      "用于隔离实验室部署的 Helm DaemonSet 和仪表板模板",
    ],
    measures: [
      "通过只读 eBPF 收集进程和网络元数据",
      "探针不捕获数据包载荷；进程名和文件名仍可能包含敏感元数据",
      "部署模板使用特权模式、hostPID 及 BPF/SYS_ADMIN/SYS_PTRACE 能力；仅面向隔离实验室",
      "提供用于隔离教育环境的本地模拟脚本；本次审计未执行",
    ],
  },
  simurghforge: {
    description:
      "使用 Tauri v2、Rust 与 React 19 构建的本地优先 macOS 文件转换器。九个引擎适配器覆盖图像、文档、音频、视频和结构化数据；基于 CLI 的转换要求安装相应工具。",
    fullDescription:
      "SimurghForge 是使用 Tauri v2、Rust backend 与 React 19/TypeScript 构建的本地优先 macOS 转换器。它将兼容的文件格式对路由至四个原生 Rust 引擎和五个 CLI 适配器。批量转换使用有界并发并显示逐文件进度。FFmpeg、LibreOffice、Pandoc、ImageMagick 和 Python/Pandas 功能要求相应本地工具。本次源码审计未测试格式对覆盖范围或打包后的 macOS 执行。",
    problem:
      "文件转换通常需要把敏感文档上传云端、使用多个专用工具，或安装庞大的 Electron 应用。用户需要统一、快速、尊重隐私的本地转换工具。",
    solution: [
      "构建两个引擎层：四个原生 Rust 引擎和五个 CLI 适配器，包括 Python/Pandas",
      "实现文件头检测、扩展名回退及按格式对路由引擎",
      "使用基于 Tokio 信号量的并发控制设计批量编排",
      "配置 macOS .app 目标及 Low/Medium/High/Lossless 预设标签；CLI 依赖仍需单独安装",
    ],
    proof: [
      "源码覆盖五类文件；宣传的 49 种格式总数尚未与当前 UI 的 44 键输入注册表核对一致",
      "定义了九种引擎变体，基于检测到的输入类型和请求的输出格式进行路由",
      "backend 使用 Tokio 信号量，限制最多 50 个文件和 1–8 个并发转换作业",
      "转换使用本地引擎且不要求云 API；未进行网络出站测试",
    ],
    features: [
      "9 个转换引擎：4 个原生 Rust + 5 个 CLI 桥接引擎（FFmpeg、LibreOffice、Pandoc、Pandas、ImageMagick）",
      "支持图像、文档、音频、视频和结构化数据间的兼容转换，具体取决于引擎和已安装工具",
      "批量转换最多 50 个文件，支持可配置并发（Tokio 信号量）",
      "根据文件头检测类型，并以扩展名回退，随后按输入/输出路由到引擎",
    ],
    measures: [
      "转换在本地运行，无需强制使用云 API 或上传账户",
      "已知文件签名用于辅助路由；仍存在扩展名回退，不能阻止所有格式伪装",
      "规范化输入路径、父目录组件检查、大小限制、输出扩展名校验和结构化子进程参数",
      "构建目标为 macOS .app；基于 CLI 的格式依赖另行安装的转换工具",
    ],
    stack: [
      "Tauri v2 (Rust 1.77+)",
      "React 19.2.4",
      "TypeScript",
      "Vite",
      "Tailwind CSS v4",
      "FFmpeg",
      "LibreOffice",
      "Pandoc",
      "Python Pandas",
      "ImageMagick",
    ],
  },
  aion: {
    description:
      "具备经文引用识别能力的圣经问答，结合直接经节/章节查找、关键词 + pgvector 语义检索及 Gemini 3.1 Flash Lite 实时流式输出。提供 React Native/Expo 移动应用和 Tauri v2 桌面封装。",
    fullDescription:
      "Aion 是识别经文引用的圣经伴读工具：直接经节/章节查找、关键词筛选和 pgvector 语义搜索提供上下文，Gemini 3.1 Flash Lite 经 Supabase Edge Functions 流式输出答案。它包含带出处的经文卡片、React Native/Expo 移动客户端及 Tauri v2 桌面封装。已报告的 40 问题 v3 试点评估在这一小型基准内衡量检索和引用支持程度，不保证答案没有幻觉。可选原生语音另有客户端凭据限制。",
    problem:
      "圣经研读工具要么只有关键词搜索而无法理解语义，要么使用会编造经文的 AI 聊天机器人。用户需要有真实经文依据、引文可核验的对话助手。",
    solution: [
      "构建识别经文引用的检索，结合直接经节/章节查找、关键词筛选、OpenAI 1536 维嵌入及 pgvector 语义排序",
      "通过 Supabase Edge Functions 实现来自 Gemini 的实时 SSE 流",
      "设计丰富的行内经文卡片，完整标注书卷/章/节以便验证",
      "添加跨平台支持：移动端 React Native + 原生桌面 Tauri v2",
    ],
    proof: [
      "已报告的 v3 试点：40 个问题，包括 34 个可回答的检索问题和 6 个错误前提/对抗性拒答；Recall@5 0.941、平均 citation_support 0.978、6/6 拒答。没有行低于不受支持阈值（citation_support < 0.5），但两条答案被标记为 0.75 和 0.50；这不保证无幻觉",
      "基于 IP 限流（5/min 突发、30/3hrs、200/day），默认拒绝",
      "精确匹配响应缓存消除重复 LLM 成本",
      "无需注册的匿名认证；Supabase RLS 应用于所有表",
    ],
    features: [
      "识别经文引用的检索：直接经节/章节查找、正则关键词提取、OpenAI 1536 维嵌入和 pgvector 语义搜索",
      "通过 Supabase Edge Functions 接收 Gemini 的实时 SSE 流",
      "包含书卷/章/节出处的丰富行内经文卡片",
      "跨平台：React Native（iOS/Android）+ Tauri v2（macOS/Windows/Linux）",
    ],
    measures: [
      "聊天和嵌入凭据（OpenAI、Gemini 与 service_role）使用 Edge Function secrets。可选原生语音则需要客户端提供 OpenAI 凭据以直接调用 Whisper，位于这一服务器端隔离边界之外",
      "基于 IP 限流：5/min 突发、每 IP 30/3hrs、全局 200/day 上限",
      "所有 Supabase 表启用 Row-Level Security（RLS）",
      "消息长度上限 500 字符，以防令牌填塞",
      "精确匹配响应缓存（重复查询的 LLM 成本为零）",
      "失败关闭：限流错误默认拒绝",
    ],
    papers: [
      {
        label: "预印本",
        status: "试点基准预印本",
        description:
          "8 页试点预印本：40 个问题，检索在 34 个可回答问题上评分，另有 6 个拒答案例。v3 报告 Recall@5 = 0.941、平均 citation_support = 0.978 和 6/6 拒答。单个 Gemini 3.1 Flash Lite 评审未发现 citation_support < 0.5 的行；仍有两条部分/错误引用记录，评分为 0.75 和 0.50。",
      },
    ],
    stack: [
      "React Native 0.81",
      "Expo 54",
      "TypeScript",
      "Supabase PostgreSQL",
      "pgvector",
      "OpenAI Embeddings",
      "Gemini 3.1 Flash Lite",
      "Tauri v2",
      "TanStack Query v5",
      "React Native StyleSheet",
    ],
  },
} satisfies ProjectTranslations;
