import { projects } from './projects.js';

const grid = document.querySelector('#project-grid');
const dialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');
const toast = document.querySelector('#toast');
const cursor = document.querySelector('.custom-cursor');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
let toastTimer;
let filterTimer;
let closeTimer;
let pointerFrame = 0;
let scrollFrame = 0;

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const projectMatches = (project, filter) => filter === 'all' || (project.filters || []).includes(filter);

function updateFilterCounts() {
  document.querySelectorAll('.filter-button').forEach((button) => {
    const count = projects.filter((project) => projectMatches(project, button.dataset.filter)).length;
    const countNode = button.querySelector('[data-filter-count]');
    if (countNode) countNode.textContent = String(count).padStart(2, '0');
  });
}

function renderProjects(filter = 'all') {
  const visible = projects.filter((project) => projectMatches(project, filter));
  grid.dataset.layout = filter === 'all' ? 'editorial' : 'filtered';
  grid.innerHTML = visible.map((project, index) => `
    <article class="project-item project-${escapeHtml(project.id)} ${index === 0 && filter === 'all' ? 'project-first' : ''}" data-reveal>
      <button class="project-open" type="button" data-project="${escapeHtml(project.id)}" aria-label="查看：${escapeHtml(project.title)}">
        <span class="project-image ratio-${escapeHtml(project.ratio)}">
          <img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.title)}画面" loading="lazy" />
          <video class="project-preview-video" muted loop playsinline preload="none" poster="${escapeHtml(project.cover)}" data-preview-src="${escapeHtml(project.videos[0]?.src || '')}" aria-hidden="true"></video>
          <span class="image-grain" aria-hidden="true"></span>
          <span class="project-number">${escapeHtml(project.number)}</span>
          <span class="project-hover-info" aria-hidden="true"><span class="hover-info-top">${escapeHtml(project.categoryLabel)} <i>·</i> ${escapeHtml(project.number)}</span><span class="hover-info-title">${escapeHtml(project.title)}</span><span class="hover-info-summary">${escapeHtml(project.summary)}</span><span class="hover-info-action">打开项目 ↗</span></span>
          <span class="project-play" aria-hidden="true">↗</span>
        </span>
        <span class="project-meta"><span>${escapeHtml(project.categoryLabel)}</span><span>${escapeHtml(project.year)}</span></span>
        <span class="project-title-row"><span class="project-title">${escapeHtml(project.title)}</span><span class="project-arrow" aria-hidden="true">↗</span></span>
        <span class="project-english">${escapeHtml(project.english)}</span>
        ${project.highlight ? `<span class="project-highlight">${escapeHtml(project.highlight)}</span>` : ''}
      </button>
    </article>`).join('');
  document.querySelector('#project-count').textContent = String(visible.length).padStart(2, '0');
  observeReveals(grid);
  attachCardInteractions();
}

function filterProjects(filter) {
  clearTimeout(filterTimer);
  if (reduceMotion.matches || !grid.children.length) {
    renderProjects(filter);
    return;
  }
  grid.setAttribute('aria-busy', 'true');
  [...grid.children].forEach((card, index) => {
    card.style.setProperty('--leave-delay', `${Math.min(index * 24, 96)}ms`);
    card.classList.add('project-leaving');
  });
  filterTimer = setTimeout(() => {
    renderProjects(filter);
    grid.removeAttribute('aria-busy');
    const cards = [...grid.children];
    cards.forEach((card, index) => {
      card.style.setProperty('--enter-delay', `${Math.min(index * 60, 240)}ms`);
      card.classList.add('project-arriving');
    });
    requestAnimationFrame(() => requestAnimationFrame(() => cards.forEach((card) => card.classList.remove('project-arriving'))));
  }, 210);
}

