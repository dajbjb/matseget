/**
 * CTE State Module: SEPT_PHOTOS (count === 7)
 */

window.renderState7 = function(container, library) {
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
            i.src = src; i.style.position = 'absolute'; i.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
            i.style.opacity = '0'; i.style.transition = 'all 1s ease-out';
            i.onload = () => { loaded++; if (loaded === 7) applyLayout(); };
            return i;
        });

        function applyLayout() {
            // 1 main hero + 6 mini
            const hero = imgs[0];
            hero.style.width = '60vw'; hero.style.height = '80vh';
            hero.style.left = '5vw'; hero.style.top = '10vh';
            hero.style.objectFit = 'contain';
            wrapper.appendChild(hero);
            
            imgs.slice(1).forEach((img, i) => {
                img.style.width = '25vw'; img.style.height = '25vh';
                img.style.right = '5vw';
                img.style.top = `${10 + (i * 28)}vh`;
                img.style.objectFit = 'cover';
                if(i > 2) { // wrap to bottom
                    img.style.right = `${5 + (i-3) * 28}vw`;
                    img.style.bottom = '10vh'; img.style.top = 'auto';
                }
                wrapper.appendChild(img);
                setTimeout(() => img.style.opacity = '1', i * 150);
            });
            hero.style.opacity = '1';
            bg.style.opacity = '1';
            addCinematicMetadata(container, p[0], "PORTFOLIO // SEVEN");
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
        }, 7500);
    });
};
