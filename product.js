// Elements
const fileInput = document.getElementById('fileInput');
const filenameInput = document.getElementById('filenameInput');
const promptInput = document.getElementById('promptInput');
const genPromptBtn = document.getElementById('genPromptBtn');
const genFALBtn = document.getElementById('genFALBtn');
const genHFBtn = document.getElementById('genHFBtn');
const statusText = document.getElementById('statusText');
const imagePreview = document.getElementById('imagePreview');
const categorySelect = document.getElementById('categorySelect');
const brandInput = document.getElementById('brandInput');
const dateInput = document.getElementById('dateInput');

// ออโต้ชื่อไฟล์ yyyymmdd-Category-Brand ตามเวลาจริง
function updateFilename() {
  const now = new Date();
  const yyyymmdd = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');

  if (dateInput) dateInput.value = yyyymmdd;

  const category = categorySelect?.value || 'Product';
  const brand = brandInput?.value.trim().replace(/\s+/g, '') || 'Brand';

  filenameInput.value = `${yyyymmdd}-${category}-${brand}`;
}

// รันครั้งแรก + เวลาเปลี่ยน dropdown/input
document.addEventListener('DOMContentLoaded', updateFilename);
categorySelect?.addEventListener('change', updateFilename);
brandInput?.addEventListener('input', updateFilename);
// อัพเดททุกนาที เผื่อข้ามวัน
setInterval(updateFilename, 60000);

// LocalStorage เช็คชื่อซ้ำ
function checkDuplicateName(name) {
  const saved = JSON.parse(localStorage.getItem('filenames') || '[]');
  return saved.includes(name);
}

function saveFilename(name) {
  const saved = JSON.parse(localStorage.getItem('filenames') || '[]');
  if (!saved.includes(name)) {
    saved.push(name);
    localStorage.setItem('filenames', JSON.stringify(saved));
  }
}

// พรีวิวรูป
fileInput?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && imagePreview) {
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.classList.remove('hidden');
  }
});

// Template Prompt ตาม Category
const promptTemplates = {
  'Menswear': 'A male model confidently walking on a fashion runway, wearing this {item}, cinematic lighting, 4k, high fashion, smooth fabric movement',
  'Womenswear': 'A female model strutting on a catwalk, wearing this {item}, elegant pose, studio lighting, 4k, vogue style, fabric flowing naturally',
  'Accessories': 'Close-up product shot of this {item} on rotating platform, luxury studio lighting, 4k, slow motion, detailed texture',
  'Shoes': 'Model walking in this {item}, focus on footwear, runway floor reflection, 4k, dynamic camera movement',
  'Bags': 'Product showcase of this {item} on pedestal, luxury boutique lighting, 4k, 360 view, leather texture detail',
  'default': 'A professional model showcasing this {item}, clean studio background, 4k, commercial photography style'
};

// กดปุ่ม Gen Prompt
genPromptBtn?.addEventListener('click', () => {
  const filename = filenameInput.value.trim();
  if (!filename) {
    alert('ใส่ชื่อไฟล์ก่อนนะ จะได้รู้ว่าเป็นสินค้าอะไร');
    return;
  }

  const parts = filename.split('-');
  const category = parts[1] || 'default';
  const brand = parts[2] || 'item';

  let template = promptTemplates[category] || promptTemplates['default'];
  template = template.replace('{item}', brand.toLowerCase());

  promptInput.value = template;
  promptInput.classList.add('ring-2', 'ring-green-400');
  setTimeout(() => promptInput.classList.remove('ring-2', 'ring-green-400'), 1000);

  genPromptBtn.textContent = '✅ Gen แล้ว!';
  setTimeout(() => genPromptBtn.textContent = '✨ Gen Prompt', 2000);
});

// ฟังก์ชันหลักเจนวิดีโอ
async function generateVideo(engine) {
  const file = fileInput.files[0];
  const customFilename = filenameInput.value.trim();
  const prompt = promptInput.value.trim();

  if (!file || !customFilename || !prompt) {
    alert('อัพรูป ตั้งชื่อ และใส่ Prompt ให้ครบก่อน');
    return;
  }

  if (checkDuplicateName(customFilename)) {
    if (!confirm(`ชื่อ ${customFilename} เคยใช้แล้ว จะเจนทับไหม?`)) return;
  }

  // Disable ปุ่ม + แสดงสถานะ
  genFALBtn.disabled = true;
  genHFBtn.disabled = true;
  statusText.classList.remove('hidden');
  statusText.textContent = engine === 'FAL' ? '🚀 กำลังส่งไป FAL...' : '🆓 กำลังส่งไป Hugging Face อาจนาน 3-10 นาที...';

  try {
    // 1. อัพรูปเข้า Vercel Blob
    const fileExt = file.name.split('.').pop();
    const finalFilename = `${customFilename}.${fileExt}`;

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'x-filename': finalFilename,
        'Content-Type': file.type
      },
      body: file
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      throw new Error(err.error || 'Upload failed');
    }
    const { url: imageUrl } = await uploadRes.json();

    statusText.textContent = engine === 'FAL' ? '⚡️ FAL กำลังเจนคลิป 1-2 นาที...' : '⏳ HF กำลังเจน อาจนานถึง 10 นาที รอหน่อยนะ...';

    // 2. เลือก API ตาม Engine
    const apiUrl = engine === 'FAL' ? '/api/generate' : '/api/HuggingFace';
    const genRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, prompt, filename: customFilename })
    });

    const data = await genRes.json();
    if (!genRes.ok) throw new Error(data.error || 'Generate failed');

    // 3. โหลดคลิป
    statusText.textContent = '✅ เจนเสร็จ กำลังโหลด...';
    const a = document.createElement('a');
    a.href = data.video_url;
    a.download = `${customFilename}-${engine}.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    saveFilename(customFilename);
    statusText.textContent = `✅ สำเร็จ! ใช้ ${data.engine || engine}`;

  } catch (err) {
    statusText.textContent = `❌ Error: ${err.message}`;
    if (err.message.includes('Model is loading') || err.message.includes('503')) {
      statusText.textContent += ' - โมเดลกำลังโหลด ลองกดใหม่ใน 20 วิ';
    }
    console.error(err);
  } finally {
    genFALBtn.disabled = false;
    genHFBtn.disabled = false;
    setTimeout(() => statusText.classList.add('hidden'), 8000);
  }
}

// ผูกปุ่ม
genFALBtn?.addEventListener('click', () => generateVideo('FAL'));
genHFBtn?.addEventListener('click', () => generateVideo('HF'));