function attachCardInteractions() {
  grid.querySelectorAll('.project-open').forEach((button) => {
    const preview = button.querySelector('.project-preview-video');
    button.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch' || !finePointer.matches || reduceMotion.matches) return;
      cursor.classList.add('is-visible');
      if (!preview || preview.dataset.started === 'true') return;
      if (preview.dataset.limitSet !== 'true') {
        preview.addEventListener('timeupdate', () => { if (preview.currentTime >= 5) preview.pause(); });
        preview.dataset.limitSet = 'true';
      }
      preview.dataset.started = 'true';
      preview.src = preview.dataset.previewSrc;
      preview.play().catch(() => preview.classList.add('is-unavailable'));
    });
    button.addEventListener('pointerleave', () => {
      cursor.classList.remove('is-visible');
      stopCardPreview(preview);
    });
  });
}

function stopCardPreview(preview) {
  if (!preview || preview.dataset.started !== 'true') return;
  preview.pause();
  preview.removeAttribute('src');
  preview.load();
  preview.dataset.started = 'false';
}

function renderDialog(project) {
  const videos = project.videos.map((video, index) => `
    <div class="detail-video-wrap" data-reveal>
      <div class="detail-video-head"><span>${escapeHtml(video.label)}</span><div class="video-actions"><button type="button" class="mute-button" data-mute="${index}" aria-pressed="false">打开声音</button><button type="button" class="fullscreen-button" data-fullscreen="${index}">全屏观看 ↗</button></div></div>
      <video class="detail-video" controls muted playsinline preload="none" poster="${escapeHtml(video.poster || project.cover)}" data-src="${escapeHtml(video.src)}" aria-label="${escapeHtml(project.title)} · ${escapeHtml(video.label)}"></video>
    </div>`).join('');
  const boards = project.boards.length ? `
    <section class="detail-section detail-boards"><div class="detail-section-label">画面 / 过程素材</div>
      <div class="board-grid">${project.boards.map((board) => `
        <figure class="board-item" data-reveal><button type="button" class="board-open" data-image="${escapeHtml(board.src)}" data-alt="${escapeHtml(board.alt)}"><img loading="lazy" src="${escapeHtml(board.src)}" alt="${escapeHtml(board.alt)}" /><span>放大 ↗</span></button><figcaption>${escapeHtml(board.label)}</figcaption></figure>`).join('')}
      </div>
    </section>` : '';
  const assetSection = project.assets?.length ? `
    <section class="detail-section detail-assets" data-reveal><div class="detail-section-label">资产探索 / ASSET DEVELOPMENT</div>
      <div class="asset-grid">${project.assets.map((asset) => `
        <figure class="asset-item" data-reveal><button type="button" class="asset-open" data-image="${escapeHtml(asset.src)}" data-alt="${escapeHtml(asset.alt)}"><img loading="lazy" src="${escapeHtml(asset.src)}" alt="${escapeHtml(asset.alt)}" /><span>查看资产板 ↗</span></button><figcaption>${escapeHtml(asset.label)}</figcaption></figure>`).join('')}
      </div>
    </section>` : '';
  const processStory = project.processStages?.length ? `
    <section class="detail-section case-process" data-reveal>
      <div class="detail-section-label">创作路径 / PROCESS</div>
      <div class="case-process-grid">
        <figure class="process-proof"><button type="button" class="board-open" data-image="${escapeHtml(project.processVisual.src)}" data-alt="${escapeHtml(project.processVisual.alt)}"><img loading="lazy" src="${escapeHtml(project.processVisual.src)}" alt="${escapeHtml(project.processVisual.alt)}" /><span>查看过程截图 ↗</span></button><figcaption>${escapeHtml(project.processVisual.label)}</figcaption></figure>
        <ol class="process-timeline">${project.processStages.map((stage, index) => `<li><span class="timeline-index">0${index + 1}</span><div><h3>${escapeHtml(stage.title)}</h3><p>${escapeHtml(stage.detail)}</p></div></li>`).join('')}</ol>
      </div>
    </section>` : '';
  const metricStory = project.metrics?.length ? `
    <section class="detail-section case-metrics" data-reveal>
      <div class="detail-section-label">作品数据 / PLATFORM RECORD</div>
      <div class="metrics-story-grid">
        <div class="metrics-copy"><p class="metrics-lead">作品发布后的<br /><em>真实反馈</em></p><div class="metrics-list">${project.metrics.map((metric) => `<div class="metric-item"><strong>${escapeHtml(metric.value)}</strong><span>${escapeHtml(metric.label)}</span></div>`).join('')}</div><p class="metrics-note">${escapeHtml(project.metricsNote)}</p></div>
        <div class="metric-evidence">${project.metricEvidence.map((evidence) => `<figure class="evidence-item"><button type="button" class="board-open" data-image="${escapeHtml(evidence.src)}" data-alt="${escapeHtml(evidence.alt)}"><img loading="lazy" src="${escapeHtml(evidence.src)}" alt="${escapeHtml(evidence.alt)}" /><span>放大核验 ↗</span></button><figcaption>${escapeHtml(evidence.label)}</figcaption></figure>`).join('')}</div>
      </div>
    </section>` : '';
  const fullVideo = project.youtube ? `
    <section class="detail-section full-pv-section" data-reveal>
      <div class="detail-section-label">完整 PV / FULL FILM</div>
      <div class="external-video-frame"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(project.youtube.id)}?start=${Number(project.youtube.start) || 0}&rel=0&autoplay=1&mute=1&playsinline=1" title="${escapeHtml(project.title)} 完整游戏 PV" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
      <a class="external-video-link" href="${escapeHtml(project.youtube.url)}" target="_blank" rel="noopener noreferrer">在 YouTube 打开原视频 <span>↗</span></a>
    </section>` : '';
  const contributionSection = project.contributions?.length ? `
    <section class="detail-section contribution-section" data-reveal><div class="detail-section-label">我的参与 / CONTRIBUTION</div><div class="contribution-list">${project.contributions.map((item, index) => `<div><span>0${index + 1}</span><strong>${escapeHtml(item)}</strong></div>`).join('')}</div></section>` : '';
  const steps = project.workflow.map((step, i) => `<li><span>0${i + 1}</span>${escapeHtml(step)}</li>`).join('');
  const tools = project.tools.length ? project.tools.map((tool) => `<span class="tool-tag">${escapeHtml(tool)}</span>`).join('') : '<span class="tool-missing">作品集未注明，待补充</span>';
  const genericProcess = project.processStages?.length ? '' : `<section class="detail-section detail-process" data-reveal><div class="detail-section-label">创作思路与流程</div><div><p class="thinking-copy">${escapeHtml(project.thinking)}</p><ol class="workflow-list">${steps}</ol></div></section>`;
  dialogContent.innerHTML = `
    <div class="detail-cover"><img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.title)}封面" /><div class="detail-cover-shade"></div><div class="detail-cover-copy"><p>${escapeHtml(project.number)} / ${escapeHtml(project.categoryLabel)} / ${escapeHtml(project.year)}</p><h2 id="dialog-title">${escapeHtml(project.title)}</h2><span>${escapeHtml(project.english)}</span></div></div>
    <div class="detail-body">
      <div class="detail-lede" data-reveal><p>${escapeHtml(project.summary)}</p><p class="source-note">${escapeHtml(project.credits)}</p></div>
      ${contributionSection}
      ${processStory}
      ${genericProcess}
      <section class="detail-section tool-section" data-reveal><div class="detail-section-label">AI 工具</div><div class="tool-list">${tools}</div></section>
      ${assetSection}
      ${boards}
      ${fullVideo}
      <section class="detail-section"><div class="detail-section-label">${project.youtube ? '作品集片段 / SELECTED CLIPS' : '成片 / VIDEO'}</div><div class="detail-videos">${videos}</div></section>
      ${metricStory}
    </div>`;
  dialog.classList.remove('is-closing');
  dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.scrollTop = 0;
  observeReveals(dialogContent);
  const detailVideos = [...dialogContent.querySelectorAll('video[data-src]')];
  detailVideos.forEach((video) => {
    video.src = video.dataset.src;
    video.addEventListener('error', () => showToast('视频无法读取，请检查文件路径或编码格式。'), { once: true });
  });
  // Start the featured local film silently. For projects with an embedded full PV,
  // the YouTube film is the sole autoplay target to avoid simultaneous playback.
  if (!reduceMotion.matches && !project.youtube && detailVideos[0]) {
    detailVideos[0].play().catch(() => {});
  }
  dialogContent.querySelectorAll('[data-mute]').forEach((button) => button.addEventListener('click', () => {
    const video = dialogContent.querySelectorAll('.detail-video')[Number(button.dataset.mute)];
    video.muted = !video.muted;
    button.setAttribute('aria-pressed', String(!video.muted));
    button.textContent = video.muted ? '打开声音' : '关闭声音';
  }));
  dialogContent.querySelectorAll('[data-fullscreen]').forEach((button) => button.addEventListener('click', () => {
    const video = dialogContent.querySelectorAll('.detail-video')[Number(button.dataset.fullscreen)];
    if (!video) return;
    if (document.fullscreenElement === video && document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        button.textContent = '全屏观看 ↗';
        button.setAttribute('aria-pressed', 'false');
      }).catch(() => showToast('当前浏览器无法退出全屏播放。'));
      return;
    }
    if (video.closest('.detail-video-wrap').classList.contains('is-cinema')) {
      exitCinema();
      return;
    }
    if (video.requestFullscreen && document.fullscreenEnabled) {
      video.requestFullscreen().then(() => {
        if (document.fullscreenElement === video) {
          button.textContent = '退出全屏';
          button.setAttribute('aria-pressed', 'true');
        } else {
          toggleCinema(video, button);
        }
      }).catch(() => toggleCinema(video, button));
    } else {
      toggleCinema(video, button);
    }
  }));
  dialogContent.querySelectorAll('.board-open, .asset-open').forEach((button) => button.addEventListener('click', () => openImage(button.dataset.image, button.dataset.alt)));
}

