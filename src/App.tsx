import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const PRODUCT_IMG = "https://cdn.poehali.dev/projects/6ffab839-a77a-46ed-82ea-5144b5e3eee4/files/aedf5b04-f404-4b35-9671-3ee87bee3f8b.jpg";
const BG_IMG = "https://cdn.poehali.dev/projects/6ffab839-a77a-46ed-82ea-5144b5e3eee4/files/120a238a-0fc7-45ed-b5ac-69566a6e1eea.jpg";
const OZON_URL = "https://www.ozon.ru/product/kapsuly-dlya-stirki-belya-kaiteki-s-konditsionerom-parfyumirovannye-aromat-sakura-dlya-tsvetnogo-3739682715/";

const REVIEWS = [
  { name: "Ольга М.", rating: 5, text: "Запах просто волшебный! Бельё пахнет сакурой весь день. Цвет вещей не выгорает, как раньше.", date: "апрель 2025" },
  { name: "Светлана К.", rating: 5, text: "Покупаю уже третью упаковку. Капсулы растворяются полностью, пятна отходят с первого раза.", date: "март 2025" },
  { name: "Наталья В.", rating: 5, text: "Очень нежный цветочный аромат, не резкий. Ткань после стирки мягкая, как после кондиционера.", date: "май 2025" },
  { name: "Екатерина Д.", rating: 4, text: "Отличное средство. Брала для детских вещей — всё чисто, никаких раздражений. Аромат деликатный.", date: "апрель 2025" },
];

const FEATURES = [
  { icon: "Sparkles", title: "Аромат японской сакуры", desc: "Нежный парфюмированный аромат, вдохновлённый цветением сакуры в Токио. Держится до 24 часов.", color: "#e8829a" },
  { icon: "Droplets", title: "Кондиционер в составе", desc: "2-в-1: моющее средство и кондиционер в одной капсуле. Ткань мягкая и ухоженная после каждой стирки.", color: "#6bab7c" },
  { icon: "Palette", title: "Защита яркости цвета", desc: "Специальная формула для цветного белья предотвращает выцветание и сохраняет насыщенность красок.", color: "#c4536b" },
  { icon: "Shield", title: "Мягко к коже", desc: "Гипоаллергенный состав. Подходит для чувствительной кожи и детских вещей.", color: "#a78aba" },
];

const STEPS = [
  { num: "01", title: "Положите капсулу", desc: "Одну капсулу прямо в барабан стиральной машины до загрузки белья." },
  { num: "02", title: "Загрузите бельё", desc: "Засыпьте цветное бельё поверх капсулы. Не нужно мерить или отсчитывать дозу." },
  { num: "03", title: "Выберите программу", desc: "Запустите обычный цикл стирки. Капсула растворяется при любой температуре." },
];

function Petal({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute pointer-events-none select-none" style={style}>
      <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
        <ellipse cx="9" cy="11" rx="7" ry="10" fill="rgba(232,130,154,0.55)" transform="rotate(-20 9 11)" />
      </svg>
    </div>
  );
}

