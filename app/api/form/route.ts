import { NextRequest, NextResponse } from 'next/server';
import { saveFormDataToSheets } from '@/app/lib/google-sheets';

export const runtime = 'nodejs';

// ===== Rate limiting (en memoria) =====
type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 min

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const ip = xff.split(',')[0]?.trim();
    if (ip) return ip;
  }
  const xri = req.headers.get('x-real-ip')?.trim();
  if (xri) return xri;
  return null;
}

function getRateLimitKey(req: NextRequest, email?: string): string {
  const ip = getClientIp(req);
  if (ip) return `ip:${ip}`;
  const ua = (req.headers.get('user-agent') || 'no-ua').slice(0, 120);
  const e = (email || 'no-email').toLowerCase().slice(0, 120);
  return `fallback:${ua}:${e}`;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 0, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_ATTEMPTS) return true;
  return false;
}

function incrementRateLimit(key: string): void {
  const entry = attempts.get(key);
  if (entry) {
    entry.count += 1;
  }
}

function cleanupAttempts(maxToScan = 50) {
  const now = Date.now();
  let scanned = 0;
  for (const [k, v] of attempts) {
    if (now > v.resetAt) attempts.delete(k);
    scanned++;
    if (scanned >= maxToScan) break;
  }
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    cleanupAttempts();

    // Parse body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return badRequest('Invalid JSON body');
    }

    const { email, telegramHandle, organisation, targetTVL, selectedProducts } = body;

    // Validaciones básicas
    if (typeof email !== 'string' || !email.trim()) {
      return badRequest('Email is required');
    }

    if (typeof telegramHandle !== 'string' || !telegramHandle.trim()) {
      return badRequest('Telegram Handle is required');
    }

    if (typeof organisation !== 'string' || !organisation.trim()) {
      return badRequest('Organisation is required');
    }

    if (typeof targetTVL !== 'number' || targetTVL < 0 || targetTVL > 100) {
      return badRequest('Target TVL must be a number between 0 and 100');
    }

    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      return badRequest('At least one product must be selected');
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailNorm = email.trim().toLowerCase();
    if (!emailRegex.test(emailNorm)) {
      return badRequest('Invalid email format');
    }

    // Rate limit
    const rlKey = getRateLimitKey(req, emailNorm);
    if (isRateLimited(rlKey)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Guardar en Google Sheets
    const success = await saveFormDataToSheets({
      email: emailNorm,
      telegramHandle: telegramHandle.trim(),
      organisation: organisation.trim(),
      targetTVL: Number(targetTVL),
      selectedProducts: selectedProducts.map((p: string) => p.trim()).filter(Boolean),
    });

    if (!success) {
      incrementRateLimit(rlKey);
      return NextResponse.json(
        { error: 'Failed to save form data. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Form submitted successfully' });
  } catch (err) {
    console.error('Form submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
