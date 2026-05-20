import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const LEADS_URL  = "https://functions.poehali.dev/db14518b-e979-40fe-bd90-ecf77e38ef2a";
const PRODUCT_IMG = "https://cdn.poehali.dev/projects/6ffab839-a77a-46ed-82ea-5144b5e3eee4/files/aedf5b04-f404-4b35-9671-3ee87bee3f8b.jpg";
const BG_IMG      = "https://cdn.poehali.dev/projects/6ffab839-a77a-46ed-82ea-5144b5e3eee4/files/120a238a-0fc7-45ed-b5ac-69566a6e1eea.jpg";
const OZON_URL    = "https://www.ozon.ru/product/kapsuly-dlya-stirki-belya-kaiteki-s-konditsionerom-parfyumirovannye-aromat-sakura-dlya-tsvetnogo-3739682715/";

const REVIEWS = [
  { name: "Ольга М.",     rating: 5, text: "Запах просто волшебный! Бельё пахнет сакурой весь день. Цвет вещей не выгорает, как раньше.", date: "апрель 2025" },
  { name: "Светлана К.",  rating: 5, text: "Покупаю уже третью упаковку. Капсулы растворяются полностью, пятна отходят с первого раза.", date: "март 2025" },
  { name: "Наталья В.",   rating: 5, text: "Очень нежный цветочный аромат, не резкий. Ткань после стирки мягкая, как после кондиционера.", date: "май 2025" },
  { name: "Екатерина Д.", rating: 4, text: "Отличное средство. Брала для детских вещей — всё чисто, никаких раздражений. Аромат деликатный.", date: "апрель 2025" },
];

const FEATURES = [
  { icon: "Sparkles",  title: "Аромат сакуры",      desc: "Парфюмированный аромат японской сакуры держится на ткани до 24 часов.", color: "#e07090", bg: "rgba(224,112,144,0.1)"  },
  { icon: "Droplets",  title: "Кондиционер 2-в-1",  desc: "Стирка и кондиционирование в одной капсуле. Ткань мягкая после каждой стирки.", color: "#5f9e72", bg: "rgba(95,158,114,0.1)"  },
  { icon: "Palette",   title: "Защита цвета",        desc: "Специальная формула предотвращает выцветание и сохраняет насыщенность красок.", color: "#bf4d68", bg: "rgba(191,77,104,0.1)"  },
  { icon: "Shield",    title: "Мягко к коже",        desc: "Гипоаллергенный состав. Подходит для чувствительной кожи и детских вещей.", color: "#8b6baa", bg: "rgba(139,107,170,0.1)"  },
];

const STEPS = [
  { num: "01", icon: "Package",    title: "Положите капсулу", desc: "Одну капсулу прямо в барабан стиральной машины — до загрузки белья." },
  { num: "02", icon: "Shirt",      title: "Загрузите бельё",  desc: "Засыпьте цветное бельё поверх капсулы. Мерить и отсчитывать не нужно." },
  { num: "03", icon: "RotateCcw",  title: "Запустите стирку", desc: "Капсула растворяется при любой температуре — от 20 до 60°C." },
];

const FAQS = [
  { q: "Подходят ли для машин-автомат?",   a: "Да, капсулы Kaiteki разработаны для стиральных машин с горизонтальной и вертикальной загрузкой. Положите капсулу в барабан до загрузки белья." },
  { q: "При какой температуре стирать?",   a: "Капсулы растворяются при любой температуре — от 20°C до 60°C. Рекомендуем 30–40°C для лучшего сохранения аромата." },
  { q: "Безопасны ли для детских вещей?",  a: "Состав протестирован дерматологически. Без агрессивных красителей — подходит для детского белья и чувствительной кожи." },
  { q: "Сколько капсул в упаковке?",       a: "30 капсул — 30 полноценных стирок для загрузки 4–5 кг белья." },
];

/* ── Floating petal ──────────────────────────────────────────────────── */
function Petal({ left, delay, dur, size }: { left: string; delay: string; dur: string; size: number }) {
  return (
    <div className="absolute pointer-events-none" style={{
      left, top: -50,
      animation: `petal-fall ${dur} ${delay} linear infinite`,
      transform: `scale(${size})`,
    }}>
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <ellipse cx="8" cy="10" rx="6" ry="9" fill="rgba(224,112,144,0.5)" transform="rotate(-18 8 10)" />
        <ellipse cx="8" cy="10" rx="3" ry="6" fill="rgba(255,255,255,0.25)" transform="rotate(-18 8 10)" />
      </svg>
    </div>
  );
}

