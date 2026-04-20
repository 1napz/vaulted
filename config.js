// ใส่ค่าของคุณตรงนี้ที่เดียวพอ ถ้า Key หลุดอีกก็มาแก้ไฟล์นี้ไฟล์เดียว
export const SUPABASE_URL = 'https://yzogzgvlwmuncbaubzxf.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publish_xxx'; // << ใช้ Publishable Key เท่านั้น

export const CATEGORY_NAMES = {
    shoes: 'รองเท้า/แฟชั่น', 
    headphones: 'หูฟัง/แกดเจ็ต', 
    watch: 'นาฬิกา/แอคเซสเซอรี่',
    camera: 'กล้อง/อุปกรณ์', 
    fashion: 'แฟชั่น/เสื้อผ้า', 
    beauty: 'บิวตี้/สกินแคร์', 
    general: 'ทั่วไป'
};

export const HASHTAG_DB = {
    shoes: ['#รองเท้า', '#sneakerhead', '#outfit', '#สตรีทแฟชั่น', '#ของมันต้องมี', '#ฟีดดดด', '#tiktokthailand'],
    headphones: ['#หูฟัง', '#gadget', '#เพลง', '#เกมมิ่ง', '#unbox', '#ฟีดดดด', '#tiktokthailand'],
    watch: ['#นาฬิกา', '#accessory', '#luxury', '#tech', '#outfit', '#ฟีดดดด'],
    camera: ['#กล้อง', '#ถ่ายรูป', '#vlog', '#contentcreator', '#photography', '#ฟีดดดด'],
    fashion: ['#แฟชั่น', '#outfit', '#แต่งตัว', '#ป้ายยา', '#ของดีบอกต่อ', '#ฟีดดดด', '#tiktokthailand'],
    beauty: ['#สกินแคร์', '#เครื่องสำอาง', '#รีวิวบิวตี้', '#howto', '#glowup', '#ฟีดดดด', '#tiktokthailand'],
    general: ['#TikTokMadeMeBuyIt', '#ป้ายยา', '#รีวิวของดี', '#ของมันต้องมี', '#ถูกและดี', '#ฟีดดดด', '#tiktokthailand']
};

export const PROMPT_TEMPLATES = [
    `Create a 5-second cinematic product video. Subject: {name}. Camera slowly orbits 360 degrees around product, smooth zoom in on key detail. Premium studio lighting, 4K, shallow depth of field, TikTok viral style.`,
    `Dynamic 5-second ad for {name}. Start with close-up macro shot of texture, then quick zoom out revealing full product. Add subtle particle effects, dramatic lighting, luxury commercial style.`,
    `Trendy TikTok unboxing style video, 5 seconds. Hand places {name} on clean surface, camera does quick whip pan to product, then slow motion spin. Bright natural lighting, Gen-Z aesthetic.`,
    `ASMR product showcase for {name}. 5-second video, ultra close-up, soft lighting, satisfying slow movement. Focus on material texture and premium feel. No text overlay.`,
    `Before-After transformation hook, 5 seconds. Start with blurry dark shot, then sudden reveal of {name} in perfect lighting with sparkle effect. High energy, TikTok trend style.`
];

export const HIGH_PERF_NEGATIVE = "text, watermark, logo, blurry, low quality, distorted, ugly, bad anatomy, extra limbs, deformed";
