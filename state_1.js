/**
 * CTE State Module: SINGLE_PHOTO (count === 1)
 */

window.renderState1 = function(container, library) {
    return new Promise(resolve => {
        const photo = library.photos[0];
        const variation = Math.floor(Math.random() * 6);
        
        const bg = document.createElement('div');
        bg.style.position = 'absolute'; bg.style.inset = '-10%';
        bg.style.backgroundImage = `url('${photo}')`;
        bg.style.backgroundSize = 'cover'; bg.style.filter = 'blur(60px) brightness(0.3)';
        bg.style.opacity = '0'; bg.style.transition = 'opacity 1.5s ease';
        container.appendChild(bg);

        const wrapper = document.createElement('div');
        wrapper.className = 'photo-container';
        wrapper.style.position = 'absolute'; wrapper.style.inset = '0';
        wrapper.style.display = 'flex'; wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center'; wrapper.style.perspective = '1200px';
        container.appendChild(wrapper);

        const img = document.createElement('img');
        img.src = photo;
        img.style.boxShadow = '0 0 100px rgba(0,0,0,0.9)';
        img.style.opacity = '0';
        img.style.transition = 'all 2s cubic-bezier(0.16, 1, 0.3, 1)';
        wrapper.appendChild(img);

        img.onload = () => {
            if (img.naturalHeight > img.naturalWidth) {
                img.style.maxHeight = '90%'; img.style.width = 'auto';
            } else {
                img.style.maxWidth = '85%'; img.style.height = 'auto';
            }
            applyVariation(variation, img, wrapper);
            bg.style.opacity = '1';
            addCinematicMetadata(container, photo);
        };

        function addCinematicMetadata(parent, name) {
            const match = name.match(/(\d{2}\.\d{2}\.\d{2})/);
            const date = match ? match[1] : "MOMENT";
            const meta = document.createElement('div');
            meta.className = 'photo-metadata-layer';
            meta.innerHTML = `<div class="date-label">${date}</div><div class="context-label">CINEMATIC COLLECTION</div>`;
            parent.appendChild(meta);
            requestAnimationFrame(() => meta.classList.add('show-meta'));
        }

        function applyVariation(v, el, parent) {
            el.style.transform = 'scale(0.95)';
            requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'scale(1)'; });
        }

        // NO FADE-OUT INSIDE STATE: Let script.js handle cross-fade
        setTimeout(() => {
            resolve(); // Trigger next scene overlap
        }, 3500); 
    });
};