/* ── Section label ───────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-body font-semibold tracking-[0.18em] uppercase mb-4"
      style={{ color: "#bf4d68" }}>
      <span className="w-5 h-px" style={{ background: "currentColor" }} />
      {children}
      <span className="w-5 h-px" style={{ background: "currentColor" }} />
    </p>
  );
}

/* ── Section heading ─────────────────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-light leading-[1.15]"
      style={{ fontSize: "clamp(1.9rem, 3.8vw, 3rem)", color: "#3d1825" }}>
      {children}
    </h2>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [petals] = useState(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left:  `${(i * 6.5 + Math.random() * 5) % 100}%`,
      delay: `${(i * 0.9 + Math.random() * 3).toFixed(1)}s`,
      dur:   `${(11 + Math.random() * 7).toFixed(1)}s`,
      size:  0.65 + Math.random() * 0.75,
    }))
  );

  const [activeReview, setActiveReview] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setActiveReview(r => (r + 1) % REVIEWS.length), 4800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goOzon = () => window.open(OZON_URL, "_blank");

  return (
    <div className="min-h-screen font-body overflow-x-hidden" style={{ background: "var(--sakura-pale)" }}>

      {/* ── Falling petals ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {petals.map(p => <Petal key={p.id} {...p} />)}
      </div>

      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "header-blur" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #e07090, #bf4d68)" }}>
              <span className="text-base leading-none">🌸</span>
            </div>
            <span className="font-display font-semibold text-xl tracking-wide" style={{ color: "#4e3d46" }}>
              Kaiteki
            </span>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-body font-medium" style={{ color: "#7a6470" }}>
            <a href="#features" className="hover:text-[#bf4d68] transition-colors">Преимущества</a>
            <a href="#how"      className="hover:text-[#bf4d68] transition-colors">Применение</a>
            <a href="#reviews"  className="hover:text-[#bf4d68] transition-colors">Отзывы</a>
            <a href="#lead-form" className="hover:text-[#bf4d68] transition-colors">Скидка</a>
          </nav>

          <button onClick={goOzon} className="btn-sakura px-5 py-2.5 text-sm">
            Купить на Ozon
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-15"
            style={{ backgroundImage: `url(${BG_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(120deg, rgba(254,240,244,0.97) 0%, rgba(254,240,244,0.88) 45%, rgba(254,240,244,0.55) 100%)" }} />
          {/* Ambient blobs */}
          <div className="absolute top-[-10%] right-[5%] w-[520px] h-[520px] rounded-full blur-[90px] opacity-30 pointer-events-none"
            style={{ background: "radial-gradient(circle, #f5c0d0, transparent)" }} />
          <div className="absolute bottom-[-5%] left-[10%] w-[380px] h-[380px] rounded-full blur-[80px] opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #a2c8ae, transparent)" }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8 lg:gap-16 items-center py-24">

          {/* ── Text ── */}
          <div>
            {/* Badge */}
            <div className="animate-fade-up opacity-0 mb-7">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-body font-bold tracking-[0.14em] uppercase"
                style={{ background: "rgba(224,112,144,0.1)", border: "1px solid rgba(191,77,104,0.25)", color: "#bf4d68" }}>
                🌸 Японская формула
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-light leading-[1.08] mb-6 animate-fade-up delay-100 opacity-0"
              style={{ fontSize: "clamp(3rem, 6.5vw, 5.4rem)", color: "#3d1825", letterSpacing: "-0.01em" }}>
              Стирка<br />
              с&nbsp;ароматом{" "}
              <span className="text-shimmer italic">сакуры</span>
            </h1>

            {/* Sub */}
            <p className="font-body text-[1.05rem] leading-[1.7] mb-9 animate-fade-up delay-200 opacity-0"
              style={{ color: "#7a6470", maxWidth: 440 }}>
              Капсулы Kaiteki — моющее средство и&nbsp;кондиционер в&nbsp;одном.
              Нежный парфюмированный аромат японской сакуры, бережная
              защита цветного белья.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 mb-10 animate-fade-up delay-300 opacity-0">
              <button onClick={goOzon} className="btn-sakura animate-pulse-ring px-8 py-4 text-[1rem]">
                Купить на Ozon →
              </button>
              <a href="#features" className="btn-outline-sakura px-8 py-4 text-[1rem]">
                Подробнее
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5 animate-fade-up delay-400 opacity-0">
              <div className="flex -space-x-2.5">
                {["🌸","🌺","✨","💐"].map((e, i) => (
                  <div key={i}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm border-[2.5px] border-white shadow-sm"
                    style={{ background: `hsl(${340 + i*8}, 55%, ${87 - i*3}%)` }}>
                    {e}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[1,2,3,4,5].map(s => <span key={s} className="star-fill text-[15px]">★</span>)}
                </div>
                <p className="text-xs font-body" style={{ color: "#aa9099" }}>4.9 · 2&nbsp;400+ отзывов на Ozon</p>
              </div>
            </div>
          </div>

          {/* ── Product image ── */}
          <div className="flex justify-center items-center">
            <div className="relative animate-bloom opacity-0 delay-200">
              {/* Glow */}
              <div className="absolute inset-[-10%] rounded-full blur-[60px] opacity-45 pointer-events-none"
                style={{ background: "radial-gradient(circle, #f5c0d0 20%, #e07090 60%, transparent)" }} />
              {/* Image */}
              <img
                src={PRODUCT_IMG}
                alt="Kaiteki капсулы для стирки, аромат сакуры"
                className="relative rounded-[2.5rem] object-cover animate-float"
                style={{
                  width: 420, height: 420,
                  boxShadow: "0 28px 80px rgba(191,77,104,0.28), 0 6px 20px rgba(191,77,104,0.16)",
                  border: "2px solid rgba(255,255,255,0.7)",
                }}
              />
              {/* Badge */}
              <div
                className="absolute -top-5 -right-5 w-[84px] h-[84px] rounded-full flex flex-col items-center justify-center text-white"
                style={{
                  background: "linear-gradient(145deg, #e8829a, #bf4d68)",
                  boxShadow: "0 8px 28px rgba(191,77,104,0.5), 0 2px 0 rgba(255,255,255,0.25) inset",
                }}>
                <span className="font-body font-black text-lg leading-none">30+</span>
                <span className="font-body text-[10px] opacity-85 leading-tight mt-0.5">стирок</span>
              </div>
              {/* Floating chip */}
              <div className="absolute -bottom-4 -left-6 glass-card rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-lg">
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(95,158,114,0.15)" }}>
                  <Icon name="Check" size={13} style={{ color: "#5f9e72" }} />
                </div>
                <div>
                  <p className="font-body font-semibold text-xs" style={{ color: "#3d1825" }}>2-в-1 формула</p>
                  <p className="font-body text-[10px]" style={{ color: "#aa9099" }}>стирка + кондиционер</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
          <span className="font-body text-xs tracking-widest uppercase" style={{ color: "#aa9099" }}>листай</span>
          <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1"
            style={{ borderColor: "rgba(191,77,104,0.35)" }}>
            <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: "#bf4d68" }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════ */}
      <section className="relative z-10 stats-bar py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { val: "30+",   sub: "стирок в упаковке"    },
            { val: "2-в-1", sub: "стирка + кондиционер" },
            { val: "24 ч",  sub: "аромат держится"       },
            { val: "4.9★",  sub: "рейтинг на Ozon"       },
          ].map((s, i) => (
            <div key={i} className="relative">
              {i < 3 && <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px opacity-30" style={{ background: "white" }} />}
              <div className="font-display font-semibold leading-none mb-1.5" style={{ fontSize: "2.4rem", color: "rgba(255,255,255,0.96)" }}>{s.val}</div>
              <div className="font-body text-sm" style={{ color: "rgba(255,255,255,0.68)" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section id="features" className="relative z-10 py-28 px-6 md:px-12 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Преимущества</SectionLabel>
            <SectionHeading>Всё лучшее —&nbsp;в&nbsp;одной&nbsp;капсуле</SectionHeading>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card rounded-3xl p-7 text-center cursor-default">
                {/* Icon */}
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="w-full h-full rounded-2xl flex items-center justify-center"
                    style={{ background: f.bg, border: `1.5px solid ${f.color}28` }}>
                    <Icon name={f.icon} size={28} style={{ color: f.color }} />
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute -inset-1.5 rounded-2xl pointer-events-none"
                    style={{ border: `1px dashed ${f.color}22` }} />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3 leading-snug" style={{ color: "#3d1825" }}>{f.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#7a6470" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW TO USE
      ══════════════════════════════════════════ */}
      <section id="how" className="relative z-10 py-28 px-6 md:px-12 bg-petal">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Способ применения</SectionLabel>
            <SectionHeading>Просто как 1—2—3</SectionHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[calc(33%+24px)] right-[calc(33%+24px)] h-px"
              style={{ background: "linear-gradient(90deg, rgba(224,112,144,0.35), rgba(224,112,144,0.35))" }} />

            {STEPS.map((s, i) => (
              <div key={i} className="relative">
                <div className="glass-card rounded-3xl p-8">
                  {/* Number + icon */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-display font-light text-4xl leading-none text-shimmer">{s.num}</span>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(224,112,144,0.1)" }}>
                      <Icon name={s.icon} size={20} style={{ color: "#bf4d68" }} />
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2.5" style={{ color: "#3d1825" }}>{s.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: "#7a6470" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          REVIEWS
      ══════════════════════════════════════════ */}
      <section id="reviews" className="relative z-10 py-28 px-6 md:px-12 bg-cream overflow-hidden">
        {/* Soft bg photo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: `url(${BG_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Отзывы покупателей</SectionLabel>
            <SectionHeading>Их уже полюбили тысячи</SectionHeading>
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {[1,2,3,4,5].map(s => <span key={s} className="star-fill text-2xl">★</span>)}
              <span className="font-body font-bold text-lg ml-2" style={{ color: "#3d1825" }}>4.9</span>
              <span className="font-body text-sm ml-1" style={{ color: "#aa9099" }}>· 2&nbsp;400+ отзывов</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {REVIEWS.map((r, i) => (
              <div key={i}
                className={`glass-card rounded-3xl p-7 transition-all duration-500 cursor-default ${i === activeReview ? "review-active" : ""}`}>
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-semibold text-white text-lg flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, hsl(${340 + i*12},65%,62%), hsl(${340 + i*12},65%,50%))` }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="font-body font-semibold text-sm leading-snug" style={{ color: "#3d1825" }}>{r.name}</p>
                      <p className="font-body text-xs mt-0.5" style={{ color: "#aa9099" }}>{r.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <span key={s} className="star-fill text-sm">★</span>
                    ))}
                  </div>
                </div>
                {/* Quote mark */}
                <div className="font-display text-5xl leading-none mb-1 opacity-15 select-none" style={{ color: "#bf4d68" }}>"</div>
                <p className="font-body text-[0.9rem] leading-[1.65]" style={{ color: "#5e4a52" }}>{r.text}</p>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center items-center gap-2">
            {REVIEWS.map((_, i) => (
              <button key={i} onClick={() => setActiveReview(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  height: 7,
                  width: i === activeReview ? 24 : 7,
                  background: i === activeReview ? "#e07090" : "rgba(224,112,144,0.28)",
                }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════ */}
      <section className="relative z-10 py-28 px-6 md:px-12 bg-petal">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Вопросы и ответы</SectionLabel>
            <SectionHeading>Часто спрашивают</SectionHeading>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <div key={i} className="glass-card faq-item rounded-2xl overflow-hidden">
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span className="font-body font-semibold text-[0.95rem]" style={{ color: "#3d1825" }}>{item.q}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{ background: faqOpen === i ? "rgba(191,77,104,0.12)" : "rgba(224,112,144,0.08)" }}>
                    <Icon name={faqOpen === i ? "Minus" : "Plus"} size={14} style={{ color: "#bf4d68" }} />
                  </div>
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-6 animate-slide-down">
                    <div className="divider-sakura mb-4" />
                    <p className="font-body text-sm leading-relaxed" style={{ color: "#7a6470" }}>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LEAD FORM
      ══════════════════════════════════════════ */}
      <LeadForm />

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="relative z-10 py-28 px-6 md:px-12 overflow-hidden stats-bar">
        {/* Decorative */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: "rgba(255,255,255,0.4)", filter: "blur(2px)" }} />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full opacity-15 pointer-events-none"
          style={{ background: "rgba(255,255,255,0.4)", filter: "blur(2px)" }} />
        {/* Pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='white'/%3E%3C/svg%3E")`, backgroundSize: "40px 40px" }} />

        <div className="relative max-w-3xl mx-auto text-center text-white">
          <div className="text-5xl mb-6 animate-float">🌸</div>
          <h2 className="font-display font-light leading-[1.15] mb-5"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.01em" }}>
            Почувствуй Японию<br />в&nbsp;каждой стирке
          </h2>
          <p className="font-body text-[1.05rem] mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
            30+ стирок с кондиционером и ароматом сакуры.<br />
            Доступно на Ozon с&nbsp;быстрой доставкой.
          </p>
          <button onClick={goOzon}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-body font-bold text-[1.05rem] transition-all duration-250 hover:scale-105 hover:shadow-2xl active:scale-100"
            style={{ background: "white", color: "#bf4d68", boxShadow: "0 12px 40px rgba(61,24,37,0.25)" }}>
            <Icon name="ShoppingBag" size={20} />
            Купить на Ozon
          </button>
          <p className="font-body text-sm mt-5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Бесплатная доставка при заказе от&nbsp;1&nbsp;499&nbsp;₽
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="relative z-10 py-12 px-6 md:px-12 bg-cream" style={{ borderTop: "1px solid rgba(224,112,144,0.12)" }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #e07090, #bf4d68)" }}>
              <span className="text-white text-xs leading-none">🌸</span>
            </div>
            <span className="font-display font-semibold text-lg" style={{ color: "#4e3d46" }}>Kaiteki</span>
          </div>

          <div className="flex items-center gap-6 font-body text-sm" style={{ color: "#aa9099" }}>
            <a href="#features" className="hover:text-[#bf4d68] transition-colors">Преимущества</a>
            <a href="#reviews"  className="hover:text-[#bf4d68] transition-colors">Отзывы</a>
            <button onClick={goOzon} className="hover:text-[#bf4d68] transition-colors">Ozon →</button>
          </div>

          <p className="font-body text-xs" style={{ color: "#c8b0bc" }}>
            © 2025 Kaiteki. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LEAD FORM
═══════════════════════════════════════════════════════════════════════ */
function LeadForm() {
  const [name,  setName]  = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(LEADS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) { setName(""); setPhone(""); }
    } catch { setStatus("error"); }
  };

  return (
    <section id="lead-form" className="relative z-10 py-28 px-6 md:px-12 bg-cream overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #e07090, transparent)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #5f9e72, transparent)", transform: "translate(-30%,30%)" }} />
      </div>

      <div className="relative max-w-xl mx-auto text-center">
        <SectionLabel>Специальное предложение</SectionLabel>
        <SectionHeading>
          Получите скидку&nbsp;10%<br />
          <span className="text-shimmer italic">на&nbsp;первый заказ</span>
        </SectionHeading>
        <p className="font-body text-[0.95rem] leading-[1.7] mt-4 mb-10" style={{ color: "#7a6470" }}>
          Оставьте имя и телефон — пришлём промокод и расскажем
          об акциях первыми.
        </p>

        {status === "success" ? (
          <div className="glass-card rounded-3xl px-8 py-14 flex flex-col items-center gap-5 animate-scale-in">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #e07090, #bf4d68)", boxShadow: "0 8px 24px rgba(191,77,104,0.4)" }}>
              <Icon name="Check" size={28} className="text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-2xl mb-2" style={{ color: "#3d1825" }}>Заявка принята! 🌸</h3>
              <p className="font-body text-sm" style={{ color: "#7a6470" }}>Мы свяжемся с вами и пришлём промокод.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="glass-card rounded-3xl p-8 text-left">
            <div className="grid md:grid-cols-2 gap-3 mb-3">
              {/* Name */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="User" size={15} style={{ color: "#c0a0ae" }} />
                </div>
                <input
                  type="text" placeholder="Ваше имя" required
                  value={name} onChange={e => setName(e.target.value)}
                  className="field-sakura w-full pl-10 pr-4 py-3.5 text-sm"
                />
              </div>
              {/* Phone */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Phone" size={15} style={{ color: "#c0a0ae" }} />
                </div>
                <input
                  type="tel" placeholder="+7 (999) 000-00-00" required
                  value={phone} onChange={e => setPhone(e.target.value)}
                  className="field-sakura w-full pl-10 pr-4 py-3.5 text-sm"
                />
              </div>
            </div>

            <button type="submit" disabled={status === "loading"}
              className="btn-sakura w-full py-4 text-[1rem] flex items-center justify-center gap-2.5 mt-1">
              {status === "loading"
                ? <><Icon name="Loader2" size={18} className="animate-spin" />Отправляем…</>
                : <><Icon name="Gift" size={18} />Получить скидку 10%</>
              }
            </button>

            {status === "error" && (
              <p className="font-body text-sm mt-3 text-center" style={{ color: "#bf4d68" }}>
                Что-то пошло не так. Попробуйте ещё раз.
              </p>
            )}

            <p className="font-body text-xs mt-4 text-center" style={{ color: "#c0a0ae" }}>
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
              Без спама — только скидка и&nbsp;акции.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
