    const packageNameInput = document.getElementById('packageName');
    const jsonOutput = document.getElementById('jsonOutput');
    const tabsContainer = document.getElementById('tabs');
    const tabContents = document.getElementById('tabContents');
    const pmOptions = document.querySelectorAll('.pm-option');

    const commandHistory = new Map();

    function getSelectedPMs() {
      return Array.from(pmOptions)
        .filter(opt => opt.querySelector('input').checked)
        .map(opt => opt.querySelector('input').value);
    }

    function parseCommand(input) {
      if (!input.trim()) return { command: '', args: [] };

      const parts = input.trim().split(/\s+/);
      const cmd = parts[0].replace(/^(swpm|npm|yarn|pnpm|bun|deno)$/, m => {
        const map = {
          'swpm': 'install',
          'npm': 'install',
          'yarn': 'install',
          'pnpm': 'install',
          'bun': 'install',
          'deno': 'install'
        };
        return map[m] || 'install';
      });

      return {
        command: cmd,
        args: parts.slice(1)
      };
    }

    function translateCommand(command, args, pms, pkgName) {
      const results = {};

      const cmdMap = {
        'add': { npm: 'install', yarn: 'add', pnpm: 'add', bun: 'add', deno: 'add' },
        'remove': { npm: 'uninstall', yarn: 'remove', pnpm: 'uninstall', bun: 'unremove', deno: 'remove' },
        'install': { npm: 'install', yarn: 'install', pnpm: 'install', bun: 'install', deno: 'install' },
        'update': { npm: 'update', yarn: 'upgrade', pnpm: 'update', bun: 'update', deno: 'outdated' },
        'upgrade': { npm: 'add', yarn: 'upgrade', pnpm: 'update', bun: null, deno: 'add' },
        'init': { npm: 'init', yarn: 'init', pnpm: 'init', bun: 'init', deno: 'init' },
        'run': { npm: 'run', yarn: 'run', pnpm: 'run', bun: 'run', deno: 'task' },
        'test': { npm: 'test', yarn: 'test', pnpm: 'test', bun: 'test', deno: 'test' },
        'build': { npm: 'run build', yarn: 'run build', pnpm: 'run build', bun: 'run build', deno: 'task' },
        'publish': { npm: 'publish', yarn: 'publish', pnpm: 'publish', bun: 'publish', deno: 'publish' }
      };

      const argsMap = {
        '--save-dev': { npm: '--save-dev', yarn: '--dev', pnpm: '--save-dev', bun: '--dev', deno: '--dev' },
        '--save-optional': { npm: '--save-optional', yarn: '--optional', pnpm: '--save-optional', bun: '--optional', deno: '--optional' },
        '--save-peer': { npm: '--save-peer', yarn: '--peer', pnpm: '--save-peer', bun: null, deno: '--peer' },
        '--save-exact': { npm: '--save-exact', yarn: '--exact', pnpm: '--save-exact', bun: '--exact', deno: null },
        '--global': { npm: '--global', yarn: 'global', pnpm: '--global', bun: '--global', deno: '-g' },
        '--frozen': { npm: 'ci', yarn: '--frozen-lockfile', pnpm: '--frozen-lockfile', bun: '--frozen-lockfile', deno: '--frozen' },
        '--latest': { npm: '@latest', yarn: '--latest', pnpm: '--latest', bun: null, deno: null }
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

        newArgs = newArgs.map(arg => argsMap[arg]?.[pm] ?? arg);

        if (pkgName && command === 'upgrade') {
          if (pm === 'npm') {
            newArgs.push(`${pkgName}@latest`);
          } else if (pm === 'yarn' || pm === 'pnpm') {
            newArgs.push('--latest');
          }
        }

        results[pm] = {
          command: newCmd,
          args: newArgs,
          cli: `${pm}${pm === 'yarn' && newCmd === 'add' ? ' add' : ' '}${newCmd} ${newArgs.join(' ')}`.trim()
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

    function getCliForPm(results, pm) {
      const r = results[pm];
      if (!r) return '';
      if (r.error) return r.error;
      return r.cli;
    }

    function updateResults() {
      const input = commandInput.value;
      const pkgName = packageNameInput.value || undefined;
      const pms = getSelectedPMs();

      if (!input.trim() || pms.length === 0) {
        jsonOutput.innerHTML = '// Enter a command and select at least one package manager';
        tabsContainer.innerHTML = '';
        tabContents.innerHTML = '';
        return;
      }

      const { command, args } = parseCommand(input);
      const results = translateCommand(command, args, pms, pkgName);

      jsonOutput.innerHTML = formatJson(results);

      tabsContainer.innerHTML = pms.map(pm =>
        `<button class="tab${pm === pms[0] ? ' active' : ''}" data-pm="${pm}">${pm}</button>`
      ).join('');

      tabContents.innerHTML = pms.map(pm => {
        const cli = getCliForPm(results, pm);
        const hasError = results[pm]?.error;
        return `
          <div class="tab-content${pm === pms[0] ? ' active' : ''}" data-pm="${pm}">
            <div class="cli-example">
              <code class="cli-text">${cli}</code>
              <button class="copy-btn" data-copy="${cli}">
                <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
              </button>
            </div>
            ${hasError ? `<div class="error-state">${cli}</div>` : ''}
          </div>
        `;
      }).join('');

      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          tab.classList.add('active');
          document.querySelector(`.tab-content[data-pm="${tab.dataset.pm}"]`).classList.add('active');
        });
      });

      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const text = btn.dataset.copy;
          await navigator.clipboard.writeText(text);
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

    commandInput.addEventListener('input', updateResults);
    packageNameInput.addEventListener('input', updateResults);

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
      opt.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          const checkbox = opt.querySelector('input');
          checkbox.checked = !checkbox.checked;
          opt.classList.toggle('active', checkbox.checked);
        }
        updateResults();
      });
    });

    updateResults();
  </script>
</body>
</html>