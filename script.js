// ==========================================================================
// GOKUL R S — INTERACTIVE PORTFOLIO ENGINE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Theme Toggle (Obsidian Dark / Sleek Light)
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn?.querySelector('.theme-icon');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('gokul_portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    document.documentElement.classList.remove('dark');
    if (themeIcon) themeIcon.textContent = '☀️';
  } else {
    document.documentElement.classList.add('dark');
    if (themeIcon) themeIcon.textContent = '🌙';
  }

  themeToggleBtn?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('gokul_portfolio_theme', isDark ? 'dark' : 'light');
    if (themeIcon) themeIcon.textContent = isDark ? '🌙' : '☀️';
    showToast(isDark ? 'Obsidian Dark Mode enabled' : 'Sleek Light Mode enabled');
  });

  // ------------------------------------------------------------------------
  // 2. Mobile Menu Toggle
  // ------------------------------------------------------------------------
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('nav');

  menuBtn?.addEventListener('click', () => nav?.classList.toggle('open'));

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => nav?.classList.remove('open'));
  });

  // ------------------------------------------------------------------------
  // 3. ScrollSpy Navigation Active Highlight
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('nav a.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 4. Skills Category Filter
  // ------------------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 5. Interactive SQL Assistant Demo Switcher
  // ------------------------------------------------------------------------
  const sqlChips = document.querySelectorAll('.sql-chip');
  const promptText = document.getElementById('sql-prompt-text');
  const sqlCodeDisplay = document.getElementById('sql-code-display');
  const sqlTableBody = document.getElementById('sql-table-body');

  const sqlDemos = {
    'top-spend': {
      prompt: 'Show top 5 customers with highest spend',
      code: `<span class="c-purple">SELECT</span> customer_name, <span class="c-blue">SUM</span>(total_amount) <span class="c-purple">AS</span> total_spend\n<span class="c-purple">FROM</span> customer_orders\n<span class="c-purple">GROUP BY</span> customer_name\n<span class="c-purple">ORDER BY</span> total_spend <span class="c-purple">DESC</span>\n<span class="c-purple">LIMIT</span> <span class="c-amber">5</span>;`,
      table: `
        <tr><td>Apex Tech Solutions</td><td>$42,850</td><td><span class="badge-green">VIP</span></td></tr>
        <tr><td>Quantum Dynamics</td><td>$38,200</td><td><span class="badge-green">VIP</span></td></tr>
        <tr><td>Starlight Media</td><td>$31,150</td><td><span class="badge-blue">Regular</span></td></tr>
      `
    },
    'monthly-revenue': {
      prompt: 'Calculate monthly recurring revenue for Q2 2026',
      code: `<span class="c-purple">SELECT</span> <span class="c-blue">DATE_TRUNC</span>(<span class="c-green">'month'</span>, created_at) <span class="c-purple">AS</span> mrr_month,\n       <span class="c-blue">SUM</span>(amount) <span class="c-purple">AS</span> revenue\n<span class="c-purple">FROM</span> subscriptions\n<span class="c-purple">WHERE</span> status = <span class="c-green">'active'</span>\n<span class="c-purple">GROUP BY</span> <span class="c-amber">1</span> <span class="c-purple">ORDER BY</span> <span class="c-amber">1</span> <span class="c-purple">ASC</span>;`,
      table: `
        <tr><td>2026-04-01 (April)</td><td>$89,400</td><td><span class="badge-green">+14%</span></td></tr>
        <tr><td>2026-05-01 (May)</td><td>$108,200</td><td><span class="badge-green">+21%</span></td></tr>
        <tr><td>2026-06-01 (June)</td><td>$115,800</td><td><span class="badge-green">+7%</span></td></tr>
      `
    },
    'low-stock': {
      prompt: 'Flag items with inventory count below threshold',
      code: `<span class="c-purple">SELECT</span> item_name, reorder_level, stock_qty\n<span class="c-purple">FROM</span> inventory_warehouse\n<span class="c-purple">WHERE</span> stock_qty < reorder_level\n<span class="c-purple">ORDER BY</span> stock_qty <span class="c-purple">ASC</span>;`,
      table: `
        <tr><td>Neural Sensor Probe v2</td><td>4 units</td><td><span class="badge-green">CRITICAL</span></td></tr>
        <tr><td>CUDA Accelerator Chip</td><td>12 units</td><td><span class="badge-blue">LOW</span></td></tr>
        <tr><td>Optical Lens Assembly</td><td>18 units</td><td><span class="badge-blue">LOW</span></td></tr>
      `
    }
  };

  sqlChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sqlChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const queryKey = chip.getAttribute('data-query');
      const data = sqlDemos[queryKey];

      if (data && promptText && sqlCodeDisplay && sqlTableBody) {
        promptText.textContent = data.prompt;
        sqlCodeDisplay.innerHTML = data.code;
        sqlTableBody.innerHTML = data.table;
      }
    });
  });

  // ------------------------------------------------------------------------
  // 6. Interactive Vision Retina Scanner Demo
  // ------------------------------------------------------------------------
  const scanPills = document.querySelectorAll('.scan-pill');
  const visionClassLabel = document.getElementById('vision-class-label');

  scanPills.forEach(pill => {
    pill.addEventListener('click', () => {
      scanPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cls = pill.getAttribute('data-class');
      const acc = pill.getAttribute('data-acc');

      if (visionClassLabel) {
        visionClassLabel.textContent = `OCT: ${cls} (${acc})`;
      }
    });
  });

  // ------------------------------------------------------------------------
  // 7. One-Click Copy Email Button & Toast
  // ------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');

  copyEmailBtn?.addEventListener('click', () => {
    const email = 'gokulrs1802@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('✓ Email copied to clipboard!');
    }).catch(() => {
      showToast('gokulrs1802@gmail.com');
    });
  });

  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }

  // ------------------------------------------------------------------------
  // 8. Intersection Observer for Scroll Reveals
  // ------------------------------------------------------------------------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.bento-card, .project-bento-card, .timeline-bento-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });

  const revealStyle = document.createElement('style');
  revealStyle.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(revealStyle);
});