function toggleCinema(video, button) {
  const wrapper = video.closest('.detail-video-wrap');
  const expanded = wrapper.classList.toggle('is-cinema');
  button.textContent = expanded ? '退出全屏' : '全屏观看 ↗';
  button.setAttribute('aria-pressed', String(expanded));
  if (expanded) button.focus();
}

function exitCinema() {
  const wrapper = dialogContent.querySelector('.detail-video-wrap.is-cinema');
  if (!wrapper) return false;
  wrapper.classList.remove('is-cinema');
  const button = wrapper.querySelector('.fullscreen-button');
  button.textContent = '全屏观看 ↗';
  button.setAttribute('aria-pressed', 'false');
  button.focus();
  return true;
}

function closeProjectDialog() {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  dialog.classList.add('is-closing');
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => { if (dialog.open) dialog.close(); }, reduceMotion.matches ? 0 : 260);
}

function openImage(src, alt) {
  const preview = document.createElement('dialog');
  preview.className = 'image-preview';
  preview.innerHTML = `<button type="button" class="preview-close" aria-label="关闭预览">×</button><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" />`;
  document.body.append(preview);
  preview.showModal();
  preview.querySelector('button').addEventListener('click', () => preview.close());
  preview.addEventListener('click', (event) => { if (event.target === preview) preview.close(); });
  preview.addEventListener('close', () => preview.remove(), { once: true });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.filter-button').forEach((item) => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  filterProjects(button.dataset.filter);
}));

