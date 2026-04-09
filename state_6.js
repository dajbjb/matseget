/**
 * CTE State Module: HEX_PHOTOS (count === 6)
 */

window.renderState6 = function(container, library) {
    return new Promise(resolve => {
        const p = library.photos;
        container.innerHTML = '';
        
        const bg = document.createElement('div');
        bg.style.position = 'absolute'; bg.style.inset = '-10%';
        bg.style.backgroundImage = `url('${p[0]}')`;
        bg.style.backgroundSize = 'cover'; bg.style.filter = 'blur(80px) brightness(0.2)';
        bg.style.opacity = '0'; bg.style.transition = 'opacity 1.5s ease';
        container.appendChild(bg);

        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute'; wrapper.style.inset = '0';
        container.appendChild(wrapper);

        let loaded = 0;
        const imgs = p.map(src => {
            const i = document.createElement('img');
            i.src = src; i.style.position = 'absolute'; i.style.boxShadow = '0 15px 40px rgba(0,0,0,0.8)';
            i.style.opacity = '0'; i.style.transition = 'all 1.5s ease-out';
            i.onload = () => {
                loaded++;
                if (loaded === 6) applyLayout();
            };
            return i;
        });

        function applyLayout() {
            // 2 rows of 3
            imgs.forEach((img, i) => {
                img.style.width = '28vw'; img.style.height = '40vh';
                img.style.left = `${5 + (i % 3) * 31}vw`;
                img.style.top = (i < 3) ? '5vh' : '50vh';
                img.style.objectFit = 'cover';
                wrapper.appendChild(img);
                setTimeout(() => img.style.opacity = '1', i * 150);
            });
            bg.style.opacity = '1';
            addCinematicMetadata(container, p[0], "HEX_COLLECTION");
        }

        function addCinematicMetadata(parent, name, context) {
            const match = name.match(/(\d{2}\.\d{2}\.\d{2})/);
            const date = match ? match[1] : "MOMENT";
            const meta = document.createElement('div');
            meta.className = 'photo-metadata-layer';
            meta.innerHTML = `<div class="date-label">${date}</div><div class="context-label">${context}</div>`;
            parent.appendChild(meta);
            requestAnimationFrame(() => meta.classList.add('show-meta'));
        }

        setTimeout(() => {
            bg.style.opacity = '0'; container.style.opacity = '0';
            setTimeout(() => { container.style.opacity = '1'; resolve(); }, 1200);
        }, 6500);
    });
};