export default function App() {
  const [petals] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 12}s`,
      duration: `${10 + Math.random() * 8}s`,
      size: 0.7 + Math.random() * 0.8,
    }))
  );

  const [activeReview, setActiveReview] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setActiveReview(r => (r + 1) % REVIEWS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const goOzon = () => window.open(OZON_URL, "_blank");

  return (
    <div className="min-h-screen bg-petal font-body overflow-x-hidden">
      {/* Falling petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {petals.map(p => (
          <Petal key={p.id} style={{
            left: p.left,
            top: "-30px",
            transform: `scale(${p.size})`,
            animation: `petal-fall ${p.duration} ${p.delay} linear infinite`,
          }} />
        ))}
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-20 py-5 px-6 md:px-12 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(232,130,154,0.15)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #e8829a, #c4536b)" }}>
            <span className="text-white text-sm">🌸</span>
          </div>
          <span className="font-cormorant font-semibold text-xl tracking-wide" style={{ color: "#5a4a52" }}>
            Kaiteki
          </span>
        </div>
        <button onClick={goOzon} className="btn-sakura px-5 py-2.5 text-sm font-body">
          Купить на Ozon
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-[90vh] flex items-center overflow-hidden">
        {/* bg texture */}
        <div className="absolute inset-0 z-0 opacity-20"
          style={{ backgroundImage: `url(${BG_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(135deg, rgba(253,240,243,0.92) 0%, rgba(253,240,243,0.75) 50%, rgba(253,240,243,0.4) 100%)" }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center py-20">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-body font-semibold tracking-widest uppercase"
              style={{ background: "rgba(232,130,154,0.12)", border: "1px solid rgba(232,130,154,0.3)", color: "#c4536b" }}>
              🌸 Японская формула
            </div>

            <h1 className="font-cormorant font-light leading-[1.1] mb-6 animate-fade-up opacity-0"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", color: "#3d2b35" }}>
              Стирка с&nbsp;ароматом{" "}
              <em className="font-light not-italic text-shimmer">сакуры</em>
            </h1>

            <p className="font-body text-lg leading-relaxed mb-8 animate-fade-up delay-200 opacity-0"
              style={{ color: "#8d7882", maxWidth: 460 }}>
              Капсулы Kaiteki — это моющее средство и кондиционер в&nbsp;одном. 
              Нежный парфюмированный аромат японской сакуры, бережная защита 
              цветного белья.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up delay-300 opacity-0">
              <button onClick={goOzon} className="btn-sakura px-8 py-4 text-base animate-pulse-soft">
                Купить на Ozon →
              </button>
              <a href="#features" className="btn-outline-sakura px-8 py-4 text-base">
                Узнать больше
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 mt-10 animate-fade-up delay-400 opacity-0">
              <div className="flex -space-x-2">
                {["🌸","✨","🌺","💐"].map((e, i) => (
                  <div key={i} className="w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 border-white"
                    style={{ background: `hsl(${340 + i * 10}, 60%, ${88 - i * 3}%)` }}>{e}</div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[1,2,3,4,5].map(s => <span key={s} className="star-fill text-base">★</span>)}
                </div>
                <p className="text-xs font-body" style={{ color: "#8d7882" }}>4.9 · 2 400+ отзывов на Ozon</p>
              </div>
            </div>
          </div>

          {/* Product image */}
          <div className="flex justify-center items-center">
            <div className="relative animate-bloom opacity-0 delay-200">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full scale-110 blur-3xl opacity-40"
                style={{ background: "radial-gradient(circle, #f5c6d3, #e8829a, transparent 70%)" }} />
              <img src={PRODUCT_IMG} alt="Kaiteki капсулы для стирки, аромат сакуры"
                className="relative rounded-3xl object-cover animate-float"
                style={{ width: 420, height: 420, boxShadow: "0 24px 80px rgba(196,83,107,0.25), 0 4px 16px rgba(196,83,107,0.15)" }} />
              {/* Badge */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex flex-col items-center justify-center text-white text-center"
                style={{ background: "linear-gradient(135deg, #e8829a, #c4536b)", boxShadow: "0 8px 24px rgba(196,83,107,0.45)" }}>
                <span className="text-xs font-body font-bold leading-tight">30+</span>
                <span className="text-[10px] font-body leading-tight">стирок</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative z-10 py-8" style={{ background: "linear-gradient(135deg, #e8829a, #c4536b)" }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { val: "30+", label: "стирок в упаковке" },
            { val: "2-в-1", label: "стирка + кондиционер" },
            { val: "24ч", label: "аромат после стирки" },
            { val: "4.9★", label: "рейтинг на Ozon" },
          ].map((s, i) => (
            <div key={i}>
              <div className="font-cormorant font-semibold text-3xl md:text-4xl mb-1" style={{ color: "rgba(255,255,255,0.95)" }}>{s.val}</div>
              <div className="text-sm font-body" style={{ color: "rgba(255,255,255,0.75)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 py-24 px-6 md:px-12 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-body font-semibold tracking-widest uppercase mb-3" style={{ color: "#e8829a" }}>Преимущества</p>
            <h2 className="font-cormorant font-light leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#3d2b35" }}>
              Всё лучшее — в одной капсуле
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="sakura-card rounded-3xl p-7 text-center transition-all duration-300 cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: `${f.color}18`, border: `1.5px solid ${f.color}30` }}>
                  <Icon name={f.icon} size={26} style={{ color: f.color }} />
                </div>
                <h3 className="font-cormorant font-semibold text-xl mb-3 leading-snug" style={{ color: "#3d2b35" }}>{f.title}</h3>
                <p className="text-sm font-body leading-relaxed" style={{ color: "#8d7882" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="relative z-10 py-24 px-6 md:px-12 bg-petal">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-body font-semibold tracking-widest uppercase mb-3" style={{ color: "#e8829a" }}>Способ применения</p>
            <h2 className="font-cormorant font-light" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#3d2b35" }}>
              Просто как 1—2—3
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px z-0"
                    style={{ background: "linear-gradient(90deg, rgba(232,130,154,0.4), transparent)" }} />
                )}
                <div className="sakura-card rounded-3xl p-8 relative z-10">
                  <div className="font-cormorant font-light text-5xl mb-4 leading-none text-shimmer">{s.num}</div>
                  <h3 className="font-cormorant font-semibold text-xl mb-3" style={{ color: "#3d2b35" }}>{s.title}</h3>
                  <p className="text-sm font-body leading-relaxed" style={{ color: "#8d7882" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="relative z-10 py-24 px-6 md:px-12 bg-cream overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: `url(${BG_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-body font-semibold tracking-widest uppercase mb-3" style={{ color: "#e8829a" }}>Отзывы покупателей</p>
            <h2 className="font-cormorant font-light" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#3d2b35" }}>
              Их уже полюбили тысячи
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1,2,3,4,5].map(s => <span key={s} className="star-fill text-2xl">★</span>)}
              <span className="font-body font-semibold ml-2" style={{ color: "#3d2b35" }}>4.9</span>
              <span className="font-body text-sm ml-1" style={{ color: "#8d7882" }}>· 2 400+ отзывов</span>
            </div>
          </div>

          {/* Review cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {REVIEWS.map((r, i) => (
              <div key={i} className={`sakura-card rounded-3xl p-7 transition-all duration-500 ${i === activeReview ? "ring-2" : ""}`}
                style={i === activeReview ? { ringColor: "#e8829a", boxShadow: "0 8px 32px rgba(196,83,107,0.18)" } : {}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-cormorant font-semibold text-white text-lg"
                      style={{ background: "linear-gradient(135deg, #e8829a, #c4536b)" }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="font-body font-semibold text-sm" style={{ color: "#3d2b35" }}>{r.name}</p>
                      <p className="font-body text-xs" style={{ color: "#b8a4ac" }}>{r.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <span key={s} className="star-fill text-sm">★</span>
                    ))}
                  </div>
                </div>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#6b5862" }}>«{r.text}»</p>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2">
            {REVIEWS.map((_, i) => (
              <button key={i} onClick={() => setActiveReview(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ background: i === activeReview ? "#e8829a" : "rgba(232,130,154,0.3)", width: i === activeReview ? 20 : 8 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 py-24 px-6 md:px-12 bg-petal">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-body font-semibold tracking-widest uppercase mb-3" style={{ color: "#e8829a" }}>FAQ</p>
            <h2 className="font-cormorant font-light" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#3d2b35" }}>
              Часто задаваемые вопросы
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: "Подходят ли капсулы для машин-автомат?", a: "Да, капсулы Kaiteki разработаны специально для стиральных машин с горизонтальной и вертикальной загрузкой. Просто положите капсулу в барабан до загрузки белья." },
              { q: "При какой температуре использовать?", a: "Капсулы растворяются при любой температуре — от 20°C до 60°C. Рекомендуем стирку при 30–40°C для сохранения аромата." },
              { q: "Безопасны ли для детских вещей?", a: "Состав протестирован дерматологически. Капсулы не содержат агрессивных красителей и подходят для стирки детского белья." },
              { q: "Сколько капсул в упаковке?", a: "Одна упаковка содержит 30 капсул — это 30 полноценных стирок для стандартной загрузки 4–5 кг белья." },
            ].map((item, i) => (
              <div key={i} className="sakura-card rounded-2xl overflow-hidden">
                <button className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-body"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span className="font-semibold text-base" style={{ color: "#3d2b35" }}>{item.q}</span>
                  <Icon name={faqOpen === i ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: "#e8829a", flexShrink: 0 }} />
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-5 animate-fade-up">
                    <div className="divider-sakura mb-4" />
                    <p className="font-body text-sm leading-relaxed" style={{ color: "#8d7882" }}>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative z-10 py-24 px-6 md:px-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0a8ba 0%, #e8829a 40%, #c4536b 100%)" }}>
        {/* Decorative circles */}
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-20"
          style={{ background: "rgba(255,255,255,0.5)" }} />
        <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full opacity-15"
          style={{ background: "rgba(255,255,255,0.4)" }} />

        <div className="relative max-w-3xl mx-auto text-center text-white">
          <div className="text-5xl mb-5">🌸</div>
          <h2 className="font-cormorant font-light leading-tight mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", color: "white" }}>
            Почувствуй Японию<br />в каждой стирке
          </h2>
          <p className="font-body text-lg mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            30+ стирок с кондиционером и ароматом сакуры.<br />
            Уже доступно на Ozon с быстрой доставкой.
          </p>
          <button onClick={goOzon}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-body font-bold text-lg transition-all duration-200 hover:scale-105"
            style={{ background: "white", color: "#c4536b", boxShadow: "0 12px 40px rgba(90,40,60,0.25)" }}>
            <Icon name="ShoppingBag" size={22} />
            Купить на Ozon
          </button>
          <p className="font-body text-sm mt-5" style={{ color: "rgba(255,255,255,0.65)" }}>
            Бесплатная доставка при заказе от 1 499 ₽
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-10 px-6 md:px-12 text-center bg-cream"
        style={{ borderTop: "1px solid rgba(232,130,154,0.15)" }}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #e8829a, #c4536b)" }}>
            <span className="text-white text-xs">🌸</span>
          </div>
          <span className="font-cormorant font-semibold text-lg" style={{ color: "#5a4a52" }}>Kaiteki</span>
        </div>
        <p className="font-body text-sm mb-4" style={{ color: "#b8a4ac" }}>
          Капсулы для стирки с ароматом японской сакуры
        </p>
        <button onClick={goOzon} className="font-body text-sm underline transition-colors" style={{ color: "#e8829a" }}>
          Перейти на Ozon →
        </button>
        <p className="font-body text-xs mt-6" style={{ color: "#c8b4bc" }}>
          © 2025 Kaiteki. Все права защищены.
        </p>
      </footer>
    </div>
  );
}
