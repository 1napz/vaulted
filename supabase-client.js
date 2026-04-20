import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
   const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export async function uploadImageToStorage(file) {
    const filePath = `pika/${Date.now()}-${file.name}`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/vaulted/${filePath}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': file.type },
        body: file
    });
    if (!res.ok) throw new Error('Upload failed');
    return `${SUPABASE_URL}/storage/v1/object/public/vaulted/${filePath}`;
}

export async function generatePikaVideo(prompt, imageUrl) {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/pika-generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image_url: imageUrl })
    });
    return await res.json();
}

export async function checkPikaStatus(jobId) {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/pika-status?job_id=${jobId}`, {
        headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
    });
    return await res.json();
}

export async function getPikaCredits() {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/pika-status`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_credits' })
    });
    const data = await res.json();
    return data.credits || '-';
}

export async function fetchLogs() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pika_logs?select=*&order=created_at.desc&limit=10`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
    });
    return await res.json();
}
