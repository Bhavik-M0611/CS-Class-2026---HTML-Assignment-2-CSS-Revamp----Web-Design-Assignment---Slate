/* ==========================================================================
   GLASS SURFACE - VANILLA JS PORT FROM REACT BITS
   Upgrades the persistent .navbar top bar with chromatic SVG refraction
   ========================================================================== */

(function initGlassSurface() {
    const container = document.querySelector('.navbar');
    if (!container) return;

    // 1. Inject GlassSurface.css rules automatically so website_style.css stays simple
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .glass-surface {
            position: sticky;
            top: 12px;
            overflow: hidden;
            transition: opacity 0.26s ease-out;
        }
        .glass-surface__filter {
            width: 100%;
            height: 100%;
            pointer-events: none;
            position: absolute;
            inset: 0;
            opacity: 0;
            z-index: -1;
        }
        .glass-surface__content {
            width: 100%;
            height: 100%;
            border-radius: inherit;
            position: relative;
            z-index: 2;
            overflow: auto;
        }
        .glass-surface--svg {
            background: rgba(255, 255, 255, var(--glass-frost, 0.1));
            -webkit-backdrop-filter: var(--filter-id) saturate(var(--glass-saturation, 1));
            backdrop-filter: var(--filter-id) saturate(var(--glass-saturation, 1));
            box-shadow:
                0 0 2px 1px rgba(15, 52, 96, 0.15) inset,
                0 0 10px 4px rgba(255, 255, 255, 0.65) inset,
                0px 4px 16px rgba(17, 17, 26, 0.06),
                0px 8px 24px rgba(17, 17, 26, 0.06),
                0px 16px 56px rgba(17, 17, 26, 0.06),
                0px 4px 16px rgba(17, 17, 26, 0.05) inset;
        }
        .glass-surface--fallback {
            background: rgba(255, 255, 255, 0.35);
            -webkit-backdrop-filter: blur(14px) saturate(1.4) brightness(1.04);
            backdrop-filter: blur(14px) saturate(1.4) brightness(1.04);
            box-shadow:
                inset 0 1px 0 0 rgba(255, 255, 255, 0.85),
                inset 0 -1px 0 0 rgba(255, 255, 255, 0.35),
                0 0 2px 1px rgba(15, 52, 96, 0.12) inset,
                0px 8px 24px rgba(17, 17, 26, 0.08);
        }
        .glass-surface__sheen,
        .glass-surface__rim {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            z-index: 1;
        }
        .glass-surface__sheen {
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.42) 0%,
                transparent 42%,
                transparent 64%,
                rgba(255, 255, 255, 0.18) 100%
            );
        }
        .glass-surface__rim {
            padding: 2px;
            background: linear-gradient(
                150deg,
                rgba(255, 255, 255, 0.8),
                rgba(15, 52, 96, 0.15) 45%,
                rgba(173, 109, 255, 0.2) 60%,
                rgba(255, 255, 255, 0.6)
            );
            -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
        }
    `;
    document.head.appendChild(styleEl);

    // 2. Your exact configuration props from the React Bits Usage Example
    const settings = {
        borderRadius: 38,
        borderWidth: 0.3,
        brightness: 50,
        opacity: 0.93,
        blur: 11,
        displace: 0.5,
        backgroundOpacity: 0.1,
        saturation: 1,
        distortionScale: -220,
        redOffset: 0,
        greenOffset: 28,
        blueOffset: 56,
        xChannel: 'R',
        yChannel: 'G',
        mixBlendMode: 'difference'
    };

    const uniqueId = 'slate-navbar-glass';
    const filterId = `glass-filter-${uniqueId}`;
    const redGradId = `red-grad-${uniqueId}`;
    const blueGradId = `blue-grad-${uniqueId}`;
    const softId = `soft-${uniqueId}`;

    // Wrap existing navbar contents (Logo + PillNav) inside .glass-surface__content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'glass-surface__content';
    while (container.firstChild) {
        contentDiv.appendChild(container.firstChild);
    }

    // Build SVG Displacement Filter for real-time edge refraction
    const svgNS = 'http://www.w3.org/2000/svg';
    const svgEl = document.createElementNS(svgNS, 'svg');
    svgEl.setAttribute('class', 'glass-surface__filter');
    svgEl.innerHTML = `
        <defs>
            <filter id="${filterId}" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
                <feImage id="fe-img-${uniqueId}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
                <feDisplacementMap id="red-ch-${uniqueId}" in="SourceGraphic" in2="map" scale="${settings.distortionScale + settings.redOffset}" xChannelSelector="${settings.xChannel}" yChannelSelector="${settings.yChannel}" result="dispRed" />
                <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
                <feDisplacementMap id="green-ch-${uniqueId}" in="SourceGraphic" in2="map" scale="${settings.distortionScale + settings.greenOffset}" xChannelSelector="${settings.xChannel}" yChannelSelector="${settings.yChannel}" result="dispGreen" />
                <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
                <feDisplacementMap id="blue-ch-${uniqueId}" in="SourceGraphic" in2="map" scale="${settings.distortionScale + settings.blueOffset}" xChannelSelector="${settings.xChannel}" yChannelSelector="${settings.yChannel}" result="dispBlue" />
                <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
                <feBlend in="red" in2="green" mode="screen" result="rg" />
                <feBlend in="rg" in2="blue" mode="screen" result="output" />
                <feGaussianBlur id="blur-${uniqueId}" in="output" stdDeviation="${settings.displace}" />
            </filter>
        </defs>
    `;

    const sheenSpan = document.createElement('span');
    sheenSpan.className = 'glass-surface__sheen';
    sheenSpan.setAttribute('aria-hidden', 'true');

    const rimSpan = document.createElement('span');
    rimSpan.className = 'glass-surface__rim';
    rimSpan.setAttribute('aria-hidden', 'true');

    // Check if browser supports SVG backdrop-filter refraction (Chromium / Edge / Chrome)
    const supportsSVGFilters = () => {
        const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        const isFirefox = /Firefox/.test(navigator.userAgent);
        if (isWebkit || isFirefox) return false;
        const testDiv = document.createElement('div');
        testDiv.style.backdropFilter = `url(#${filterId})`;
        return testDiv.style.backdropFilter !== '';
    };

    const refractive = supportsSVGFilters();
    container.classList.add('glass-surface', refractive ? 'glass-surface--svg' : 'glass-surface--fallback');
    container.style.setProperty('--glass-frost', settings.backgroundOpacity);
    container.style.setProperty('--glass-saturation', settings.saturation);
    container.style.setProperty('--filter-id', `url(#${filterId})`);

    container.appendChild(svgEl);
    container.appendChild(sheenSpan);
    container.appendChild(rimSpan);
    container.appendChild(contentDiv);

    const feImageEl = svgEl.querySelector(`#fe-img-${uniqueId}`);

    const updateDisplacementMap = () => {
        const rect = container.getBoundingClientRect();
        const actualWidth = Math.max(100, Math.round(rect.width || 1000));
        const actualHeight = Math.max(50, Math.round(rect.height || 110));
        const edgeSize = Math.min(actualWidth, actualHeight) * (settings.borderWidth * 0.5);

        const svgContent = `
            <svg width="${actualWidth}" height="${actualHeight}" viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#0000"/>
                        <stop offset="100%" stop-color="red"/>
                    </linearGradient>
                    <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#0000"/>
                        <stop offset="100%" stop-color="blue"/>
                    </linearGradient>
                    <filter id="${softId}" filterUnits="userSpaceOnUse" x="0" y="0" width="${actualWidth}" height="${actualHeight}" color-interpolation-filters="sRGB">
                        <feGaussianBlur stdDeviation="${settings.blur}" />
                    </filter>
                </defs>
                <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
                <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${settings.borderRadius}" fill="url(#${redGradId})" />
                <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${settings.borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${settings.mixBlendMode}" />
                <rect x="${edgeSize}" y="${edgeSize}" width="${Math.max(10, actualWidth - edgeSize * 2)}" height="${Math.max(10, actualHeight - edgeSize * 2)}" rx="${settings.borderRadius}" fill="hsl(0 0% ${settings.brightness}% / ${settings.opacity})" filter="url(#${softId})" />
            </svg>
        `;

        const dataUrl = `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
        if (feImageEl) feImageEl.setAttribute('href', dataUrl);
    };

    const resizeObserver = new ResizeObserver(updateDisplacementMap);
    resizeObserver.observe(container);
    updateDisplacementMap();
})();