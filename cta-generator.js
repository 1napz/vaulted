// cta-generator.js - แยกฟังก์ชัน Intro และ CTA
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const introBtn = document.getElementById('genIntroBtn');
        const ctaBtn = document.getElementById('genCTABtn');

        if (!introBtn) console.warn('ไม่พบปุ่ม genIntroBtn');
        if (!ctaBtn) console.warn('ไม่พบปุ่ม genCTABtn');

        // ========== ฟังก์ชันสร้างวิดีโอ Intro (2.5 วินาที) ==========
        window.generateIntroVideo = async function() {
            // ... (โค้ดเต็มตามที่ให้ไว้ก่อนหน้า) ...
        };

        // ========== ฟังก์ชันสร้างวิดีโอ CTA (5.5 วินาที) ==========
        window.generateCTAVideo = async function() {
            // ... (โค้ดเต็มตามที่ให้ไว้ก่อนหน้า) ...
        };

        if (introBtn) introBtn.addEventListener('click', () => window.generateIntroVideo());
        if (ctaBtn) ctaBtn.addEventListener('click', () => window.generateCTAVideo());
    });
})();