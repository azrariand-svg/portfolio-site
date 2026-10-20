// 项目内容集中在这里。视频与图片均来自个人作品集 PPT 的嵌入媒体。
// 新增项目：复制一个对象，更新 id、标题、分类与文件路径即可。
export const projects = [
  {
    id: 'viral-video', number: '01', title: 'AI 爆款视频', english: 'AI SHORT FILM', category: 'story', filters: ['ai-video'], categoryLabel: '叙事短片', year: '个人作品',
    cover: '/media/boards/poster-viral.png', ratio: 'portrait', featured: true, highlight: '平台播放 543.3 万',
    summary: '以角色视觉和微动作构成的 AI 短视频。作品集收录了角色参考、镜头提示词、生成参数与平台数据截图，可从画面锚点一路看到作品发布后的真实反馈。',
    videos: [{ src: '/media/viral-cut.mp4', poster: '/media/boards/poster-viral.png', label: '成片' }],
    boards: [], thinking: '先用角色参考建立造型锚点，再把画面拆成转身、眼神停留、轻微眨眼与发丝微动等细节。生成模型能力有限时，以即梦收尾帧补足结尾画面的控制。作品集截图记录了 Seedance 1.0 mini 的一次生成参数。',
    workflow: ['角色参考与画面锚点', '微动作与镜头节奏', 'AI 视频生成', '即梦收尾帧'], tools: ['Seedance 1.0 mini（截图所示）', '即梦（收尾帧）'],
    processVisual: { src: '/media/boards/viral-process.png', alt: '爆款视频角色参考、镜头提示词与生成画面记录', label: '从角色参考到动态镜头的过程截图' },
    processStages: [
      { title: '建立角色锚点', detail: '准备同一角色的多张参考画面，为发色、服装与整体气质提供稳定的视觉依据。' },
      { title: '把动作拆成镜头节奏', detail: '提示词记录了转身、眼神凝视、轻微眨眼和发丝微动，让静态造型进入克制的微动作表演。' },
      { title: '生成后处理结尾', detail: '过程截图标注 Seedance 1.0 mini、17 秒、3:4、720；作品集备注另记载了使用即梦收尾帧收住画面。' }
    ],
    metrics: [
      { value: '543.3万', label: '播放量' },
      { value: '37.6万', label: '点赞' },
      { value: '3.5万', label: '分享' },
      { value: '1.6万', label: '收藏' },
      { value: '4,437', label: '评论' }
    ],
    metricEvidence: [
      { src: '/media/boards/viral-analytics.png', alt: '短视频平台作品数据详情截图', label: '作品数据详情' },
      { src: '/media/boards/viral-account.png', alt: '短视频平台个人主页与作品播放量截图', label: '个人主页与作品播放量' }
    ],
    metricsNote: '数据来自个人作品集 PPT 中的平台截图；截图页面标注数据更新至 2026.02.08。',
    credits: '成片、过程记录与平台数据截图均来自个人作品集 PPT。流程文字根据截图和原始备注整理。'
  },
  {
    id: 'three-minute', number: '02', title: '三分钟真人视频', english: 'SCI-FI / LIVE ACTION', category: 'story', filters: ['ai-video', 'storyboard'], categoryLabel: '叙事短片', year: '个人创作',
    cover: '/media/boards/poster-three-minute.png', ratio: 'wide',
    summary: '科幻题材的三分钟真人视频。PPT 收录了脚本构想、人物设定参考与分镜素材，可从文本规划一路查看到成片。',
    videos: [{ src: '/media/three-minute-film.mp4', poster: '/media/boards/poster-three-minute.png', label: '三分钟成片' }],
    boards: [
      { src: '/media/boards/scifi-storyboard-overview.png', alt: '科幻真人视频的镜头与角色规划画面', label: '画面规划' },
      { src: '/media/boards/scifi-character-sheet.png', alt: '科幻人物造型与连续性参考', label: '角色参考' },
      { src: '/media/boards/scifi-shotboard-01.png', alt: '科幻场景分镜画面一', label: '分镜 01' },
      { src: '/media/boards/scifi-shotboard-02.png', alt: '科幻场景分镜画面二', label: '分镜 02' }
    ],
    thinking: '围绕科幻战场题材组织三分钟真人视频。作品集包含角色设定图、场景参考和多组镜头规划，用于支撑长于单镜头的连续叙事。',
    workflow: ['脚本构想', '角色设定与场景参考', '分镜设计', '成片'], tools: [],
    credits: '视频、分镜和设定素材均取自作品集 PPT。具体生成模型与剪辑软件未注明。'
  },
  {
    id: 'motion-replacement', number: '03', title: '动作复刻与角色替换', english: 'MOTION / CHARACTER', category: 'character', filters: ['character', 'motion', 'storyboard'], categoryLabel: '角色与动作', year: '过程演示',
    cover: '/media/boards/replacement-shot-01.png', ratio: 'wide',
    summary: '以视频动作为基础，串联白模替换与参考人物替换方向。作品集提供了三段演示视频及角色、流程参考画面。',
    videos: [
      { src: '/media/motion-replace-01.mp4', poster: '/media/boards/replacement-shot-01.png', label: '演示片段 01' },
      { src: '/media/motion-replace-02.mp4', poster: '/media/boards/replacement-shot-02.png', label: '演示片段 02' },
      { src: '/media/motion-replace-03.mp4', poster: '/media/boards/replacement-shot-03.png', label: '演示片段 03' }
    ],
    boards: [
      { src: '/media/boards/replacement-character-reference.png', alt: '角色参考与白模替换参考素材', label: '角色参考' },
      { src: '/media/boards/replacement-process-board.png', alt: '视频动作、角色与画面素材的流程组织', label: '流程参考' },
      { src: '/media/boards/replacement-workflow-canvas.png', alt: '替换流程演示画布', label: '流程画布' }
    ],
    thinking: '作品集将方向归纳为「视频动作—白模替换—参考人物替换」，重点是保留原视频的动作与运镜，再引入目标角色参考。',
    workflow: ['视频动作参考', '白模替换方向', '参考人物替换', '具体流程待补充'], tools: [],
    credits: '演示视频与流程素材取自作品集 PPT。项目说明是对 PPT 标签与文字的整理，具体工具及各段片段对应关系待补充。'
  },
  {
    id: 'ice-battle', number: '04', title: '冰雪战场 · 战斗特效', english: 'ACTION SEQUENCE', category: 'action', filters: ['ai-video'], categoryLabel: '战斗镜头', year: '镜头测试',
    cover: '/media/boards/battle-frame-01.png', ratio: 'wide',
    summary: '围绕冰雪战场设计的角色战斗片段。创作说明强调力量感、技能释放与快速推进的影视化镜头节奏。',
    videos: [
      { src: '/media/ice-battle-01.mp4', poster: '/media/boards/battle-frame-01.png', label: '战斗片段 01' },
      { src: '/media/ice-battle-02.mp4', poster: '/media/boards/battle-frame-02.png', label: '战斗片段 02' }
    ],
    boards: [
      { src: '/media/boards/battle-brief.png', alt: '冰雪战场 20 秒 AI 视频的逐秒镜头与动作提示词', label: '20 秒战斗镜头提示词' },
      { src: '/media/boards/battle-frame-01.png', alt: '战斗镜头画面参考一', label: '画面参考 01' },
      { src: '/media/boards/battle-frame-02.png', alt: '战斗镜头画面参考二', label: '画面参考 02' }
    ],
    thinking: '以冰雪战场为环境设定，安排施法、特效碰撞与大幅度动作。镜头语言包含近景环绕、特写和快速拉近，强调动作冲击。',
    workflow: ['战斗设定', '动作节奏规划', '镜头与特效生成', '片段剪辑'], tools: [],
    credits: '创作设定来自作品集 PPT，画面与视频为嵌入素材。具体工具未注明。'
  },
  {
    id: 'ragnarok-pv', number: '05', title: 'Ragnarok: Yggdrasil', english: 'GAME PV', category: 'action', filters: ['gamepv'], categoryLabel: '游戏 PV', year: '参与制作',
    cover: '/media/boards/ragnarok-frame-01.png', ratio: 'wide',
    summary: '参与 Ragnarok: Yggdrasil 游戏 PV 的脚本、资产与视频制作。这里可观看完整 PV，也保留了个人作品集中的片段与画面记录。',
    contributions: ['脚本', '资产制作', '视频制作'],
    youtube: { id: '1E1Kpr1Nn9E', start: 19, url: 'https://www.youtube.com/watch?v=1E1Kpr1Nn9E&t=19s' },
    videos: [
      { src: '/media/ragnarok-pv-01.mp4', poster: '/media/boards/ragnarok-frame-01.png', label: 'PV 片段 01' },
      { src: '/media/ragnarok-pv-02.mp4', poster: '/media/boards/ragnarok-frame-02.png', label: 'PV 片段 02' },
      { src: '/media/ragnarok-pv-03.mp4', poster: '/media/boards/ragnarok-frame-03.png', label: 'PV 片段 03' },
      { src: '/media/ragnarok-pv-04.mp4', poster: '/media/boards/ragnarok-frame-04.png', label: 'PV 片段 04' },
      { src: '/media/ragnarok-pv-05.mp4', poster: '/media/boards/ragnarok-frame-05.png', label: 'PV 片段 05' }
    ],
    boards: [
      { src: '/media/boards/ragnarok-frame-01.png', alt: '游戏 PV 画面一', label: '片段 01' },
      { src: '/media/boards/ragnarok-frame-02.png', alt: '游戏 PV 画面二', label: '片段 02' },
      { src: '/media/boards/ragnarok-frame-03.png', alt: '游戏 PV 画面三', label: '片段 03' },
      { src: '/media/boards/ragnarok-frame-04.png', alt: '游戏 PV 画面四', label: '片段 04' },
      { src: '/media/boards/ragnarok-frame-05.png', alt: '游戏 PV 画面五', label: '片段 05' }
    ],
    thinking: '项目围绕 Ragnarok: Yggdrasil 游戏 PV 展开，参与内容涵盖脚本、资产与视频制作。PPT 中另收录了资产整理页面和多段 PV 画面。',
    workflow: ['脚本', '资产整理', '视频制作'], tools: [],
    assets: [
      { src: '/media/boards/ragnarok-character-assets.png', alt: 'Ragnarok PV 角色职业与服装设定资产整理图', label: '角色与职业设定' },
      { src: '/media/boards/ragnarok-forest-assets.png', alt: 'Ragnarok PV 森林、圣树与遗迹场景的资产探索图', label: '森林与圣树场景' },
      { src: '/media/boards/ragnarok-region-assets.png', alt: 'Ragnarok PV 火焰城、冰雪城与王国场景的资产探索图', label: '区域场景延展' }
    ],
    credits: '项目名称、资产页面与视频片段来自个人作品集 PPT；具体软件与各环节细分职责暂未注明。'
  }
];
