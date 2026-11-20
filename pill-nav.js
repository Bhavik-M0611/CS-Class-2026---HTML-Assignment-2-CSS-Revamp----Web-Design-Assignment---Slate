/* ==========================================================================
   PILL NAV - VANILLA JS PORT FROM REACT BITS
   Props: itemStyle="plain", hoverEffect="glide", indicator="pill", bounce=1, stretch=1
   ========================================================================== */

(function initPillNav() {
    const mount = document.getElementById('slate-pill-nav');
    if (!mount) return;

    // 1. Inject PillNav.css rules automatically so website_style.css stays simple
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .pill-nav {
            --pn-h: 48px;
            --pn-pad: 5px;
            --pn-inner: 38px;
            --pn-x: 18px;
            --pn-font: 15px;
            --pn-gap: 8px;
            --pn-mark: 24px;
            --pn-surface: rgba(240, 240, 243, 0.85);
            --pn-edge: rgba(15, 52, 96, 0.12);
            --pn-rim: rgba(255, 255, 255, 0.95);
            --pn-shadow: 0 18px 36px -18px rgba(15, 52, 96, 0.25), 0 6px 14px -8px rgba(15, 52, 96, 0.12);
            --pn-text: rgba(15, 52, 96, 0.68);
            --pn-strong: #0f3460;
            --pn-pill: linear-gradient(180deg, #16467e 0%, #0f3460 100%);
            --pn-pill-ink: #ffffff;
            --pn-pill-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 14px -6px rgba(15, 52, 96, 0.5);
            --pn-dot: #0f3460;
            --pn-ring: rgba(173, 109, 255, 0.6);
            --pn-blur: blur(20px) saturate(1.6);
            --pn-roll: calc(var(--pn-inner) / 2 + 0.7em);

            position: relative;
            display: inline-flex;
            align-items: center;
            gap: var(--pn-gap);
            max-width: 100%;
            font-family: "Plus Jakarta Sans", Verdana, sans-serif;
            font-size: var(--pn-font);
            line-height: 1;
            -webkit-tap-highlight-color: transparent;
        }
        .pill-nav__surface {
            background: var(--pn-surface);
            box-shadow: var(--pn-shadow);
            -webkit-backdrop-filter: var(--pn-blur);
            backdrop-filter: var(--pn-blur);
        }
        .pill-nav__rim {
            position: absolute;
            inset: 0;
            z-index: 4;
            border-radius: inherit;
            box-shadow: inset 0 0 0 1px var(--pn-edge), inset 0 1px 0 var(--pn-rim);
            pointer-events: none;
        }
        .pill-nav__logo {
            position: relative;
            z-index: 2;
            display: inline-grid;
            flex: none;
            place-items: center;
            width: var(--pn-h);
            height: var(--pn-h);
            border-radius: 999px;
        }
        .pill-nav__logo-link {
            position: absolute;
            inset: 0;
            display: grid;
            place-items: center;
            border-radius: inherit;
            color: var(--pn-strong);
            text-decoration: none;
            outline: none;
        }
        .pill-nav__mark {
            display: grid;
            place-items: center;
            width: var(--pn-mark);
            height: var(--pn-mark);
        }
        .pill-nav__mark img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 50%;
        }
        .pill-nav__bar {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            min-width: 0;
            height: var(--pn-h);
            padding: var(--pn-pad);
            border-radius: 999px;
            box-sizing: border-box;
            overflow-x: auto;
            max-width: 100%;
        }
        .pill-nav__track {
            position: relative;
            height: 100%;
        }
        .pill-nav__list {
            display: flex;
            align-items: stretch;
            gap: 2px;
            height: 100%;
            margin: 0;
            padding: 0;
            list-style: none;
        }
        .pill-nav__slot {
            display: flex;
        }
        .pill-nav__item {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 0 var(--pn-x);
            border: 0;
            border-radius: 999px;
            background: none;
            color: var(--pn-text);
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
            font-weight: 600;
            letter-spacing: -0.005em;
            white-space: nowrap;
            text-decoration: none;
            cursor: pointer;
            outline: none;
            overflow: hidden;
            isolation: isolate;
            transition: color 0.25s ease;
        }
        .pill-nav__slot[data-lit] .pill-nav__item,
        .pill-nav__item[aria-current="page"] {
            color: var(--pn-strong);
        }
        .pill-nav__face {
            display: inline-flex;
            align-items: center;
            gap: 0.45em;
        }
        .pill-nav__glide {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 0;
            border-radius: 999px;
            background: var(--pn-pill);
            box-shadow: var(--pn-pill-shadow);
            opacity: 0;
            pointer-events: none;
            transform-origin: 50% 50%;
            will-change: transform, width, opacity;
        }
        .pill-nav__ink {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: stretch;
            gap: 2px;
            color: var(--pn-pill-ink);
            pointer-events: none;
            clip-path: inset(0 100% 0 0);
        }
        .pill-nav__ink-item {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.45em;
            height: 100%;
            padding: 0 var(--pn-x);
            font-weight: 600;
            letter-spacing: -0.005em;
            white-space: nowrap;
        }
    `;
    document.head.appendChild(styleEl);

    // 2. Navigation Links & Props from your Usage Example
    const items = [
        { label: 'Home', href: 'index.html', icon: '<i class="fa fa-home"></i>' },
        { label: 'About Us', href: 'About Us.html' },
        { label: 'Product', href: 'Product.html' },
        { label: 'Configure', href: 'Configure.html' },
        { label: 'Reviews', href: 'Reviews.html' },
        { label: 'Return Page', href: 'Return Page.html' },
        { label: 'Slate OS' , href: 'Slate OS.html' },
    ];

    const settings = {
        logo: 'Slate Logo.jpg',
        logoHref: 'index.html',
        logoAlt: 'Slate Computing',
        itemStyle: 'plain',
        hoverEffect: 'glide',
        indicator: 'pill',
        bounce: 1,
        stretch: 1,
        intro: true
    };

    // Detect which page is currently open
    const currentPath = decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
    let activeIndex = items.findIndex(item => item.href.toLowerCase() === currentPath.toLowerCase());
    if (activeIndex < 0) activeIndex = 0;

    // 3. Build PillNav DOM Structure
    const nav = document.createElement('nav');
    nav.className = 'pill-nav';
    nav.setAttribute('data-layout', 'split');
    nav.setAttribute('data-items', settings.itemStyle);
    nav.setAttribute('aria-label', 'Main');

    // Optional spinning logo button from PillNav usage example
    const logoSpan = document.createElement('span');
    logoSpan.className = 'pill-nav__logo pill-nav__surface';
    const logoLink = document.createElement('a');
    logoLink.href = settings.logoHref;
    logoLink.className = 'pill-nav__logo-link';
    logoLink.setAttribute('aria-label', settings.logoAlt);
    const markSpan = document.createElement('span');
    markSpan.className = 'pill-nav__mark';
    const logoImg = document.createElement('img');
    logoImg.src = settings.logo;
    logoImg.alt = '';
    logoImg.draggable = false;
    markSpan.appendChild(logoImg);
    logoLink.appendChild(markSpan);
    const logoRim = document.createElement('span');
    logoRim.className = 'pill-nav__rim';
    logoSpan.appendChild(logoLink);
    logoSpan.appendChild(logoRim);
    nav.appendChild(logoSpan);

    // Spin logo on hover
    logoLink.addEventListener('pointerenter', e => {
        if (e.pointerType === 'touch' || markSpan.getAnimations().length) return;
        markSpan.animate(
            [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
            { duration: 900, easing: 'cubic-bezier(0.65, 0, 0.25, 1)' }
        );
    });

    // Main Pill Capsule Bar
    const bar = document.createElement('div');
    bar.className = 'pill-nav__bar pill-nav__surface';
    const track = document.createElement('div');
    track.className = 'pill-nav__track';
    const ul = document.createElement('ul');
    ul.className = 'pill-nav__list';

    const glideEl = document.createElement('span');
    glideEl.className = 'pill-nav__glide';
    glideEl.setAttribute('aria-hidden', 'true');

    const inkEl = document.createElement('div');
    inkEl.className = 'pill-nav__ink';
    inkEl.setAttribute('aria-hidden', 'true');

    const slotEls = [];

    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'pill-nav__slot';

        const a = document.createElement('a');
        a.className = 'pill-nav__item';
        a.href = item.href;
        if (index === activeIndex) a.setAttribute('aria-current', 'page');

        const face = document.createElement('span');
        face.className = 'pill-nav__face';
        face.innerHTML = `${item.icon ? item.icon + ' ' : ''}${item.label}`;

        a.appendChild(face);
        li.appendChild(a);
        ul.appendChild(li);
        slotEls.push(li);

        const inkItem = document.createElement('span');
        inkItem.className = 'pill-nav__ink-item';
        inkItem.innerHTML = `${item.icon ? item.icon + ' ' : ''}${item.label}`;
        inkEl.appendChild(inkItem);
    });

    track.appendChild(ul);
    track.appendChild(glideEl);
    track.appendChild(inkEl);

    const barRim = document.createElement('span');
    barRim.className = 'pill-nav__rim';
    bar.appendChild(track);
    bar.appendChild(barRim);
    nav.appendChild(bar);
    mount.appendChild(nav);

    // 4. Spring Glide & Stretch Engine
    const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
    const state = {
        x0: 0,
        x1: 0,
        v0: 0,
        v1: 0,
        alpha: 0,
        pop: 1,
        press: 1,
        pressVelocity: 0,
        hover: -1,
        sliding: false,
        pressing: false,
        waiting: false
    };

    const rects = [];
    let trackWidth = 0;
    let trackHeight = 0;
    let raf = 0;
    let last = 0;

    const measure = () => {
        trackWidth = track.offsetWidth;
        trackHeight = track.offsetHeight;
        slotEls.forEach((slot, idx) => {
            rects[idx] = { left: slot.offsetLeft, width: slot.offsetWidth };
        });
    };

    const glideIndex = () => {
        if (state.hover >= 0) return state.hover;
        return settings.indicator === 'pill' ? activeIndex : -1;
    };

    const sync = () => {
        slotEls.forEach((slot, idx) => {
            slot.toggleAttribute('data-lit', state.hover === idx);
        });
    };

    const render = () => {
        const width = Math.max(0, state.x1 - state.x0);
        const scale = state.press * state.pop;
        const target = rects[glideIndex()];
        const squash = target ? 1 - clamp((width / Math.max(target.width, 1) - 1) * 0.3, 0, 0.14) : 1;

        glideEl.style.width = `${width}px`;
        glideEl.style.transform = `translate3d(${state.x0}px, 0, 0) scale(${scale}, ${scale * squash})`;
        glideEl.style.opacity = `${state.alpha}`;

        const half = (width * scale) / 2;
        const center = (state.x0 + state.x1) / 2;
        const inset = (trackHeight * (1 - scale * squash)) / 2;
        inkEl.style.clipPath = `inset(${inset}px ${trackWidth - center - half}px ${inset}px ${center - half}px round ${trackHeight / 2}px)`;
        inkEl.style.opacity = `${state.alpha}`;
    };

    const tick = now => {
        raf = 0;
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
        last = now;
        const index = glideIndex();
        const target = rects[index];
        const zeta = 1 - 0.55 * settings.bounce;
        const base = 520;
        let busy = false;

        if (target && !state.waiting) {
            const t0 = target.left;
            const t1 = target.left + target.width;
            if (state.alpha < 0.02 && !state.sliding) {
                state.x0 = t0;
                state.x1 = t1;
                state.v0 = 0;
                state.v1 = 0;
                state.pop = 0.9;
            }
            const direction = Math.sign((t0 + t1) / 2 - (state.x0 + state.x1) / 2);
            const lead = base * (1 + 0.9 * settings.stretch);
            const trail = base * (1 - 0.5 * settings.stretch);
            const k0 = direction < 0 ? lead : direction > 0 ? trail : base;
            const k1 = direction > 0 ? lead : direction < 0 ? trail : base;
            const steps = Math.ceil(dt / (1 / 240));
            const h = dt / steps;
            for (let i = 0; i < steps; i++) {
                state.v0 += (-k0 * (state.x0 - t0) - 2 * zeta * Math.sqrt(k0) * state.v0) * h;
                state.x0 += state.v0 * h;
                state.v1 += (-k1 * (state.x1 - t1) - 2 * zeta * Math.sqrt(k1) * state.v1) * h;
                state.x1 += state.v1 * h;
            }
            state.alpha += (1 - state.alpha) * (1 - Math.exp(-dt / 0.06));
            busy =
                Math.abs(state.x0 - t0) > 0.05 ||
                Math.abs(state.x1 - t1) > 0.05 ||
                Math.abs(state.v0) > 0.5 ||
                Math.abs(state.v1) > 0.5 ||
                state.alpha < 0.999;
            if (!busy) state.sliding = false;
        } else {
            state.alpha += (0 - state.alpha) * (1 - Math.exp(-dt / 0.07));
            if (state.alpha > 0.002) busy = true;
            else state.alpha = 0;
        }

        state.pop += (1 - state.pop) * (1 - Math.exp(-dt / 0.09));
        if (Math.abs(1 - state.pop) > 0.001) busy = true;

        const pressTarget = state.pressing ? 0.95 : 1;
        state.pressVelocity += (-700 * (state.press - pressTarget) - 30 * state.pressVelocity) * dt;
        state.press += state.pressVelocity * dt;
        if (Math.abs(state.press - pressTarget) > 0.0005 || Math.abs(state.pressVelocity) > 0.01) busy = true;

        render();
        if (busy) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
        if (!raf) {
            last = 0;
            raf = requestAnimationFrame(tick);
        }
    };

    // Attach pointer events to each slot
    slotEls.forEach((slot, idx) => {
        slot.addEventListener('pointerenter', e => {
            if (e.pointerType === 'touch') return;
            state.hover = idx;
            sync();
            wake();
        });
        slot.addEventListener('pointerdown', e => {
            if (e.button > 0) return;
            state.pressing = true;
            wake();
        });
    });

    track.addEventListener('pointerleave', () => {
        state.hover = -1;
        sync();
        wake();
    });

    window.addEventListener('pointerup', () => {
        if (!state.pressing) return;
        state.pressing = false;
        wake();
    });

    // Intro unroll animation
    measure();
    sync();
    render();
    wake();

    if (settings.intro) {
        const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
        logoSpan.animate(
            [{ opacity: 0, transform: 'scale(0.6)' }, { opacity: 1, transform: 'scale(1)' }],
            { duration: 700, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'backwards' }
        );
        const w = bar.offsetWidth;
        const h = bar.offsetHeight;
        bar.animate(
            [
                { clipPath: `inset(0px ${Math.max(0, w - h)}px 0px 0px round ${h / 2}px)` },
                { clipPath: `inset(0px 0px 0px 0px round ${h / 2}px)` }
            ],
            { duration: 760, delay: 90, easing: EASE_OUT, fill: 'backwards' }
        );
        slotEls.forEach((slot, idx) => {
            slot.animate(
                [{ opacity: 0, transform: 'translateX(-10px)' }, { opacity: 1, transform: 'translateX(0)' }],
                { duration: 560, delay: 200 + idx * 50, easing: EASE_OUT, fill: 'backwards' }
            );
        });
    }

    const resizeObserver = new ResizeObserver(() => {
        measure();
        render();
        wake();
    });
    resizeObserver.observe(track);
    document.fonts?.ready?.then(() => {
        measure();
        render();
        wake();
    }).catch(() => {});
})();