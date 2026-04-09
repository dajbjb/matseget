/**
 * CTE State Module: DUAL_PHOTOS (count === 2)
 */

window.renderState2 = function(container, library) {
    return new Promise(resolve => {
        const p = library.photos;
        const bg = document.createElement('div');
        bg.style.position = 'absolute'; bg.style.inset = '-10%';
        bg.style.backgroundImage = `url('${p[0]}')`;
        bg.style.backgroundSize = 'cover'; bg.style.filter = 'blur(70px) brightness(0.3)';
        bg.style.opacity = '0'; bg.style.transition = 'opacity 1.5s ease';
        container.appendChild(bg);

        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute'; wrapper.style.inset = '0';
        wrapper.style.perspective = '1500px';
        container.appendChild(wrapper);

        let loaded = 0;
        const imgs = p.map(src => {
            const i = document.createElement('img');
            i.src = src; i.style.position = 'absolute'; i.style.boxShadow = '0 20px 50px rgba(0,0,0,0.8)';
            i.style.opacity = '0'; i.style.transition = 'all 2s cubic-bezier(0.16, 1, 0.3, 1)';
            i.onload = () => {
                loaded++;
                if (loaded === 2) {
                    const isV1 = imgs[0].naturalHeight > imgs[0].naturalWidth;
                    const isV2 = imgs[1].naturalHeight > imgs[1].naturalWidth;
                    if (isV1 && isV2) positionPair(imgs[0], imgs[1], '35vw', '85vh', '12vw', '53vw');
                    else positionPair(imgs[0], imgs[1], '42vw', '60vh', '5vw', '53vw');
                    bg.style.opacity = '1';
                    imgs.forEach((img, i) => setTimeout(() => img.style.opacity = '1', i * 300));
                    addCinematicMetadata(container, p[0]);
                }
            };
            return i;
        });

        function addCinematicMetadata(parent, name) {
            const match = name.match(/(\d{2}\.\d{2}\.\d{2})/);
            const date = match ? match[1] : "MOMENT";
            const meta = document.createElement('div');
            meta.className = 'photo-metadata-layer';
            meta.innerHTML = `<div class="date-label">${date}</div><div class="context-label">DUAL PERSPECTIVE</div>`;
            parent.appendChild(meta);
            requestAnimationFrame(() => meta.classList.add('show-meta'));
        }

        function positionPair(i1, i2, w, h, l, r) {
            [i1, i2].forEach(img => { img.style.width = w; img.style.height = h; img.style.top = '7.5vh'; img.style.objectFit = 'contain'; wrapper.appendChild(img); });
            i1.style.left = l; i2.style.left = r;
        }

        setTimeout(() => {
            resolve();
        }, 4500);
    });
};
