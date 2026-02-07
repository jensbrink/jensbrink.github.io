document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let lines = [];

    // Configuration - Subtle Color Waves
    const config = {
        lineCount: 4,         // Minimalist
        amplitude: 120,        // Height of waves
        frequency: 0.001,     // Reduced frequency for gentler curves
        speed: 0.0002,        // Increased speed for more prominent animation
        colors: [
            'rgba(0, 102, 204, 0.35)',    // Soft blue - more prominent
            'rgba(100, 150, 220, 0.32)',  // Light blue
            'rgba(50, 120, 200, 0.38)',   // Medium blue
            'rgba(150, 180, 230, 0.25)'   // Pale blue
        ]
    };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initLines();
    }

    function initLines() {
        lines = [];
        const gap = height / 6; // Vertical spacing
        for (let i = 0; i < config.lineCount; i++) {
            lines.push({
                y: (height / 2) + (i - 1.5) * 60, // Centered
                offset: i * 1000,
                phase: i * Math.PI / 2
            });
        }
    }

    let animationId;
    let isPlaying = true;
    let tick = 0; // Simple counter for animation progress

    const toggleBtn = document.getElementById('animation-toggle');
    const iconPause = toggleBtn.querySelector('.icon-pause');
    const iconPlay = toggleBtn.querySelector('.icon-play');

    function animate() {
        if (!isPlaying) return;

        // increment "time" by a fixed amount each frame (simulating ~60fps)
        // This stops when paused, and continues exactly where left off when resumed.
        tick += 16;

        ctx.clearRect(0, 0, width, height);

        lines.forEach((line, index) => {
            ctx.beginPath();
            ctx.strokeStyle = config.colors[index];
            ctx.lineWidth = 1.2;

            for (let x = 0; x < width; x++) {
                // Sine wave math
                const y = line.y
                    + Math.sin(x * config.frequency + tick * config.speed + line.offset) * config.amplitude
                    + Math.sin(x * 0.003 + tick * 0.0015) * 30;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        animationId = requestAnimationFrame(animate);
    }

    function toggleAnimation() {
        isPlaying = !isPlaying;

        if (isPlaying) {
            iconPause.style.display = 'block';
            iconPlay.style.display = 'none';
            toggleBtn.setAttribute('aria-label', 'Pause animation');
            animate();
        } else {
            iconPause.style.display = 'none';
            iconPlay.style.display = 'block';
            toggleBtn.setAttribute('aria-label', 'Play animation');
            cancelAnimationFrame(animationId);
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleAnimation);

        // Auto-hide button logic
        const heroSection = document.getElementById('hero');
        let activityTimer;

        function showButton() {
            toggleBtn.classList.add('visible');
            clearTimeout(activityTimer);
            activityTimer = setTimeout(() => {
                toggleBtn.classList.remove('visible');
            }, 3000); // Fade out after 3 seconds of inactivity
        }

        if (heroSection) {
            heroSection.addEventListener('mousemove', showButton);
            heroSection.addEventListener('click', showButton); // Also show on click in case they tap

            heroSection.addEventListener('mouseleave', () => {
                clearTimeout(activityTimer);
                toggleBtn.classList.remove('visible');
            });
        }
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(animate);

    // Click-to-Copy Logic
    const emailLink = document.getElementById('email-link');
    const tooltip = document.querySelector('.copy-tooltip');

    if (emailLink && tooltip) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default mailto behavior
            const email = emailLink.innerText.trim().replace('Copied!', '').trim(); // Clean text

            navigator.clipboard.writeText(email).then(() => {
                tooltip.classList.add('visible');
                setTimeout(() => {
                    tooltip.classList.remove('visible');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                // Fallback to mailto if copy fails
                window.location.href = emailLink.href;
            });
        });
    }
});
