// Elements
const fileInput = document.getElementById('fileInput');
const filenameInput = document.getElementById('filenameInput');
const promptInput = document.getElementById('promptInput');
const genPromptBtn = document.getElementById('genPromptBtn');
const genFALBtn = document.getElementById('genFALBtn');
const genHFBtn = document.getElementById('genHFBtn');
const statusText = document.getElementById('statusText');
const imagePreview = document.getElementById('imagePreview');

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
  'default': 'A professional model showcasing this {item}, clean studio background, 4k, commercial photography style'
};

// กดปุ่ม Gen Prompt
genPromptBtn?.addEventListener('click', () => {
  const
// Elements เพิ่ม
const categorySelect = document.getElementById('categorySelect');
const brandInput = document.getElementById('brandInput');

// ออโต้สร้างชื่อไฟล์ yyyymmdd-Category-Brand
function updateFilename() {
  const now = new Date();
  const yyyymmdd = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');

  const category = categorySelect?.value || 'Product';
  const brand = brandInput?.value.trim().replace(/\s+/g, '') || 'Brand';

  filenameInput.value = `${yyyymmdd}-${category}-${brand}`;
}

// รันครั้งแรก + เวลาเปลี่ยน dropdown/input
document.addEventListener('DOMContentLoaded', updateFilename);
categorySelect?.addEventListener('change', updateFilename);
brandInput?.addEventListener('input', updateFilename);

// อัพเดตทุกนาที เผื่อข้ามวัน
setInterval(updateFilename, 60000);
