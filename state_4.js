/**
 * CTE State Module: QUAD_PHOTOS (count === 4)
 */

window.renderState4 = function(container, library) {
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
                if (loaded === 4) applyLayout();
            };
        });

        function applyLayout() {
            const allVertical = imgs.every(i => i.naturalHeight > i.naturalWidth);
            
            if (allVertical) {
                // Tall 1x4 Triptych-style
                positionGrid(imgs, '22vw', '85vh', 5, 23, '7.5vh');
            } else {
                // 2x2 Grid
                imgs.forEach((img, i) => {
                    img.style.width = '42vw'; img.style.height = '42vh';
                    img.style.left = (i % 2 === 0) ? '5vw' : '53vw';
                    img.style.top = (i < 2) ? '5vh' : '53vh';
                    img.style.objectFit = 'contain';
                    wrapper.appendChild(img);
                });
            }

            bg.style.opacity = '1';
            imgs.forEach((img, i) => setTimeout(() => img.style.opacity = '1', i * 250));
            addCinematicMetadata(container, p[0], "QUAD_VIEW");
        }

        function positionGrid(items, w, h, startX, stepX, top) {
            items.forEach((img, i) => {
                img.style.width = w; img.style.height = h;
                img.style.left = `${startX + (i * stepX)}vw`; img.style.top = top;
                img.style.objectFit = 'contain'; wrapper.appendChild(img);
            });
        }

        function createBaseImg(src) {
            const i = document.createElement('img');
            i.src = src; i.style.position = 'absolute'; i.style.boxShadow = '0 20px 80px rgba(0,0,0,0.8)';
            i.style.opacity = '0'; i.style.transition = 'all 2s cubic-bezier(0.1, 1, 0.4, 1)';
            return i;
        }

        function addCinematicMetadata(parent, name, context) {
            const match = name.match(/(\d{2}\.\d{2}\.\d{2})/);
            const date = match ? match[1] : "MOMENT";
            const meta = document.createElement('div');
            meta.className = 'photo-metadata-layer';
            meta.innerHTML = `<div class="date-label">${date}</div><div class="context-label">${context} // SEQUENCE</div>`;
            parent.appendChild(meta);
            requestAnimationFrame(() => meta.classList.add('show-meta'));
        }

        setTimeout(() => {
            bg.style.opacity = '0'; container.style.opacity = '0';
            setTimeout(() => { container.style.opacity = '1'; resolve(); }, 1000);
        }, 5500);
    });
};