const toolDetails = {
  gpt: { index: '01 / CREATIVE ASSISTANT', title: 'ChatGPT', description: 'PPT 工具清单列出 ChatGPT；具体对应到哪支视频、参与哪个环节，现有材料没有注明。', status: '工具清单有记录 · 项目关联待补充' },
  libtv: { index: '02 / PROCESS CANVAS', title: 'libtv', description: '角色替换流程页中出现 libtv 画布，可查看动作复刻与角色替换项目中的流程素材。', status: 'PPT 流程页有记录', project: 'motion-replacement', projectLabel: '查看角色替换项目' },
  jimeng: { index: '03 / VIDEO END FRAME', title: '即梦', description: '爆款视频的创作备注提到，使用即梦收尾帧收住结尾画面。', status: 'PPT 创作备注', project: 'viral-video', projectLabel: '查看爆款视频与数据' },
  claude: { index: '04 / AI ASSISTANT', title: 'Claude', description: '可作为创作工具展示；目前作品集没有注明对应项目或具体用途。', status: '关联项目与使用环节待补充' },
  photoshop: { index: '05 / IMAGE WORK', title: 'Photoshop', description: 'PPT 技能清单列有 Photoshop；暂未标注它具体参与了哪支视频的画面处理。', status: '工具清单有记录 · 项目关联待补充' }
};
const toolShelf = document.querySelector('.tool-shelf');
const toolButtons = [...document.querySelectorAll('.tool-selector')];
const toolPanel = document.querySelector('.tool-inspector');
const relatedToolButton = document.querySelector('#tool-related');
let pinnedTool = 'jimeng';
function showToolDetail(id) {
  const item = toolDetails[id];
  if (!item) return;
  toolButtons.forEach((button) => {
    const active = button.dataset.tool === id;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#tool-inspector-index').textContent = item.index;
  document.querySelector('#tool-inspector-title').textContent = item.title;
  document.querySelector('#tool-inspector-description').textContent = item.description;
  document.querySelector('#tool-inspector-status').textContent = item.status;
  if (item.project) {
    relatedToolButton.dataset.project = item.project;
    relatedToolButton.innerHTML = `${escapeHtml(item.projectLabel)} <span>↗</span>`;
    relatedToolButton.classList.add('is-visible');
  } else {
    relatedToolButton.classList.remove('is-visible');
  }
  toolPanel.classList.remove('is-changing');
  void toolPanel.offsetWidth;
  toolPanel.classList.add('is-changing');
}
toolButtons.forEach((button) => {
  button.addEventListener('pointerenter', () => showToolDetail(button.dataset.tool));
  button.addEventListener('focus', () => showToolDetail(button.dataset.tool));
  button.addEventListener('click', () => {
    pinnedTool = button.dataset.tool;
    showToolDetail(pinnedTool);
  });
});
toolShelf.addEventListener('pointerleave', () => showToolDetail(pinnedTool));
toolShelf.addEventListener('focusout', (event) => {
  if (!toolShelf.contains(event.relatedTarget)) showToolDetail(pinnedTool);
});

grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-project]');
  if (!button) return;
  const project = projects.find((item) => item.id === button.dataset.project);
  if (project) renderDialog(project);
});
relatedToolButton.addEventListener('click', () => {
  const project = projects.find((item) => item.id === relatedToolButton.dataset.project);
  if (project) renderDialog(project);
});

