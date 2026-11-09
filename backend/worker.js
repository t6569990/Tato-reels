const SESSION_DAYS = 365;
const RESET_MINUTES = 20;
const PBKDF2_ITERATIONS = 310000;

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers } });
}
function randomToken(bytes = 32) {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return [...data].map(v => v.toString(16).padStart(2, "0")).join("");
}
async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(v => v.toString(16).padStart(2, "0")).join("");
}
async function derivePassword(password, saltHex) {
  const salt = Uint8Array.from(saltHex.match(/.{2}/g), x => parseInt(x, 16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITERATIONS }, key, 256);
  return [...new Uint8Array(bits)].map(v => v.toString(16).padStart(2, "0")).join("");
}
function cookie(token, maxAge = SESSION_DAYS * 86400) {
  return `tr_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
function getCookie(request) {
  const raw = request.headers.get("Cookie") || "";
  const match = raw.match(/(?:^|;\s*)tr_session=([a-f0-9]+)/);
  return match?.[1] || null;
}
async function currentUser(request, env) {
  const token = getCookie(request);
  if (!token) return null;
  return env.DB.prepare(`SELECT u.id,u.email FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?`)
    .bind(await sha256(token), new Date().toISOString()).first();
}
async function sendResetEmail(env, email, token) {
  if (!env.RESEND_API_KEY || !env.APP_URL) throw new Error("EMAIL_NOT_CONFIGURED");
  const link = `${env.APP_URL.replace(/\/$/, "")}/?reset=${encodeURIComponent(token)}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.EMAIL_FROM || "Tato Reels <onboarding@resend.dev>",
      to: [email],
      subject: "Recupera tu contraseña de Tato Reels",
      html: `<div style="font-family:Arial,sans-serif;background:#100910;color:#fff;padding:28px;border-radius:16px"><h1 style="color:#ff3154">TATO REELS</h1><p>Recibimos una solicitud para cambiar tu contraseña.</p><p><a href="${link}" style="display:inline-block;background:#e50935;color:#fff;padding:14px 20px;border-radius:9px;text-decoration:none">Crear nueva contraseña</a></p><p>Este enlace vence en 20 minutos y solo puede usarse una vez. Si no lo solicitaste, ignora este correo.</p></div>`
    })
  });
  if (!response.ok) throw new Error("EMAIL_SEND_FAILED");
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
async function verifyTurnstile(request, env, token) {
  if (!env.TURNSTILE_SECRET) return true; // Activar al configurar Turnstile en Cloudflare.
  if (!token) return false;
  const form = new FormData();
  form.set("secret", env.TURNSTILE_SECRET);
  form.set("response", token);
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) form.set("remoteip", ip);
  const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  const data = await result.json();
  return data.success === true;
}
async function body(request) {
  try { return await request.json(); } catch { return {}; }
}
async function handle(request, env) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/")) return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Tato Reels API", { status: 200 });

  if (request.method === "GET" && url.pathname === "/api/me") {
    const user = await currentUser(request, env);
    return user ? json({ authenticated: true, user }) : json({ authenticated: false }, 401);
  }

  if (request.method === "POST" && url.pathname === "/api/register") {
    const data = await body(request);
    const email = String(data.email || "").trim().toLowerCase();
    const password = String(data.password || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Escribe un correo electrónico válido." }, 400);
    if (password.length < 8 || password.length > 128) return json({ error: "La contraseña debe tener entre 8 y 128 caracteres." }, 400);
    if (!await verifyTurnstile(request, env, data.turnstileToken)) return json({ error: "No se pudo validar la verificación humana. Inténtalo otra vez." }, 400);
    const exists = await env.DB.prepare("SELECT id FROM users WHERE email=? COLLATE NOCASE").bind(email).first();
    if (exists) return json({ error: "Ese correo ya está registrado." }, 409);
    const id = crypto.randomUUID();
    const salt = randomToken(16);
    const hash = await derivePassword(password, salt);
    try {
      await env.DB.prepare("INSERT INTO users(id,email,password_hash,password_salt) VALUES(?,?,?,?)").bind(id, email, hash, salt).run();
    } catch { return json({ error: "No se pudo crear la cuenta. Revisa si el correo ya está registrado." }, 409); }
    const session = randomToken();
    await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)").bind(await sha256(session), id, new Date(Date.now() + SESSION_DAYS * 86400000).toISOString()).run();
    await env.DB.prepare("INSERT INTO user_events(user_id,event_type) VALUES(?, 'register')").bind(id).run();
    return json({ ok: true, user: { id, email } }, 201, { "set-cookie": cookie(session) });
  }

  if (request.method === "POST" && url.pathname === "/api/login") {
    const data = await body(request);
    const email = String(data.email || "").trim().toLowerCase();
    const password = String(data.password || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) return json({ error: "Escribe tu correo y contraseña." }, 400);
    if (!await verifyTurnstile(request, env, data.turnstileToken)) return json({ error: "No se pudo validar la verificación humana. Inténtalo otra vez." }, 400);
    const user = await env.DB.prepare("SELECT * FROM users WHERE email=? COLLATE NOCASE").bind(email).first();
    const salt = user?.password_salt || "00000000000000000000000000000000";
    const candidate = await derivePassword(password, salt);
    if (!user || candidate !== user.password_hash) return json({ error: "Correo o contraseña incorrectos." }, 401);
    const session = randomToken();
    await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)").bind(await sha256(session), user.id, new Date(Date.now() + SESSION_DAYS * 86400000).toISOString()).run();
    await env.DB.prepare("UPDATE users SET last_login_at=? WHERE id=?").bind(new Date().toISOString(), user.id).run();
    await env.DB.prepare("INSERT INTO user_events(user_id,event_type) VALUES(?, 'login')").bind(user.id).run();
    return json({ ok: true, user: { id: user.id, email: user.email } }, 200, { "set-cookie": cookie(session) });
  }

  if (request.method === "POST" && url.pathname === "/api/logout") {
    const token = getCookie(request);
    if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await sha256(token)).run();
    return json({ ok: true }, 200, { "set-cookie": cookie("", 0) });
  }

  if (request.method === "POST" && url.pathname === "/api/forgot-password") {
    const data = await body(request);
    const email = String(data.email || "").trim().toLowerCase();
    if (!email) return json({ error: "Escribe el correo de tu cuenta." }, 400);
    if (!env.RESEND_API_KEY || !env.APP_URL) return json({ error: "El servicio de correo aún no está configurado." }, 503);
    const user = await env.DB.prepare("SELECT id,email FROM users WHERE email=? COLLATE NOCASE").bind(email).first();
    // Respuesta genérica para no revelar si un correo está registrado.
    if (user) {
      const token = randomToken();
      await env.DB.prepare("DELETE FROM password_resets WHERE user_id=?").bind(user.id).run();
      await env.DB.prepare("INSERT INTO password_resets(token_hash,user_id,expires_at) VALUES(?,?,?)").bind(await sha256(token), user.id, new Date(Date.now() + RESET_MINUTES * 60000).toISOString()).run();
      try { await sendResetEmail(env, user.email, token); }
      catch (error) { console.error("Reset email error", error.message); return json({ error: "El servicio de correo aún no está configurado." }, 503); }
    }
    return json({ ok: true, message: "Si el correo está registrado, recibirás un enlace para recuperar tu cuenta." });
  }

  if (request.method === "POST" && url.pathname === "/api/reset-password") {
    const data = await body(request);
    const token = String(data.token || "");
    const password = String(data.password || "");
    if (!token || password.length < 8 || password.length > 128) return json({ error: "El enlace no es válido o la contraseña no cumple los requisitos." }, 400);
    const reset = await env.DB.prepare("SELECT user_id FROM password_resets WHERE token_hash=? AND expires_at>? AND used_at IS NULL").bind(await sha256(token), new Date().toISOString()).first();
    if (!reset) return json({ error: "El enlace venció o ya fue utilizado. Solicita uno nuevo." }, 400);
    const salt = randomToken(16);
    const hash = await derivePassword(password, salt);
    await env.DB.prepare("UPDATE users SET password_hash=?,password_salt=? WHERE id=?").bind(hash, salt, reset.user_id).run();
    await env.DB.prepare("UPDATE password_resets SET used_at=? WHERE token_hash=?").bind(new Date().toISOString(), await sha256(token)).run();
    await env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(reset.user_id).run();
    return json({ ok: true, message: "Contraseña actualizada. Ya puedes iniciar sesión." });
  }

  if (request.method === "POST" && url.pathname === "/api/feedback") {
    const origin=request.headers.get("Origin");
    if(origin&&origin!==url.origin)return json({error:"Origen no permitido."},403);
    if(Number(request.headers.get("Content-Length")||0)>12000)return json({error:"La opinión es demasiado larga."},413);
    if(!env.RESEND_API_KEY||!env.FEEDBACK_TO)return json({error:"El buzón de opiniones aún no está configurado."},503);
    const data=await body(request);
    if(String(data.website||"").trim())return json({ok:true});
    const rating=Number(data.rating),comment=String(data.comment||"").trim().slice(0,1000),liked=String(data.liked||"").trim().slice(0,300),improve=String(data.improve||"").trim().slice(0,500);
    if(!Number.isInteger(rating)||rating<1||rating>5)return json({error:"Selecciona una calificación de 1 a 5 estrellas."},400);
    if(!comment&&!liked&&!improve)return json({error:"Cuéntanos brevemente cómo fue tu experiencia."},400);
    const details=[["Calificación",rating+"/5 estrellas"],["Lo que más gustó",liked||"Sin respuesta"],["Qué mejorar",improve||"Sin respuesta"],["Comentarios",comment||"Sin comentarios"],["Fecha",new Date().toISOString()]];
    const html="<div style=\"font-family:Arial,sans-serif;color:#201a2b\"><h2>Opinión nueva · Tato Reels Creator</h2>"+details.map(([label,value])=>"<p><strong>"+escapeHtml(label)+":</strong><br>"+escapeHtml(value).replace(/\\n/g,"<br>")+"</p>").join("")+"</div>";
    const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:env.EMAIL_FROM||"Tato Reels <onboarding@resend.dev>",to:[env.FEEDBACK_TO],subject:"Opinión de usuario · Tato Reels Creator",html})});
    if(!response.ok){console.error("Feedback email error",response.status,(await response.text()).slice(0,500));return json({error:"No se pudo enviar la opinión. Inténtalo más tarde."},502);}
    return json({ok:true,message:"¡Gracias por compartir tu experiencia!"});
  }

  if (request.method === "GET" && url.pathname === "/api/admin/stats") {
    const user = await currentUser(request, env);
    if (!user || !env.ADMIN_USER_ID || user.id !== env.ADMIN_USER_ID) return json({ error: "No autorizado." }, 403);
    const stats = await env.DB.prepare("SELECT COUNT(*) AS total_users, SUM(CASE WHEN date(created_at)=date('now') THEN 1 ELSE 0 END) AS registrations_today FROM users").first();
    const events = await env.DB.prepare("SELECT event_type,COUNT(*) AS total FROM user_events GROUP BY event_type").all();
    return json({ stats, events: events.results || [] });
  }

  return json({ error: "Ruta no encontrada." }, 404);
}
export default { async fetch(request, env) {
  try { return await handle(request, env); }
  catch (error) { console.error("Tato Reels API error", error); return json({ error: "Ocurrió un error interno. Inténtalo más tarde." }, 500); }
} };
