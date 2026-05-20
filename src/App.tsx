import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

/* ─── Types ─────────────────────────────────────────── */
interface Message {
  id: number;
  text: string;
  out: boolean;
  time: string;
  read: boolean;
  date: string;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;       // initials
  color: string;
  online: boolean;
  typing?: boolean;
  unread: number;
  lastMsg: string;
  lastTime: string;
  messages: Message[];
}

/* ─── Seed data ──────────────────────────────────────── */
const SEED_CHATS: Chat[] = [
  {
    id: 1, name: "Анна Смирнова", avatar: "АС", color: "#7c6fe0", online: true,
    unread: 3, lastMsg: "Окей, договорились 👍", lastTime: "14:22",
    messages: [
      { id: 1, text: "Привет! Как дела?", out: false, time: "13:40", read: true, date: "Сегодня" },
      { id: 2, text: "Всё хорошо, спасибо! Ты как?", out: true, time: "13:41", read: true, date: "Сегодня" },
      { id: 3, text: "Тоже отлично 😊 Ты не забыл про встречу завтра в 11:00?", out: false, time: "13:45", read: true, date: "Сегодня" },
      { id: 4, text: "Нет-нет, помню! Встречаемся у офиса?", out: true, time: "14:10", read: true, date: "Сегодня" },
      { id: 5, text: "Да, у главного входа. Захвати документы если есть", out: false, time: "14:20", read: true, date: "Сегодня" },
      { id: 6, text: "Окей, договорились 👍", out: false, time: "14:22", read: false, date: "Сегодня" },
    ],
  },
  {
    id: 2, name: "Дмитрий К.", avatar: "ДК", color: "#e07060", online: false,
    unread: 0, lastMsg: "Скину файл сегодня вечером", lastTime: "12:05",
    messages: [
      { id: 1, text: "Дима, нашёл нужный файл?", out: true, time: "11:30", read: true, date: "Сегодня" },
      { id: 2, text: "Ищу, там архив большой. Дай немного времени", out: false, time: "11:48", read: true, date: "Сегодня" },
      { id: 3, text: "Хорошо, не спешу", out: true, time: "11:49", read: true, date: "Сегодня" },
      { id: 4, text: "Скину файл сегодня вечером", out: false, time: "12:05", read: true, date: "Сегодня" },
    ],
  },
  {
    id: 3, name: "Команда дизайна", avatar: "КД", color: "#2ecc9a", online: true,
    unread: 7, lastMsg: "Я загрузил новые макеты в Figma", lastTime: "Вчера",
    messages: [
      { id: 1, text: "Всем привет! Обновил палитру в компонентах", out: false, time: "10:00", read: true, date: "Вчера" },
      { id: 2, text: "Круто, уже смотрю! Иконки тоже обновил?", out: true, time: "10:15", read: true, date: "Вчера" },
      { id: 3, text: "Да, всё в ветке v2.1", out: false, time: "10:18", read: true, date: "Вчера" },
      { id: 4, text: "Я загрузил новые макеты в Figma", out: false, time: "11:30", read: false, date: "Вчера" },
    ],
  },
  {
    id: 4, name: "Мама", avatar: "МА", color: "#e08030", online: true,
    unread: 1, lastMsg: "Позвони как освободишься ❤️", lastTime: "09:10",
    messages: [
      { id: 1, text: "Сынок, ты уже дома?", out: false, time: "08:55", read: true, date: "Сегодня" },
      { id: 2, text: "Да, мам, всё хорошо 😊", out: true, time: "09:00", read: true, date: "Сегодня" },
      { id: 3, text: "Позвони как освободишься ❤️", out: false, time: "09:10", read: false, date: "Сегодня" },
    ],
  },
  {
    id: 5, name: "Иван Петров", avatar: "ИП", color: "#6090d0", online: false,
    unread: 0, lastMsg: "Ок, принял!", lastTime: "Вт",
    messages: [
      { id: 1, text: "Привет! Можешь завтра выйти на полчаса раньше?", out: true, time: "18:00", read: true, date: "Вторник" },
      { id: 2, text: "Ок, принял!", out: false, time: "18:10", read: true, date: "Вторник" },
    ],
  },
  {
    id: 6, name: "Маша Б.", avatar: "МБ", color: "#c060a0", online: false,
    unread: 0, lastMsg: "Хахаха, точно 😂", lastTime: "Пн",
    messages: [
      { id: 1, text: "Видела мем про программистов?", out: false, time: "20:12", read: true, date: "Понедельник" },
      { id: 2, text: "Нет, скинь!", out: true, time: "20:14", read: true, date: "Понедельник" },
      { id: 3, text: "Хахаха, точно 😂", out: false, time: "20:18", read: true, date: "Понедельник" },
    ],
  },
];

