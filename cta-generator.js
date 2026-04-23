// cta-generator.js - Call To Action Video Generator (Canvas + MediaRecorder)
// เพิ่ม Intro แสดงรูปสินค้า + ชื่อสินค้า ก่อนเข้า CTA
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const ctaBtn = document.getElementById('genCTABtn');
        if (!ctaBtn) {
            console.warn('ไม่พบปุ่ม genCTABtn');
            return;
        }

        window.generateCallToActionScene = async function() {
            if (typeof selectedFiles === 'undefined' || selectedFiles.length === 0) {
                alert('กรุณาอัปโหลดรูปสินค้าก่อน');
                return;
            }

            const productName = (typeof brandInput !== 'undefined' && brandInput) ? brandInput.value.trim() : 'สินค้า';
            const price = prompt('💰 กรอกราคาสินค้า (บาท)', '299');
            if (!price) return;
            
            const discount = prompt('🔥 ส่วนลด (%) (ถ้ามี, ไม่มีกดยกเลิก)', '');
            const discountPercent = discount ? parseInt(discount) : 0;
            const ctaText = prompt('📢 ข้อความ Call to Action', '⚡ สินค้าจำกัด! ⚡');

            const statusDiv = document.getElementById('statusText');
            const previewGridDiv = document.getElementById('previewGrid');
            const generateMainBtn = document.getElementById('generateBtn');

            if (statusDiv) {
                statusDiv.classList.remove('hidden');
                statusDiv.innerHTML = '🎬 กำลังสร้างวิดีโอ Intro + CTA... (8 วินาที)';
            }
            if (ctaBtn) ctaBtn.disabled = true;
            if (generateMainBtn) generateMainBtn.disabled = true;

            const totalDurationMs = 8000;   // 8 วินาที
            const introDurationMs = 2500;   // 2.5 วินาที สำหรับ Intro
            const ctaDurationMs = totalDurationMs - introDurationMs; // 5.5 วินาที
            
            const startTime = performance.now();

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1080;
            canvas.height = 1920;
            
            const stream = canvas.captureStream(30);
            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/mp4' });
                const videoUrl = URL.createObjectURL(blob);
                if (statusDiv) {
                    statusDiv.innerHTML = `
                        ✅ สร้างวิดีโอสำเร็จ! 
                        <a href="${videoUrl}" target="_blank" class="underline text-blue-400">▶ เปิดดูวิดีโอ</a> | 
                        <a href="${videoUrl}" download="cta-${Date.now()}.mp4" class="underline text-purple-400">💾 ดาวน์โหลด</a>
                        <br><span class="text-xs text-gray-500">🎬 Intro 2.5 วินาที + CTA 5.5 วินาที</span>
                    `;
                }
                if (previewGridDiv) {
                    const videoEl = document.createElement('video');
                    videoEl.src = videoUrl;
                    videoEl.controls = true;
                    videoEl.autoplay = true;
                    videoEl.loop = true;
                    videoEl.className = 'w-full rounded-xl mt-3 col-span-3';
                    previewGridDiv.innerHTML = '';
                    previewGridDiv.appendChild(videoEl);
                }
                if (typeof saveFilename === 'function') {
                    saveFilename(`cta-${productName}-${Date.now()}`);
                }
                if (ctaBtn) ctaBtn.disabled = false;
                if (generateMainBtn) generateMainBtn.disabled = false;
            };

            recorder.start();

            const productImg = new Image();
            productImg.src = selectedFiles[0].url;
            await productImg.decode();

            // ---------- 1. ฟังก์ชันวาด Intro ----------
            function drawIntroFrame(ctx, canvas, img, name, elapsed) {
                const introProgress = Math.min(elapsed / introDurationMs, 1); // 0→1 ภายใน 2.5 วิ
                
                // พื้นหลังขาวนวล
                ctx.fillStyle = '#f8f9fa';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // โลโก้จางๆ มุมบนซ้าย (fade in)
                const logoAlpha = Math.min(elapsed / 500, 0.5);
                ctx.font = 'bold 28px "Noto Sans Thai"';
                ctx.fillStyle = `rgba(0, 0, 0, ${logoAlpha})`;
                ctx.fillText('Crystal Castle', 30, 70);
                
                // รูปสินค้า ซูมเข้าง่ายๆ และหมุนเล็กน้อย
                const scale = 0.55 + introProgress * 0.35;        // เริ่ม 0.55 → 0.9
                const rotate = introProgress * Math.PI * 0.08;     // หมุนเล็กน้อย
                const w = canvas.width * scale;
                const h = canvas.height * scale;
                
                ctx.save();
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(rotate);
                ctx.drawImage(img, -w/2, -h/2, w, h);
                ctx.restore();
                
                // ชื่อสินค้า ค่อย ๆ เลื่อนขึ้นมาจากข้างล่าง
                if (elapsed > 400) {
                    const slideProgress = Math.min((elapsed - 400) / 1600, 1);
                    const y = canvas.height - 150 * (1 - slideProgress);
                    ctx.font = 'bold 64px "Noto Sans Thai"';
                    ctx.fillStyle = '#000000';
                    ctx.shadowBlur = 0;
                    ctx.fillText(name, 60, y);
                }
                
                // ข้อความเพิ่มเติม (Coming soon...)
                if (introProgress > 0.85) {
                    ctx.font = '28px "Noto Sans Thai"';
                    ctx.fillStyle = '#666';
                    ctx.fillText('⚡ พร้อมลุย! ⚡', canvas.width - 200, canvas.height - 80);
                }
            }
            
            // ---------- 2. ฟังก์ชันวาด CTA ----------
            function drawCTAFrame(ctx, canvas, img, name, price, discountPercent, ctaText, elapsed) {
                const ctaElapsed = Math.min(Math.max(elapsed, 0), ctaDurationMs);
                const progress = ctaElapsed / ctaDurationMs;
                
                // พื้นหลัง gradient สีสด
                const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                grad.addColorStop(0, '#ff6b6b');
                grad.addColorStop(1, '#ff4757');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // รูปสินค้า (Zoom in + sway)
                const scale = 0.65 + progress * 0.3;
                const imgW = canvas.width * scale;
                const imgH = canvas.height * scale;
                const sway = Math.sin(ctaElapsed / 100 * 1.5) * 5;
                ctx.save();
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(sway * Math.PI/180);
                ctx.drawImage(img, -imgW/2, -imgH/2, imgW, imgH);
                ctx.restore();
                
                // Overlay ด้านล่าง
                const overlayGrad = ctx.createLinearGradient(0, canvas.height - 450, 0, canvas.height);
                overlayGrad.addColorStop(0, 'rgba(0,0,0,0)');
                overlayGrad.addColorStop(1, 'rgba(0,0,0,0.8)');
                ctx.fillStyle = overlayGrad;
                ctx.fillRect(0, canvas.height - 450, canvas.width, 450);
                
                // ชื่อสินค้า (อยู่ด้านล่าง)
                ctx.font = 'bold 58px "Noto Sans Thai"';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(name, 60, canvas.height - 250);
                
                // ราคา (bounce)
                const bounce = Math.sin(ctaElapsed / 100 * 15) * 8;
                ctx.font = 'bold 94px "Noto Sans Thai"';
                ctx.fillStyle = '#f9ca24';
                ctx.fillText(`฿${price}`, 70, canvas.height - 120 + bounce);
                
                // ส่วนลด (blink)
                if (discountPercent > 0 && Math.sin(ctaElapsed / 100 * 18) > 0) {
                    ctx.font = 'bold 48px "Noto Sans Thai"';
                    ctx.fillStyle = '#ff4757';
                    ctx.fillText(`🔥 ลด ${discountPercent}% 🔥`, 150, canvas.height - 50);
                }
                
                // CTA กระพริบ
                if (Math.sin(ctaElapsed / 100 * 8) > 0 && ctaElapsed > 1000) {
                    ctx.font = 'bold 58px "Noto Sans Thai"';
                    ctx.fillStyle = '#ffeb3b';
                    ctx.fillText(ctaText, 80, canvas.height - 320);
                }
                
                // กดเลย
                ctx.font = '42px "Noto Sans Thai"';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('👇 กดเลย 👇', canvas.width/2 - 120, canvas.height - 190);
                
                // โลโก้เล็กมุมล่างขวา
                ctx.font = '24px "Noto Sans Thai"';
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.fillText('Crystal Castle AI', canvas.width - 220, canvas.height - 40);
            }
            
            // ---------- 3. Main Animation Loop ----------
            const drawFrame = (now) => {
                const elapsed = now - startTime;
                
                if (elapsed < introDurationMs) {
                    // อยู่ในช่วง Intro
                    drawIntroFrame(ctx, canvas, productImg, productName, elapsed);
                } else if (elapsed < totalDurationMs) {
                    // อยู่ในช่วง CTA
                    const ctaElapsed = elapsed - introDurationMs;
                    drawCTAFrame(ctx, canvas, productImg, productName, price, discountPercent, ctaText, ctaElapsed);
                } else {
                    recorder.stop();
                    return;
                }
                requestAnimationFrame(drawFrame);
            };
            
            requestAnimationFrame(drawFrame);
        };

        ctaBtn.addEventListener('click', () => {
            if (typeof window.generateCallToActionScene === 'function') {
                window.generateCallToActionScene();
            } else {
                console.error('generateCallToActionScene ไม่ถูกกำหนด');
            }
        });
    });
})();