document.addEventListener('DOMContentLoaded', () => {
  const commandInput = document.getElementById('command');
  const packageNameInput = document.getElementById('packageName');
  const jsonOutput = document.getElementById('jsonOutput');
  const jsonPanel = document.querySelector('.json-panel');
  const tabsContainer = document.getElementById('tabs');
  const tabContents = document.getElementById('tabContents');
  const cliBody = document.querySelector('.cli-panel .panel-body');
  const pmOptions = document.querySelectorAll('.pm-option');

  function getSelectedPMs() {
    return Array.from(pmOptions)
      .filter(opt => opt.classList.contains('active'))
      .map(opt => opt.dataset.pm);
  }

  function parseCommand(input) {
    if (!input.trim()) return { command: '', args: [] };

    const parts = input.trim().split(/\s+/);
    const pmPrefixRegex = /^(swpm|npm|yarn|yarn@berry|pnpm|bun|deno)$/;

    let command, args;

    if (pmPrefixRegex.test(parts[0])) {
      command = parts[1] || '';
      args = parts.slice(2);
    } else {
      command = parts[0];
      args = parts.slice(1);
    }

    return { command, args };
  }

  function translateCommand(command, args, pms, pkgName) {
    const results = {};

    const cmdMap = {
      'add': { npm: 'install', yarn: 'add', 'yarn@berry': 'add', pnpm: 'add', bun: 'add', deno: 'add' },
      'remove': { npm: 'uninstall', yarn: 'remove', 'yarn@berry': 'remove', pnpm: 'uninstall', bun: 'remove', deno: 'remove' },
      'install': { npm: 'install', yarn: 'install', 'yarn@berry': 'install', pnpm: 'install', bun: 'install', deno: 'install' },
      'update': { npm: 'update', yarn: 'upgrade', 'yarn@berry': 'semver up', pnpm: 'update', bun: 'update', deno: 'outdated' },
      'upgrade': { npm: 'add', yarn: 'upgrade', 'yarn@berry': 'up', pnpm: 'update', bun: null, deno: 'add' },
      'init': { npm: 'init', yarn: 'init', 'yarn@berry': 'init', pnpm: 'init', bun: 'init', deno: 'init' },
      'run': { npm: 'run', yarn: 'run', 'yarn@berry': 'run', pnpm: 'run', bun: 'run', deno: 'task' },
      'test': { npm: 'test', yarn: 'test', 'yarn@berry': 'test', pnpm: 'test', bun: 'test', deno: 'test' },
      'build': { npm: 'run build', yarn: 'run build', 'yarn@berry': 'run build', pnpm: 'run build', bun: 'run build', deno: 'task' },
      'publish': { npm: 'publish', yarn: 'publish', 'yarn@berry': 'publish', pnpm: 'publish', bun: 'publish', deno: 'publish' }
    };

    const argsMap = {
      '--save-dev': { npm: '--save-dev', yarn: '--dev', 'yarn@berry': '--dev', pnpm: '--save-dev', bun: '--dev', deno: '--dev' },
      '--save-optional': { npm: '--save-optional', yarn: '--optional', 'yarn@berry': '--optional', pnpm: '--save-optional', bun: '--optional', deno: '--optional' },
      '--save-peer': { npm: '--save-peer', yarn: '--peer', 'yarn@berry': '--peer', pnpm: '--save-peer', bun: null, deno: '--peer' },
      '--save-exact': { npm: '--save-exact', yarn: '--exact', 'yarn@berry': '--exact', pnpm: '--save-exact', bun: '--exact', deno: null },
      '--global': { npm: '--global', yarn: 'global', 'yarn@berry': 'global', pnpm: '--global', bun: '--global', deno: '-g' },
      '--frozen': { npm: 'ci', yarn: '--frozen-lockfile', 'yarn@berry': '--immutable', pnpm: '--frozen-lockfile', bun: '--frozen-lockfile', deno: '--frozen' },
      '--latest': { npm: '@latest', yarn: '--latest', 'yarn@berry': '--latest', pnpm: '--latest', bun: null, deno: null },
      '--dev': { npm: '--save-dev', yarn: '--dev', 'yarn@berry': '--dev', pnpm: '--save-dev', bun: '--dev', deno: '--dev' }
    };

    for (const pm of pms) {
      let newCmd = cmdMap[command]?.[pm];
      let newArgs = [...args];

      if (!newCmd) {
        results[pm] = {
          command: command,
          args: args,
          cli: '',
          error: `Command '${command}' not available on ${pm}`
        };
        continue;
      }

      if (pkgName && command === 'upgrade') {
        if (pm === 'npm') {
          newArgs.push(`${pkgName}@latest`);
        } else if (pm === 'yarn' || pm === 'pnpm') {
          newArgs.push('--latest');
        }
      }

      newArgs = newArgs.map(arg => argsMap[arg]?.[pm] ?? arg);

      results[pm] = {
        command: newCmd,
        args: newArgs,
        cli: `${pm} ${newCmd} ${newArgs.join(' ')}`.trim()
      };
    }

    return results;
  }

  function formatJson(obj) {
    return JSON.stringify(obj, null, 2)
      .replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span class="string">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="number">$1</span>');
  }

  function updateResults() {
    const input = commandInput.value;
    const pkgName = packageNameInput.value || undefined;
    const pms = getSelectedPMs();

    if (!input.trim() || pms.length === 0) {
      jsonOutput.innerHTML = '';
      tabsContainer.innerHTML = '';
      tabContents.innerHTML = '<div class="empty-state">Enter a command and select at least one package manager</div>';
      tabsContainer.parentElement.classList.add('is-empty');
      delete cliBody.dataset.activePm;
      delete document.querySelector('.cli-panel')?.dataset.activePm;
      jsonPanel.style.display = 'none';
      toggleClearBtn();
      return;
    }

    tabsContainer.parentElement.classList.remove('is-empty');

    jsonPanel.style.display = '';

    const { command, args } = parseCommand(input);
    const results = translateCommand(command, args, pms, pkgName);

    toggleClearBtn();

    jsonOutput.innerHTML = formatJson(results);

    const activePm = document.querySelector('.tab.active')?.dataset.pm;
    const pm = pms.includes(activePm) ? activePm : pms[0];

    tabsContainer.innerHTML = pms.map(p =>
      `<button class="tab${p === pm ? ' active' : ''}" data-pm="${p}">${p}</button>`
    ).join('');

    const activeTabEl = tabsContainer.querySelector('.tab.active');
    if (activeTabEl) activeTabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

    const tabsWrapper = tabsContainer.closest('.tabs-wrapper');
    if (tabsWrapper) {
      tabsWrapper.classList.toggle('single-tab', pms.length <= 2);
    }

    tabsContainer.parentElement.dataset.activePm = pm;
    document.querySelector('.cli-panel').dataset.activePm = pm;

    tabContents.innerHTML = pms.map(p => {
      const r = results[p];
      return `
        <div class="tab-content${p === pm ? ' active' : ''}" data-pm="${p}">
          ${r?.error
            ? `<div class="error-state">${r.error}</div>`
            : `<div class="cli-example">
              <code class="cli-text">${r.cli}</code>
              <button class="copy-btn" data-copy="${r.cli}">
                <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
              </button>
            </div>`}
        </div>
      `;
    }).join('');

    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`.tab-content[data-pm="${tab.dataset.pm}"]`).classList.add('active');
        tabsContainer.parentElement.dataset.activePm = tab.dataset.pm;
        document.querySelector('.cli-panel').dataset.activePm = tab.dataset.pm;
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      });
    });

    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy;
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          return;
        }
        btn.classList.add('copied');
        btn.innerHTML = `
          <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = `
            <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          `;
        }, 2000);
      });
    });
  }

  const cmdSelect = document.getElementById('cmdSelect');
  const cmdInputGroup = document.getElementById('cmdInputGroup');
  const cmdPicker = document.getElementById('cmdPicker');

  function showCmdInput(value) {
    cmdPicker.style.display = 'none';
    cmdInputGroup.style.display = '';
    commandInput.value = value;
    commandInput.focus();
    updateResults();
  }

  function showCmdPicker() {
    cmdInputGroup.style.display = 'none';
    cmdPicker.style.display = '';
    cmdSelect.value = '';
    commandInput.value = '';
    updateResults();
  }

  function toggleClearBtn() {
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.classList.toggle('visible', cmdInputGroup.style.display !== 'none' && commandInput.value.length > 0);
  }

  commandInput.addEventListener('input', (e) => {
    const val = commandInput.value;
    if (val && !val.startsWith('swpm ')) {
      const selStart = commandInput.selectionStart;
      commandInput.value = 'swpm ' + val.replace(/^swpm\s*/i, '');
      commandInput.selectionStart = commandInput.selectionEnd = selStart + 5;
    }
    updateResults();
  });
  packageNameInput.addEventListener('input', updateResults);

  const clearBtn = document.getElementById('clearBtn');

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      showCmdPicker();
      commandInput.focus();
    });
  }

  toggleClearBtn();

  const themeToggle = document.getElementById('themeToggle');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sxpm-theme', theme);
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  const savedTheme = localStorage.getItem('sxpm-theme');
  const systemTheme = getSystemTheme();
  setTheme(savedTheme || systemTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('sxpm-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  pmOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      opt.classList.toggle('active');
      updateResults();
    });
  });

  document.getElementById('tabPrev')?.addEventListener('click', () => {
    const tabs = document.querySelectorAll('.tab');
    const active = document.querySelector('.tab.active');
    const idx = Array.from(tabs).indexOf(active);
    if (idx > 0) tabs[idx - 1].click();
  });

  document.getElementById('tabNext')?.addEventListener('click', () => {
    const tabs = document.querySelectorAll('.tab');
    const active = document.querySelector('.tab.active');
    const idx = Array.from(tabs).indexOf(active);
    if (idx < tabs.length - 1) tabs[idx + 1].click();
  });

  cmdSelect.addEventListener('change', () => {
    if (!cmdSelect.value) return;
    showCmdInput(cmdSelect.value);
  });

  showCmdInput('swpm add sxpm');
});