/* ─── Helpers ────────────────────────────────────────── */
function now(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function Avatar({ initials, color, online, size = 46 }: {
  initials: string; color: string; online?: boolean; size?: number;
}) {
  return (
    <div
      className={`avatar ${online ? "online-dot" : ""}`}
      style={{ width: size, height: size, background: color, fontSize: size * 0.34 }}
    >
      {initials}
    </div>
  );
}

/* ─── Read ticks ──────────────────────────────────────── */
function Ticks({ read }: { read: boolean }) {
  return (
    <span style={{ color: read ? "var(--teal)" : "var(--text-dim)", fontSize: 13, lineHeight: 1 }}>
      {read ? "✓✓" : "✓"}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const [chats, setChats] = useState<Chat[]>(SEED_CHATS);
  const [activeChatId, setActiveChatId] = useState<number | null>(1);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId) ?? null;

  /* Auto-scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages.length]);

  /* Mark as read when opening */
  useEffect(() => {
    if (activeChatId === null) return;
    setChats(prev => prev.map(c =>
      c.id === activeChatId
        ? { ...c, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) }
        : c
    ));
  }, [activeChatId]);

  /* Simulate auto-reply */
  const simulateReply = (chatId: number) => {
    const replies = [
      "Понял тебя 👍",
      "Хорошо, скоро отвечу подробнее!",
      "Ок!",
      "Интересно 🤔 Расскажи подробнее",
      "Договорились!",
      "😊",
      "Окей, принял!",
    ];
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, typing: true } : c));
    setTimeout(() => {
      const text = replies[Math.floor(Math.random() * replies.length)];
      const t = now();
      setChats(prev => prev.map(c => {
        if (c.id !== chatId) return c;
        const newMsg: Message = { id: Date.now(), text, out: false, time: t, read: false, date: "Сегодня" };
        return { ...c, typing: false, lastMsg: text, lastTime: t, messages: [...c.messages, newMsg] };
      }));
    }, 1400 + Math.random() * 800);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !activeChatId) return;
    const t = now();
    const newMsg: Message = { id: Date.now(), text, out: true, time: t, read: false, date: "Сегодня" };
    setChats(prev => prev.map(c =>
      c.id === activeChatId
        ? { ...c, lastMsg: text, lastTime: t, messages: [...c.messages, newMsg] }
        : c
    ));
    setInput("");
    inputRef.current?.focus();
    simulateReply(activeChatId);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  /* Group messages by date */
  const groupedMessages = () => {
    if (!activeChat) return [];
    const groups: { date: string; msgs: Message[] }[] = [];
    activeChat.messages.forEach(m => {
      const last = groups[groups.length - 1];
      if (last && last.date === m.date) last.msgs.push(m);
      else groups.push({ date: m.date, msgs: [m] });
    });
    return groups;
  };

  return (
    <div className="messenger-layout">

      {/* ════════════════════════════════
          SIDEBAR
      ════════════════════════════════ */}
      <div className="sidebar">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3"
          style={{ borderBottom: "1px solid var(--border-sub)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2ecc9a, #1490c0)" }}>
              <Icon name="MessageCircle" size={16} className="text-white" />
            </div>
            <span className="font-plex font-semibold text-base" style={{ color: "var(--text-pri)" }}>Mira</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="icon-btn"><Icon name="Edit" size={17} /></button>
            <button className="icon-btn"><Icon name="MoreVertical" size={17} /></button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 relative">
          <Icon name="Search" size={15} className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-dim)" }} />
          <input
            className="search-input"
            placeholder="Поиск"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm" style={{ color: "var(--text-dim)" }}>
              Ничего не найдено
            </div>
          )}
          {filtered.map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${activeChatId === chat.id ? "active" : ""}`}
              onClick={() => { setActiveChatId(chat.id); setShowInfo(false); }}
            >
              <Avatar initials={chat.avatar} color={chat.color} online={chat.online} size={46} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-plex font-semibold text-sm truncate" style={{ color: "var(--text-pri)" }}>
                    {chat.name}
                  </span>
                  <span className="font-plex text-[11px] flex-shrink-0 ml-2" style={{ color: "var(--text-dim)" }}>
                    {chat.lastTime}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] truncate" style={{ color: "var(--text-sec)" }}>
                    {chat.typing ? (
                      <span style={{ color: "var(--teal)", fontStyle: "italic" }}>печатает…</span>
                    ) : chat.lastMsg}
                  </p>
                  {chat.unread > 0 && (
                    <span className="unread-badge">{chat.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-around py-3 px-4"
          style={{ borderTop: "1px solid var(--border-sub)" }}>
          {[
            { icon: "MessageCircle", active: true },
            { icon: "Phone",         active: false },
            { icon: "Users",         active: false },
            { icon: "Settings",      active: false },
          ].map((item, i) => (
            <button key={i} className="icon-btn" style={item.active ? { color: "var(--teal)" } : {}}>
              <Icon name={item.icon} size={20} />
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          CHAT PANEL
      ════════════════════════════════ */}
      {activeChat ? (
        <div className="chat-panel">

          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3"
            style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--border-sub)" }}>
            <div className="cursor-pointer" onClick={() => setShowInfo(!showInfo)}>
              <Avatar initials={activeChat.avatar} color={activeChat.color} online={activeChat.online} size={40} />
            </div>
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setShowInfo(!showInfo)}>
              <p className="font-plex font-semibold text-sm leading-tight" style={{ color: "var(--text-pri)" }}>
                {activeChat.name}
              </p>
              <p className="text-xs" style={{ color: activeChat.online ? "var(--teal)" : "var(--text-dim)" }}>
                {activeChat.typing
                  ? <span style={{ fontStyle: "italic" }}>печатает…</span>
                  : activeChat.online ? "в сети" : "был(а) недавно"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button className="icon-btn"><Icon name="Phone" size={18} /></button>
              <button className="icon-btn"><Icon name="Video" size={18} /></button>
              <button className="icon-btn"><Icon name="Search" size={18} /></button>
              <button className="icon-btn"><Icon name="MoreVertical" size={18} /></button>
            </div>
          </div>

          {/* Info panel */}
          {showInfo && (
            <div className="absolute right-0 top-[57px] z-20 w-72 animate-fade-up shadow-2xl rounded-2xl overflow-hidden"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border-sub)" }}>
              <div className="flex flex-col items-center py-8 px-5 gap-4"
                style={{ borderBottom: "1px solid var(--border-sub)" }}>
                <Avatar initials={activeChat.avatar} color={activeChat.color} online={activeChat.online} size={72} />
                <div className="text-center">
                  <p className="font-plex font-semibold text-base" style={{ color: "var(--text-pri)" }}>{activeChat.name}</p>
                  <p className="text-sm mt-1" style={{ color: activeChat.online ? "var(--teal)" : "var(--text-sec)" }}>
                    {activeChat.online ? "● В сети" : "○ Не в сети"}
                  </p>
                </div>
              </div>
              <div className="py-3 px-2">
                {[
                  { icon: "Bell",      label: "Уведомления" },
                  { icon: "Archive",   label: "Архивировать" },
                  { icon: "Trash2",    label: "Удалить чат" },
                ].map((item, i) => (
                  <button key={i} onClick={() => setShowInfo(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
                    style={{ color: item.icon === "Trash2" ? "#e07070" : "var(--text-sec)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-3)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <Icon name={item.icon} size={16} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="messages-area chat-bg" onClick={() => setShowInfo(false)}>
            {groupedMessages().map(group => (
              <div key={group.date}>
                <div className="date-divider">{group.date}</div>
                {group.msgs.map((msg, idx) => {
                  const prevOut = idx > 0 ? group.msgs[idx - 1].out : null;
                  const sameAuthor = prevOut === msg.out;
                  return (
                    <div key={msg.id}
                      className={`flex ${msg.out ? "justify-end" : "justify-start"} ${sameAuthor ? "mt-0.5" : "mt-2"}`}>
                      <div className={`bubble ${msg.out ? "bubble-out" : "bubble-in"}`}>
                        {msg.text}
                        <div className="bubble-meta">
                          <span>{msg.time}</span>
                          {msg.out && <Ticks read={msg.read} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Typing indicator */}
            {activeChat.typing && (
              <div className="flex justify-start mt-2">
                <div className="bubble bubble-in flex items-center gap-1.5 py-3 px-4">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="msg-input-wrap">
            <button className="icon-btn" style={{ flexShrink: 0 }}>
              <Icon name="Smile" size={20} />
            </button>
            <button className="icon-btn" style={{ flexShrink: 0 }}>
              <Icon name="Paperclip" size={18} />
            </button>
            <textarea
              ref={inputRef}
              className="msg-input"
              placeholder="Сообщение…"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="send-btn" onClick={sendMessage} disabled={!input.trim()}>
              <Icon name="Send" size={17} style={{ transform: "translateX(1px)" }} />
            </button>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="chat-panel">
          <div className="empty-state">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-2"
              style={{ background: "var(--surface-3)" }}>
              <Icon name="MessageCircle" size={36} style={{ color: "var(--text-dim)" }} />
            </div>
            <p className="font-plex font-semibold text-base" style={{ color: "var(--text-sec)" }}>
              Выберите чат
            </p>
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>
              Выберите диалог из списка слева
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
