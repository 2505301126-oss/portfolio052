document.addEventListener("DOMContentLoaded", () => {
    // Prevent scrolling during intro
    document.body.classList.add("locked");

    const startBtn = document.getElementById("start-btn");
    const introWrapper = document.getElementById("intro-wrapper");
    const flickerOverlay = document.getElementById("flicker-overlay");
    const tagline = document.getElementById("tagline");
    const hsMarvelContainer = document.getElementById("hs-marvel-container");
    const hsEditsLogo = document.getElementById("hs-edits-logo");
    const marvelVideos = document.querySelectorAll("#marvel-flipbook-videos video");
    const mainContent = document.getElementById("main-content");
    const bgAudio = document.getElementById("bg-audio");
    const thunderContainer = document.getElementById("thunder-strike-container");
    const sceneContents = document.querySelectorAll(".scene-content");

    // Intersection Observer for Cinematic Scroll Reveal
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    // Intense Criss-Cross Sky Thunder logic
    function triggerSkyThunder(intensity = 1) {
        if (!thunderContainer) return;

        const boltCount = intensity === 1 ? 5 : 12;
        for (let i = 0; i < boltCount; i++) {
            const bolt = document.createElement("div");
            bolt.classList.add("thunder-bolt");

            const startX = Math.random() * 100;
            const angle = (Math.random() * 140) - 70;

            bolt.style.width = intensity === 1 ? (Math.random() * 4 + 2) + "px" : (Math.random() * 8 + 4) + "px";
            bolt.style.height = '200vh';
            bolt.style.left = `${startX}%`;
            bolt.style.top = '-50vh';
            bolt.style.transform = `rotate(${angle}deg)`;
            bolt.style.transformOrigin = 'top center';

            bolt.classList.add("thunder-strike-active");
            if (intensity > 1) {
                bolt.style.background = "#fff";
                bolt.style.boxShadow = "0 0 100px #fff, 0 0 200px #0ff";
            }

            thunderContainer.appendChild(bolt);
            setTimeout(() => bolt.remove(), 700);
        }

        flickerOverlay.style.background = "rgba(255, 255, 255, 0.4)";
        flickerOverlay.style.opacity = "1";
        setTimeout(() => {
            flickerOverlay.style.opacity = "0";
            setTimeout(() => flickerOverlay.style.background = "transparent", 100);
        }, 150);
    }

    // Marvel Flipbook (Sequential videos inside text)
    let marvelInterval;
    function startMarvelFlipbook() {
        let currentIdx = -1;
        marvelVideos.forEach(v => {
            v.style.opacity = "0";
            v.play().catch(() => { });
        });

        marvelInterval = setInterval(() => {
            if (currentIdx >= 0) {
                marvelVideos[currentIdx].style.opacity = "0";
            }
            currentIdx = (currentIdx + 1) % marvelVideos.length;
            marvelVideos[currentIdx].style.opacity = "1";
            marvelVideos[currentIdx].currentTime = Math.random() * 5;
        }, 120);
    }

    function stopMarvelFlipbook() {
        clearInterval(marvelInterval);
        marvelVideos.forEach(v => v.style.opacity = "0");
    }

    function smoothAudioTransition() {
        let vol = 1.0;
        const interval = setInterval(() => {
            if (vol > 0.35) {
                vol -= 0.05;
                bgAudio.volume = vol;
            } else {
                clearInterval(interval);
            }
        }, 150);
    }

    function startCinematicExperience() {
        startBtn.classList.add("hidden");

        // Audio Activation
        bgAudio.volume = 1.0;
        bgAudio.play().catch(err => {
            bgAudio.muted = false;
            bgAudio.play();
        });

        triggerSkyThunder();
        flickerOverlay.classList.add("neon-pulse");

        // 1. Tagline appearance (2.2s)
        setTimeout(() => {
            flickerOverlay.classList.remove("neon-pulse");
            tagline.classList.remove("hidden");
            triggerSkyThunder(1.2);
            setTimeout(() => {
                tagline.classList.add("spark-text");
            }, 50);
        }, 2200);

        // 2. Transition out tagline
        setTimeout(() => {
            tagline.classList.add("cut-out");
            setTimeout(() => tagline.classList.add("hidden"), 300);
        }, 5500);

        // 3. HS EDITS LUXURY ZOOM OUT REVEAL (Starts at 6.5s)
        setTimeout(() => {
            hsMarvelContainer.style.opacity = "1";
            hsEditsLogo.classList.remove("hidden");

            // Initial clear 'Pop' for proper visibility
            triggerSkyThunder(1.5);

            startMarvelFlipbook();
            hsEditsLogo.classList.add("intro-zoom-out");

            // Frequent Thunder beats during HS Reveal
            const thunderBeats = setInterval(() => {
                if (hsEditsLogo.classList.contains("intro-zoom-out") && !hsEditsLogo.classList.contains("netflix-reveal")) {
                    triggerSkyThunder(1);
                } else {
                    clearInterval(thunderBeats);
                }
            }, 1250);

            // Transition into White Neon + Glowing Passerby at 5s
            setTimeout(() => {
                stopMarvelFlipbook();
                hsEditsLogo.classList.add("white-neon-fill");
                hsMarvelContainer.classList.add("passerby-active");
                triggerSkyThunder(1.5);
            }, 5000);

        }, 6500);

        // 4. Final HS SMOOTH ZOOM IN Surge (At 12.5s)
        setTimeout(() => {
            triggerSkyThunder(3);
            hsEditsLogo.classList.add("netflix-reveal");
            introWrapper.classList.add("intro-fade-bg");

            smoothAudioTransition();

            setTimeout(() => {
                introWrapper.style.display = "none";
                document.body.classList.remove("locked");
                mainContent.classList.add("visible");

                document.querySelectorAll('#main-content video').forEach(v => v.play().catch(() => { }));
                sceneContents.forEach(el => revealObserver.observe(el));
            }, 1800);

        }, 12500);
    }

    startBtn.addEventListener("click", startCinematicExperience);
});
