# 莫宇航 · AI 视频作品集

个人 AI 视频创作作品集。纯静态站点（HTML + 原生 JS + 媒体文件），无构建步骤。

- 线上地址：<https://shiguang11.dpdns.org>
- 托管：Vercel（推送到 `main` 自动部署）

## 目录

```
index.html        页面骨架
src/style.css     样式
src/main.js       交互、作品卡片渲染、详情弹窗、播放器
src/projects.js   所有作品文案与媒体路径（改内容主要动这里）
media/            视频（12 个）
media/boards/     封面、分镜、资产图（26 张）
vercel.json       媒体缓存头
```

## 更新内容

改完直接提交并推送到 `main`，Vercel 会在 20–40 秒内自动重新部署，无需手动操作。

只改文案时，直接在 GitHub 网页上编辑 `src/projects.js`：
右上角铅笔图标 → 修改 → **Commit changes** → 选择 *Commit directly to the `main` branch*。

替换视频或图片时，用 GitHub Desktop（网页上传单文件上限 25 MB，视频会失败）：
克隆仓库 → 覆盖文件 → 填提交信息 → **Commit to main** → **Push origin**。

命令行：

```bash
git add -A
git commit -m "update"
git push
```

## 注意

- 换视频时文件名如果改了，必须同步修改 `src/projects.js` 里对应的 `src` 路径。
- 不要添加 `.gitattributes` 或启用 Git LFS：本仓库的视频是直接存储的，LFS 会改变拉取方式并产生额外流量限制。
- GitHub 单文件硬上限 100 MB；`media/three-minute-film.mp4` 目前 66.8 MB，替换时注意体积。
- 所有媒体路径以 `/media/` 开头，对应仓库根目录的 `media/`，不要放回 `public/` 子目录。

## 本地预览

ES 模块无法通过 `file://` 直接打开，需要一个本地静态服务器：

```bash
npx serve .
```

然后访问它给出的地址。
