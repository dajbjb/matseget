/**
 * CTE State Module: LARGE_COLLECTION (count === 11)
 * High speed mosaic for dense memories.
 */

window.renderState11 = function(container, library) {
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
        wrapper.className = 'photo-container';
        wrapper.style.position = 'absolute'; wrapper.style.inset = '0';
        container.appendChild(wrapper);

        let loaded = 0;
        const imgs = p.map(src => {
            const i = document.createElement('img');
            i.src = src; i.style.position = 'absolute'; 
            i.style.boxShadow = '0 5px 20px rgba(0,0,0,0.8)';
            i.style.opacity = '0'; i.style.transition = 'all 0.8s ease-out';
            i.style.objectFit = 'cover';
            i.onload = () => { loaded++; if (loaded === p.length) applyLayout(); };
            return i;
        });

        function applyLayout() {
            // Mosaic approach: 1 main large + 10 small
            const hero = imgs[0];
            hero.style.width = '45vw'; hero.style.height = '85vh';
            hero.style.left = '5vw'; hero.style.top = '7.5vh';
            wrapper.appendChild(hero);

            const minis = imgs.slice(1);
            minis.forEach((img, i) => {
                img.style.width = '12vw'; img.style.height = '18vh';
                const col = i % 4; const row = Math.floor(i / 4);
                img.style.left = `${52 + (col * 14)}vw`;
                img.style.top = `${7.5 + (row * 22)}vh`;
                wrapper.appendChild(img);
                setTimeout(() => img.style.opacity = '1', i * 100);
            });
            hero.style.opacity = '1';
            bg.style.opacity = '1';
            addCinematicMetadata(container, p[0], "LARGE ARCHIVE // MOSAIC");
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
        }, 9000);
    });
};
