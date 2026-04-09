/**
 * CTE State Module: TRIO_PHOTOS (count === 3)
 * Version 3.0: High Pacing & Metadata Integrated
 */

window.renderState3 = function(container, library) {
    return new Promise(resolve => {
        const p = library.photos;
        container.innerHTML = '';
        const variation = Math.floor(Math.random() * 6);
        
        const bg = document.createElement('div');
        bg.style.position = 'absolute'; bg.style.inset = '-10%';
        bg.style.backgroundImage = `url('${p[0]}')`;
        bg.style.backgroundSize = 'cover'; bg.style.filter = 'blur(80px) brightness(0.2)';
        bg.style.opacity = '0'; bg.style.transition = 'opacity 1.5s ease';
        container.appendChild(bg);

        const wrapper = document.createElement('div');
        wrapper.className = 'photo-container';
        wrapper.style.position = 'absolute'; wrapper.style.inset = '0';
        wrapper.style.perspective = '2000px';
        container.appendChild(wrapper);

        let loaded = 0;
        const imgs = p.map(src => createBaseImg(src));
        
        imgs.forEach(img => {
            img.onload = () => {
                loaded++;
                if (loaded === 3) {
                    const is3V = imgs.every(i => i.naturalHeight > i.naturalWidth);
                    if (is3V) positionGrid(imgs, '28vw', '85vh', 5, 31);
                    else positionGrid(imgs, '30vw', '45vh', 5, 31);
                    
                    bg.style.opacity = '1';
                    imgs.forEach((img, i) => setTimeout(() => img.style.opacity = '1', i * 300));
                    addCinematicMetadata(container, p[0]);
                }
            };
        });

        function addCinematicMetadata(parent, name) {
            const match = name.match(/(\d{2}\.\d{2}\.\d{2})/);
            const date = match ? match[1] : "MOMENT";
            const meta = document.createElement('div');
            meta.className = 'photo-metadata-layer';
            meta.innerHTML = `<div class="date-label">${date}</div><div class="context-label">TRIPTYCH SEQUENCE // VOLUME ${library.id}</div>`;
            parent.appendChild(meta);
            requestAnimationFrame(() => meta.classList.add('show-meta'));
        }

        function positionGrid(items, w, h, startX, stepX) {
            items.forEach((img, i) => {
                img.style.width = w; img.style.height = h;
                img.style.left = `${startX + (i * stepX)}vw`; img.style.top = '7.5vh';
                img.style.objectFit = 'contain'; wrapper.appendChild(img);
            });
        }

        function createBaseImg(src) {
            const i = document.createElement('img');
            i.src = src; i.style.position = 'absolute'; i.style.boxShadow = '0 20px 80px rgba(0,0,0,0.9)';
            i.style.opacity = '0'; i.style.transition = 'all 2s cubic-bezier(0.1, 1, 0.4, 1)';
            return i;
        }

        // FASTER COMPLETION: 5s instead of 8s
        setTimeout(() => {
            bg.style.opacity = '0'; container.style.opacity = '0';
            setTimeout(() => { container.style.opacity = '1'; resolve(); }, 1000);
        }, 5000);
    });
};