dialog.querySelector('.dialog-close').addEventListener('click', closeProjectDialog);
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeProjectDialog(); });
dialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  if (!exitCinema()) closeProjectDialog();
});
document.addEventListener('fullscreenchange', () => {
  dialogContent.querySelectorAll('.fullscreen-button').forEach((button) => {
    const video = dialogContent.querySelectorAll('.detail-video')[Number(button.dataset.fullscreen)];
    const active = Boolean(video && document.fullscreenElement === video);
    button.textContent = active ? '退出全屏' : '全屏观看 ↗';
    button.setAttribute('aria-pressed', String(active));
  });
});
dialog.addEventListener('close', () => {
  clearTimeout(closeTimer);
  dialog.classList.remove('is-closing');
  dialogContent.querySelectorAll('video').forEach((video) => { video.pause(); video.removeAttribute('src'); video.load(); });
  dialogContent.querySelectorAll('iframe').forEach((frame) => { frame.src = 'about:blank'; });
  dialogContent.querySelectorAll('.detail-video-wrap.is-cinema').forEach((wrapper) => wrapper.classList.remove('is-cinema'));
  dialogContent.innerHTML = '';
  document.body.classList.remove('dialog-open');
});

const heroVideo = document.querySelector('.hero-video');
const soundToggle = document.querySelector('.sound-toggle');
function syncMotionPreference() {
  if (reduceMotion.matches) {
    heroVideo.pause();
    heroVideo.removeAttribute('autoplay');
    soundToggle.textContent = '播放主视觉';
    soundToggle.setAttribute('aria-label', '播放主视觉视频');
  } else {
    heroVideo.setAttribute('autoplay', '');
    heroVideo.play().catch(() => {});
    soundToggle.innerHTML = '<span class="sound-icon">Ⅱ</span> 声音关闭';
    soundToggle.setAttribute('aria-label', '开启或关闭主视觉声音');
  }
}
syncMotionPreference();
reduceMotion.addEventListener?.('change', syncMotionPreference);
soundToggle.addEventListener('click', (event) => {
  if (reduceMotion.matches) {
    if (heroVideo.paused) {
      heroVideo.play().then(() => { event.currentTarget.textContent = '暂停主视觉'; }).catch(() => showToast('浏览器暂时无法播放主视觉视频。'));
    } else {
      heroVideo.pause();
      event.currentTarget.textContent = '播放主视觉';
    }
    return;
  }
  heroVideo.muted = !heroVideo.muted;
  const isMuted = heroVideo.muted;
  event.currentTarget.setAttribute('aria-pressed', String(!isMuted));
  event.currentTarget.innerHTML = `<span class="sound-icon">${isMuted ? 'Ⅱ' : '♪'}</span> 声音${isMuted ? '关闭' : '开启'}`;
  if (!isMuted) heroVideo.play().catch(() => showToast('浏览器已阻止播放声音，请再次点击播放区域。'));
});

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  menuToggle.textContent = open ? '关闭' : '菜单';
  mainNav.classList.toggle('is-open', open);
});
mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '打开导航');
  menuToggle.textContent = '菜单';
  mainNav.classList.remove('is-open');
}));

