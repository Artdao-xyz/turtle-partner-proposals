import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { saveEmailToSheets } from '@/app/lib/google-sheets';

export const runtime = 'nodejs';

// ===== Rate limiting (en memoria) =====
// Nota: en serverless/múltiples instancias esto no es “a prueba de balas”.
// En prod ideal usar Redis/KV/WAF, pero esto es un buen mínimo.
type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 min
const FAIL_DELAY_MS = 600; // delay al fallar credenciales

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    // "client, proxy1, proxy2" -> nos quedamos con la primera
    const ip = xff.split(',')[0]?.trim();
    if (ip) return ip;
  }
  const xri = req.headers.get('x-real-ip')?.trim();
  if (xri) return xri;

  // Si tu plataforma provee otro header confiable, lo podés sumar acá
  return null;
}

// Key de rate limit: preferimos IP. Si no hay IP, caemos a UA+email (evita bucket global).
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

// Limpieza oportunista para que el Map no crezca infinito en servidores “long-lived”
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

    const email = body?.email;
    const password = body?.password;

    // Validaciones básicas de tipo
    if (typeof email !== 'string' || typeof password !== 'string') {
      return badRequest('Email and password are required');
    }

    // Normalización y límites (anti abuso)
    const emailNorm = email.trim().toLowerCase();
    if (emailNorm.length < 3 || emailNorm.length > 254) {
      return badRequest('Invalid email format');
    }
    if (password.length < 1 || password.length > 200) {
      return badRequest('Invalid credentials');
    }

    // Validación simple de email (si querés capturar email sí o sí)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNorm)) {
      return badRequest('Invalid email format');
    }

    // Rate limit (después de validar payload básico)
    const rlKey = getRateLimitKey(req, emailNorm);
    if (isRateLimited(rlKey)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const passwordHash = process.env.PASSWORD_HASH;
    if (!passwordHash) {
      console.error('PASSWORD_HASH not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Validar formato de bcrypt hash (previene misconfiguraciones)
    // Los hashes de bcrypt siempre empiezan con $2a$, $2b$, o $2y$ seguido del cost
    const bcryptHashPattern = /^\$2[ayb]\$\d{2}\$.{53}$/;
    if (!bcryptHashPattern.test(passwordHash)) {
      console.error('PASSWORD_HASH has invalid bcrypt format');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const ok = await bcrypt.compare(password, passwordHash);

    if (!ok) {
      // Incrementar rate limit solo en fallos (no en éxitos)
      incrementRateLimit(rlKey);
      // delay para frenar brute force online
      await sleep(FAIL_DELAY_MS);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Autenticación exitosa - guardar email en Google Sheets (no bloquea si falla)
    saveEmailToSheets(emailNorm).catch((err) => {
      console.error('Failed to save email to Google Sheets:', err);
      // No fallamos la autenticación si falla guardar el email
    });

    // Autenticación exitosa - no incrementar rate limit
    return NextResponse.json({ success: true, message: 'Authentication successful' });
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
