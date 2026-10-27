/* =========================================================================
   CSIS3280 Week 06 · PHP 面向对象代码填空 —— 交互逻辑
   ========================================================================= */

(function () {
  'use strict';

  var DATA = window.EXERCISE_DATA;
  var STORE_KEY = 'csis3280.week06.practice.v1';
  var CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

  var ICON = {
    check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    cross: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-3.5 10.9c.4.3.6.7.6 1.2v.9h5.8v-.9c0-.5.2-.9.6-1.2A6 6 0 0012 3z"/></svg>',
    file: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/></svg>',
    code: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
  };

  /* ------------------------------ 数据扁平化 ------------------------------ */

  var flat = [];
  DATA.chapters.forEach(function (chapter) {
    chapter.questions.forEach(function (q) {
      flat.push(Object.assign({}, q, { chapter: chapter, index: flat.length }));
    });
  });

  var els = {
    sidebar: document.getElementById('sidebar'),
    workspace: document.getElementById('workspace'),
    progressFill: document.getElementById('progressFill'),
    progressLabel: document.getElementById('progressLabel'),
    resetAllBtn: document.getElementById('resetAllBtn'),
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modalTitle'),
    modalSub: document.getElementById('modalSub'),
    modalTabs: document.getElementById('modalTabs'),
    modalBody: document.getElementById('modalBody')
  };

  /* ------------------------------ 状态 ------------------------------ */

  var state = loadState();
  var current = clamp(Number(state.current) || 0, 0, flat.length - 1);
  var revealed = {}; // 本次会话中点击过「校对答案」的题目
  var saveTimer = null;

  function loadState() {
    var base = { current: 0, drafts: {}, done: {} };
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return base;
      var parsed = JSON.parse(raw);
      return {
        current: parsed.current || 0,
        drafts: parsed.drafts || {},
        done: parsed.done || {}
      };
    } catch (e) {
      return base;
    }
  }

  function persist() {
    state.current = current;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) { /* 隐私模式下忽略 */ }
  }

  function persistSoon() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 260);
  }

  function getDraft(qid, bid) {
    var d = state.drafts[qid];
    return d && typeof d[bid] === 'string' ? d[bid] : '';
  }

  function setDraft(qid, bid, value) {
    if (!state.drafts[qid]) state.drafts[qid] = {};
    state.drafts[qid][bid] = value;
  }

  /* ------------------------------ 工具函数 ------------------------------ */

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  var TOKEN_RE = new RegExp(
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)' + // 1 注释
    '|(\'(?:\\\\.|[^\'\\\\])*\'|"(?:\\\\.|[^"\\\\])*")' + // 2 字符串
    '|(\\$[A-Za-z_]\\w*)' + // 3 变量
    '|(\\b\\d+(?:\\.\\d+)?\\b)' + // 4 数字
    '|(\\b(?:abstract|class|extends|implements|interface|function|public|private|protected|static|const|return|new|if|else|elseif|foreach|for|while|switch|case|break|continue|print|echo|require_once|require|include_once|include|use|namespace|instanceof|as|parent|self|void|int|float|string|bool|array|null|true|false|var_dump)\\b)' + // 5 关键字
    '|(->|::|=>)' // 6 操作符
    , 'g');

  function highlight(line) {
    if (!line) return '';
    var out = '';
    var last = 0;
    var m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(line)) !== null) {
      if (m.index > last) out += escapeHtml(line.slice(last, m.index));
      if (m[1]) out += '<span class="tk-c">' + escapeHtml(m[1]) + '</span>';
      else if (m[2]) out += '<span class="tk-s">' + escapeHtml(m[2]) + '</span>';
      else if (m[3]) out += '<span class="tk-v">' + escapeHtml(m[3]) + '</span>';
      else if (m[4]) out += '<span class="tk-n">' + escapeHtml(m[4]) + '</span>';
      else if (m[5]) out += '<span class="tk-k">' + escapeHtml(m[5]) + '</span>';
      else if (m[6]) out += '<span class="tk-o">' + escapeHtml(m[6]) + '</span>';
      last = TOKEN_RE.lastIndex;
      if (m[0] === '') TOKEN_RE.lastIndex++;
    }
    out += escapeHtml(line.slice(last));
    return out;
  }

  /* 归一化：忽略缩进、多余空格、换行差异 */
  function norm(src) {
    return String(src)
      .replace(/\r\n?/g, '\n')
      .split('\n')
      .map(function (l) { return l.replace(/[ \t]+/g, ' ').trim(); })
      .filter(function (l) { return l.length > 0; })
      .join('\n')
      .replace(/\s*->\s*/g, '->')
      .replace(/\s*::\s*/g, '::');
  }

  function runChecks(blank, value) {
    var text = norm(value);
    var failed = [];
    (blank.checks || []).forEach(function (c) {
      var flags = c.re.flags.indexOf('g') === -1 ? c.re.flags + 'g' : c.re.flags;
      var re = new RegExp(c.re.source, flags);
      var count = (text.match(re) || []).length;
      var pass = c.min ? count >= c.min : count > 0;
      if (!pass) failed.push(c.tip);
    });
    return failed;
  }

  /* ------------------------------ 侧边栏 ------------------------------ */

  function renderSidebar() {
    var html = DATA.chapters.map(function (chapter, ci) {
      var items = chapter.questions.map(function (q) {
        var item = flat.filter(function (f) { return f.id === q.id; })[0];
        var active = item.index === current;
        var done = !!state.done[q.id];
        return '' +
          '<button type="button" class="q-item' + (active ? ' is-active' : '') + (done ? ' is-done' : '') + '" data-go="' + item.index + '">' +
          '<span class="q-num">' + (item.index + 1) + '</span>' +
          '<span class="q-item-body">' +
          '<span class="q-item-title">' + escapeHtml(q.title) + '</span>' +
          '<span class="q-item-file">' + escapeHtml(q.file) + '</span>' +
          '</span>' +
          '</button>';
      }).join('');

      return '<div class="chapter">' +
        '<div class="chapter-head"><span class="chapter-title">' + escapeHtml(chapter.title) + '</span>' +
        '<span class="chapter-sub">' + escapeHtml(chapter.subtitle || '') + '</span></div>' +
        items +
        '</div>';
    }).join('');

    els.sidebar.innerHTML = html;
  }

  function updateProgress() {
    var done = flat.filter(function (q) { return !!state.done[q.id]; }).length;
    var pct = flat.length ? (done / flat.length) * 100 : 0;
    els.progressFill.style.width = pct + '%';
    els.progressLabel.textContent = done + ' / ' + flat.length + ' 题完成';
  }

  /* ------------------------------ 渲染题目 ------------------------------ */

  function codeRows(q) {
    var out = '';
    q.skeleton.split('\n').forEach(function (line) {
      var block = line.match(/^@@(\w+)@@\s*$/);
      if (block) {
        out += blockRow(q, block[1]);
        return;
      }
      if (line.indexOf('@@') !== -1) {
        out += inlineRow(q, line);
        return;
      }
      out += '<div class="code-row"><span class="ln"></span><span class="cl">' + highlight(line) + '</span></div>';
    });
    return out;
  }

  function blockRow(q, id) {
    var bi = -1;
    var b = null;
    q.blanks.forEach(function (item, i) {
      if (item.id === id) { b = item; bi = i; }
    });
    if (!b) return '';

    var value = escapeHtml(getDraft(q.id, id));
    var rows = b.rows || Math.max(2, String(b.solution || '').split('\n').length);

    return '<div class="code-row blank-row">' +
      '<span class="ln"></span>' +
      '<div class="blank-cell">' +
      '<div class="blank-box" data-blank="' + id + '">' +
      '<div class="blank-label"><span class="badge">' + CIRCLED[bi] + '</span>' + escapeHtml(b.label) + '</div>' +
      '<textarea data-blank-input="' + id + '" rows="' + rows + '" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="' + escapeHtml(b.placeholder || '') + '">' + value + '</textarea>' +
      '<div class="blank-msg" hidden></div>' +
      '</div></div></div>';
  }

  function inlineRow(q, line) {
    var parts = line.split(/@@(\w+)@@/);
    var html = '';
    for (var i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        html += highlight(parts[i]);
      } else {
        var bid = parts[i];
        var b = null;
        q.blanks.forEach(function (item) { if (item.id === bid) b = item; });
        if (!b) { html += escapeHtml(bid); continue; }
        html += '<input class="blank-inline" type="text" data-blank="' + bid + '" data-blank-input="' + bid + '"' +
          ' size="' + (b.size || 10) + '" spellcheck="false" autocomplete="off"' +
          ' placeholder="' + escapeHtml(b.placeholder || '') + '"' +
          ' value="' + escapeHtml(getDraft(q.id, bid)) + '">';
      }
    }
    return '<div class="code-row"><span class="ln"></span><span class="cl">' + html + '</span></div>';
  }

  function renderQuestion() {
    var q = flat[current];
    var canReveal = !!revealed[q.id];

    els.workspace.innerHTML = '' +
      '<div class="q-head">' +
        '<div class="q-eyebrow">' +
          '<span class="q-no">第 ' + (q.index + 1) + ' / ' + flat.length + ' 题</span>' +
          '<span class="q-chapter">' + escapeHtml(q.chapter.title) + ' · ' + escapeHtml(q.chapter.subtitle || '') + '</span>' +
        '</div>' +
        '<h2>' + escapeHtml(q.title) + '</h2>' +
        '<div class="q-meta">' +
          '<span class="file-chip">' + ICON.file + escapeHtml(q.file) + '</span>' +
          (q.tags || []).map(function (t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('') +
        '</div>' +
      '</div>' +
      '<p class="q-desc">' + q.desc + '</p>' +
      '<div class="toolbar">' +
        '<button class="btn btn-primary" type="button" id="checkBtn">' + ICON.check + '校对答案</button>' +
        '<button class="btn btn-ghost" type="button" id="revealBtn"' + (canReveal ? '' : ' disabled title="先校对一次答案，再看参考答案"') + '>' + ICON.code + '参考答案</button>' +
        '<button class="btn btn-ghost" type="button" id="clearBtn">清空本题</button>' +
        '<span class="toolbar-hint"><kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd> 校对</span>' +
      '</div>' +
      '<div class="code-panel">' +
        '<div class="code-head">' +
          '<span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>' +
          '<span class="code-path">' + escapeHtml(q.file) + '</span>' +
          '<span class="code-lang">PHP</span>' +
        '</div>' +
        '<div class="code-body">' + codeRows(q) + '</div>' +
      '</div>' +
      '<div class="result-panel" id="resultPanel"></div>' +
      '<div class="hint-card">' +
        '<div class="hint-head">' +
          '<span class="hint-title">' + ICON.bulb + '提示</span>' +
          '<button class="btn btn-mini" type="button" id="viewCodeBtn">' + ICON.code + '查看原代码</button>' +
        '</div>' +
        '<ul class="hint-list">' + (q.hint || []).map(function (h) { return '<li>' + h + '</li>'; }).join('') + '</ul>' +
      '</div>' +
      '<div class="q-nav">' +
        '<button class="btn btn-ghost btn-sm" type="button" id="prevBtn"' + (current === 0 ? ' disabled' : '') + '>' + ICON.arrowLeft + '上一题</button>' +
        '<span class="nav-count">' + (current + 1) + ' / ' + flat.length + '</span>' +
        '<button class="btn btn-ghost btn-sm" type="button" id="nextBtn"' + (current === flat.length - 1 ? ' disabled' : '') + '>' + '下一题' + ICON.arrowRight + '</button>' +
        '<span class="spacer"></span>' +
        '<span class="nav-count">进度已自动保存</span>' +
      '</div>';

    bindEvents(q);
    els.workspace.querySelectorAll('textarea').forEach(grow);
    renumber();
  }

  function bindEvents(q) {
    var inputs = els.workspace.querySelectorAll('[data-blank-input]');

    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        setDraft(q.id, input.getAttribute('data-blank-input'), input.value);
        persistSoon();
        clearMark(input);
        grow(input);
        renumber();
        var panel = document.getElementById('resultPanel');
        if (panel) panel.innerHTML = '';
        if (state.done[q.id]) {
          delete state.done[q.id];
          persistSoon();
          renderSidebar();
          updateProgress();
        }
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Tab' && input.tagName === 'TEXTAREA') {
          e.preventDefault();
          var start = input.selectionStart;
          var end = input.selectionEnd;
          input.setRangeText('    ', start, end, 'end');
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });

    document.getElementById('checkBtn').addEventListener('click', check);
    document.getElementById('clearBtn').addEventListener('click', clearQuestion);
    document.getElementById('revealBtn').addEventListener('click', reveal);
    document.getElementById('viewCodeBtn').addEventListener('click', function () { openModal(q, 0); });
    document.getElementById('prevBtn').addEventListener('click', function () { go(current - 1); });
    document.getElementById('nextBtn').addEventListener('click', function () { go(current + 1); });
  }

  function grow(el) {
    if (el.tagName !== 'TEXTAREA') return;
    el.style.height = 'auto';
    el.style.height = Math.max(el.scrollHeight, 24) + 'px';
  }

  /* 行号：多行输入框按其内容行数推进 */
  function renumber() {
    var body = els.workspace.querySelector('.code-body');
    if (!body) return;
    var n = 1;
    Array.prototype.forEach.call(body.children, function (row) {
      var ln = row.querySelector('.ln');
      if (ln) ln.textContent = String(n);
      var ta = row.querySelector('textarea');
      n += ta ? Math.max(1, ta.value.split('\n').length) : 1;
    });
  }

  function clearMark(input) {
    var target = input.classList.contains('blank-inline')
      ? input
      : input.closest('.blank-box');
    if (!target) return;
    target.classList.remove('is-ok', 'is-bad');
    var msg = target.querySelector ? target.querySelector('.blank-msg') : null;
    if (msg) { msg.hidden = true; msg.innerHTML = ''; }
  }

  /* ------------------------------ 判分 ------------------------------ */

  function check() {
    var q = flat[current];
    var results = q.blanks.map(function (b, i) {
      var raw = getDraft(q.id, b.id);
      var empty = raw.trim() === '';
      var failed = empty ? [] : runChecks(b, raw);
      return { b: b, i: i, raw: raw, empty: empty, failed: failed, ok: !empty && failed.length === 0 };
    });

    results.forEach(function (r) {
      var holder = els.workspace.querySelector('[data-blank="' + r.b.id + '"]');
      if (!holder) return;
      holder.classList.remove('is-ok', 'is-bad');
      holder.classList.add(r.ok ? 'is-ok' : 'is-bad');

      var msg = holder.querySelector ? holder.querySelector('.blank-msg') : null;
      if (msg) {
        if (r.ok) {
          msg.hidden = false;
          msg.innerHTML = '<span class="ok-text">填写正确</span>';
        } else if (r.empty) {
          msg.hidden = false;
          msg.innerHTML = '还没有填写这一处';
        } else {
          msg.hidden = false;
          msg.innerHTML = '还差：' + r.failed.join('；');
        }
      } else {
        holder.title = r.ok ? '正确' : (r.empty ? '还没有填写' : r.failed.map(stripTags).join(' / '));
      }
    });

    var allOk = results.every(function (r) { return r.ok; });
    var passed = results.filter(function (r) { return r.ok; }).length;

    if (allOk) {
      state.done[q.id] = true;
    } else {
      delete state.done[q.id];
    }
    revealed[q.id] = true;
    persist();
    renderSidebar();
    updateProgress();

    var revealBtn = document.getElementById('revealBtn');
    if (revealBtn) { revealBtn.disabled = false; revealBtn.removeAttribute('title'); }

    renderResult(results, allOk, passed);
  }

  function stripTags(html) {
    var d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent || '';
  }

  function renderResult(results, allOk, passed) {
    var panel = document.getElementById('resultPanel');
    if (!panel) return;
    var total = results.length;

    var head = allOk
      ? '<div class="result-head">' + ICON.check + '全部正确，本题完成' +
        '<span class="score">' + passed + ' / ' + total + '</span></div>'
      : '<div class="result-head">' + ICON.cross + '还有 ' + (total - passed) + ' 处需要修改' +
        '<span class="score">' + passed + ' / ' + total + '</span></div>';

    var list = results.map(function (r) {
      var detail = r.ok
        ? '正确'
        : (r.empty ? '还没有填写' : r.failed.join('；'));
      return '<li class="' + (r.ok ? 'ok' : 'bad') + '">' +
        '<span class="mark">' + (r.ok ? '✓' : '✕') + '</span>' +
        '<span><b>' + CIRCLED[r.i] + ' ' + escapeHtml(r.b.label) + '</b> — ' + detail + '</span>' +
        '</li>';
    }).join('');

    panel.innerHTML = '<div class="result-card ' + (allOk ? 'ok' : 'bad') + '">' +
      head + '<ul class="result-list">' + list + '</ul></div>';
  }

  /* ------------------------------ 动作 ------------------------------ */

  function reveal() {
    var q = flat[current];
    if (!revealed[q.id]) return;
    if (!window.confirm('将把参考答案填入本题的空白处，确定继续吗？')) return;
    q.blanks.forEach(function (b) { setDraft(q.id, b.id, b.solution); });
    delete state.done[q.id];
    persist();
    renderSidebar();
    updateProgress();
    renderQuestion();
  }

  function clearQuestion() {
    var q = flat[current];
    q.blanks.forEach(function (b) { setDraft(q.id, b.id, ''); });
    delete state.done[q.id];
    persist();
    renderSidebar();
    updateProgress();
    renderQuestion();
  }

  function go(index) {
    var next = clamp(index, 0, flat.length - 1);
    if (next === current) return;
    current = next;
    persist();
    renderSidebar();
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ------------------------------ 原代码弹窗 ------------------------------ */

  var lastFocus = null;

  function openModal(q, tabIndex) {
    var files = q.originalFiles || [];
    if (!files.length) return;

    lastFocus = document.activeElement;
    els.modal.hidden = false;
    document.body.style.overflow = 'hidden';
    els.modalTitle.textContent = '原始代码 · ' + q.file;
    els.modalSub.textContent = '来自 ' + DATA.meta.starter + ' 的未完成版本（不含答案），可对照它确认自己的代码写在哪里';

    if (files.length > 1) {
      els.modalTabs.innerHTML = files.map(function (f, i) {
        return '<button class="tab' + (i === tabIndex ? ' is-active' : '') + '" type="button" data-tab="' + i + '">' +
          escapeHtml(f.path) + '</button>';
      }).join('');
      els.modalTabs.hidden = false;
      els.modalTabs.querySelectorAll('.tab').forEach(function (btn) {
        btn.addEventListener('click', function () {
          showFile(files, Number(btn.getAttribute('data-tab')));
        });
      });
    } else {
      els.modalTabs.innerHTML = '';
      els.modalTabs.hidden = true;
    }

    showFile(files, tabIndex);
    var closeBtn = els.modal.querySelector('.icon-btn');
    if (closeBtn) closeBtn.focus();
  }

  function showFile(files, index) {
    var f = files[index];
    if (!f) return;
    els.modalTabs.querySelectorAll('.tab').forEach(function (btn) {
      btn.classList.toggle('is-active', Number(btn.getAttribute('data-tab')) === index);
    });

    var lines = String(f.code).replace(/\r\n?/g, '\n').split('\n');
    var rows = lines.map(function (line, i) {
      return '<div class="vrow"><span class="vln">' + (i + 1) + '</span><span class="vcl">' + (highlight(line) || ' ') + '</span></div>';
    }).join('');

    els.modalBody.innerHTML =
      '<div class="file-note">' + escapeHtml(f.note || '') + '</div>' +
      '<div class="viewer">' + rows + '</div>';
    els.modalBody.scrollTop = 0;
  }

  function closeModal() {
    if (els.modal.hidden) return;
    els.modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ------------------------------ 事件绑定 ------------------------------ */

  els.sidebar.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-go]');
    if (!btn) return;
    go(Number(btn.getAttribute('data-go')));
  });

  els.resetAllBtn.addEventListener('click', function () {
    if (!window.confirm('会清空所有题目的作答与完成记录，确定重置吗？')) return;
    state = { current: current, drafts: {}, done: {} };
    revealed = {};
    persist();
    renderSidebar();
    renderQuestion();
    updateProgress();
  });

  els.modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (els.modal.hidden) check();
    }
  });

  /* ------------------------------ 启动 ------------------------------ */

  renderSidebar();
  renderQuestion();
  updateProgress();
  persist();
})();