document.querySelectorAll('.intro-main, .section-heading, .statement-line, .statement-foot, .footer-top, .email-link, .footer-meta').forEach((element) => element.setAttribute('data-reveal', ''));
let revealObserver;
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -4% 0px' });
}
function observeReveals(scope = document) {
  const elements = scope.querySelectorAll('[data-reveal]');
  elements.forEach((element, index) => {
    if (reduceMotion.matches || !revealObserver) element.classList.add('is-visible');
    else {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 50, 240)}ms`);
      revealObserver.observe(element);
    }
  });
}

const chapterNames = { '01': 'CREATIVE FOCUS', '02': 'SELECTED FILMS', '03': 'IN THE FRAME', '04': 'CONTACT' };
const chapterCurrent = document.querySelector('.chapter-current');
const chapterLabel = document.querySelector('.chapter-label');
if ('IntersectionObserver' in window) {
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const chapter = entry.target.dataset.chapter;
      chapterCurrent.textContent = chapter;
      chapterLabel.textContent = chapterNames[chapter] || '';
      document.querySelectorAll('[data-section-link]').forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { threshold: 0, rootMargin: '-34% 0px -56% 0px' });
  document.querySelectorAll('[data-chapter]').forEach((section) => chapterObserver.observe(section));
}

function updateScrollEffects() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(100, Math.max(0, window.scrollY / maxScroll * 100));
  document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
  document.querySelector('.site-header').classList.toggle('has-scrolled', window.scrollY > 24);
  if (finePointer.matches && !reduceMotion.matches) {
    document.querySelectorAll('.project-image').forEach((frame) => {
      const rect = frame.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = Math.max(-8, Math.min(8, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight * 11));
      frame.style.setProperty('--parallax-y', `${offset}px`);
    });
  }
  scrollFrame = 0;
}
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(updateScrollEffects);
}, { passive: true });
window.addEventListener('resize', updateScrollEffects, { passive: true });
document.addEventListener('pointermove', (event) => {
  if (!cursor.classList.contains('is-visible')) return;
  if (pointerFrame) cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => {
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    pointerFrame = 0;
  });
}, { passive: true });
window.addEventListener('blur', () => {
  cursor.classList.remove('is-visible');
  grid.querySelectorAll('.project-preview-video').forEach(stopCardPreview);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    heroVideo.pause();
    grid.querySelectorAll('.project-preview-video').forEach(stopCardPreview);
  } else if (!reduceMotion.matches) {
    heroVideo.play().catch(() => {});
  }
});

updateFilterCounts();
renderProjects();
observeReveals();
updateScrollEffects();
