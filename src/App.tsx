import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "tasks" | "calendar";
type Priority = "high" | "medium" | "low";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  done: boolean;
  date: string;
  time: string;
  reminder: boolean;
}

interface Notification {
  id: number;
  message: string;
  type: "reminder" | "success" | "info";
}

const SAMPLE_TASKS: Task[] = [
  { id: 1, title: "Встреча с командой", description: "Обсудить спринт и планы на неделю", priority: "high", done: false, date: "2026-05-20", time: "10:00", reminder: true },
  { id: 2, title: "Подготовить презентацию", description: "Слайды для клиента по новому проекту", priority: "high", done: false, date: "2026-05-21", time: "14:00", reminder: true },
  { id: 3, title: "Оплатить счета", description: "Коммунальные и подписки", priority: "medium", done: false, date: "2026-05-22", time: "12:00", reminder: false },
  { id: 4, title: "Спортзал", description: "Тренировка ног + кардио", priority: "low", done: true, date: "2026-05-19", time: "18:00", reminder: false },
  { id: 5, title: "Прочитать книгу", description: "«Атомные привычки» — глава 5", priority: "low", done: false, date: "2026-05-23", time: "21:00", reminder: true },
];

const PRIORITY_LABELS: Record<Priority, string> = { high: "Высокий", medium: "Средний", low: "Низкий" };
const PRIORITY_ICONS: Record<Priority, string> = { high: "Flame", medium: "Zap", low: "Leaf" };
const DAYS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTHS_RU = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" as Priority, date: "", time: "", reminder: false });
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 4, 1));
  const [filterDone, setFilterDone] = useState<"all" | "active" | "done">("all");
  const [notifCounter, setNotifCounter] = useState(100);

  const pushNotif = (message: string, type: Notification["type"] = "info") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4500);
  };

  useEffect(() => {
    const timer = setTimeout(() => pushNotif("🔔 Напоминание: встреча с командой через 30 минут!", "reminder"), 1800);
    return () => clearTimeout(timer);
  }, []);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.done) pushNotif(`Задача «${t.title}» выполнена! 🎉`, "success");
        return { ...t, done: !t.done };
      }
      return t;
    }));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = { ...newTask, id: Date.now(), done: false };
    setTasks(prev => [task, ...prev]);
    setNewTask({ title: "", description: "", priority: "medium", date: "", time: "", reminder: false });
    setShowAddTask(false);
    pushNotif(newTask.reminder ? `🔔 Напоминание для «${newTask.title}» установлено` : `Задача «${newTask.title}» добавлена`, newTask.reminder ? "reminder" : "success");
  };

  const filteredTasks = tasks.filter(t => {
    if (filterDone === "active") return !t.done;
    if (filterDone === "done") return t.done;
    return true;
  });

  const completedCount = tasks.filter(t => t.done).length;
  const progressPct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const getDaysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();
  const tasksForDay = (day: number) => {
    const ds = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return tasks.filter(t => t.date === ds);
  };

  return (
    <div className="min-h-screen mesh-bg font-golos relative overflow-x-hidden">
      {/* bg orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-10 animate-float"
          style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }} />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-8 animate-float"
          style={{ background: "radial-gradient(circle, #06d6d6, transparent 70%)", animationDelay: "1.5s" }} />
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2" style={{ maxWidth: 340 }}>
        {notifications.map(n => (
          <div key={n.id} className="animate-notification-in glass-card rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ borderColor: n.type === "reminder" ? "rgba(247,37,133,0.4)" : n.type === "success" ? "rgba(57,255,20,0.35)" : "rgba(168,85,247,0.4)" }}>
            <div className="rounded-full p-1.5 flex-shrink-0"
              style={{ background: n.type === "reminder" ? "rgba(247,37,133,0.2)" : n.type === "success" ? "rgba(57,255,20,0.15)" : "rgba(168,85,247,0.2)" }}>
              <Icon name={n.type === "reminder" ? "Bell" : n.type === "success" ? "CheckCircle" : "Info"} size={14}
                style={{ color: n.type === "reminder" ? "#f72585" : n.type === "success" ? "#39ff14" : "#a855f7" }} />
            </div>
            <span className="text-sm text-foreground/90">{n.message}</span>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 z-40 flex flex-col"
        style={{ background: "rgba(8,8,16,0.88)", borderRight: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center glow-purple"
              style={{ background: "linear-gradient(135deg, #a855f7, #06d6d6)" }}>
              <Icon name="Sparkles" size={18} className="text-white" />
            </div>
            <span className="font-montserrat font-black text-lg tracking-tight">Планёр</span>
          </div>
          <p className="text-xs text-muted-foreground pl-12">твой личный помощник</p>
        </div>

        <nav className="flex-1 px-3">
          {([
            { id: "home" as Page, label: "Главная", icon: "Home", color: "#a855f7" },
            { id: "tasks" as Page, label: "Мои задачи", icon: "CheckSquare", color: "#06d6d6" },
            { id: "calendar" as Page, label: "Календарь", icon: "Calendar", color: "#f72585" },
          ]).map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 text-left"
              style={page === item.id ? {
                background: `linear-gradient(135deg, ${item.color}22, ${item.color}11)`,
                border: `1px solid ${item.color}40`,
              } : { border: "1px solid transparent" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: page === item.id ? `${item.color}25` : "rgba(255,255,255,0.05)" }}>
                <Icon name={item.icon} size={16} style={{ color: page === item.id ? item.color : "#6b7280" }} />
              </div>
              <span className="font-medium text-sm" style={{ color: page === item.id ? item.color : "#9ca3af" }}>
                {item.label}
              </span>
              {item.id === "tasks" && (
                <span className="ml-auto text-xs font-bold rounded-full px-2 py-0.5"
                  style={{ background: "rgba(6,214,214,0.15)", color: "#06d6d6", border: "1px solid rgba(6,214,214,0.3)" }}>
                  {tasks.filter(t => !t.done).length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 pb-6">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Прогресс дня</span>
              <span className="font-bold" style={{ color: "#a855f7" }}>{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #a855f7, #06d6d6)" }} />
            </div>
            <p className="text-xs text-muted-foreground">{completedCount} из {tasks.length} задач</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 min-h-screen p-8">
        {page === "home" && <HomePage tasks={tasks} setPage={setPage} progressPct={progressPct} completedCount={completedCount} pushNotif={pushNotif} />}
        {page === "tasks" && <TasksPage tasks={filteredTasks} allTasks={tasks} toggleTask={toggleTask} showAddTask={showAddTask} setShowAddTask={setShowAddTask} newTask={newTask} setNewTask={setNewTask} addTask={addTask} filterDone={filterDone} setFilterDone={setFilterDone} />}
        {page === "calendar" && <CalendarPage tasks={tasks} calendarDate={calendarDate} setCalendarDate={setCalendarDate} getDaysInMonth={getDaysInMonth} getFirstDay={getFirstDay} tasksForDay={tasksForDay} />}
      </main>
    </div>
  );
}

function HomePage({ tasks, setPage, progressPct, completedCount, pushNotif }: {
  tasks: Task[]; setPage: (p: Page) => void; progressPct: number; completedCount: number;
  pushNotif: (msg: string, type?: "reminder" | "success" | "info") => void;
}) {
  const urgent = tasks.filter(t => !t.done && t.priority === "high");

  return (
    <div className="max-w-5xl">
      <div className="mb-10 animate-fade-in">
        <p className="text-muted-foreground mb-2">Добро пожаловать 👋</p>
        <h1 className="font-montserrat font-black text-5xl mb-3 leading-tight">
          <span className="shimmer-text">Твой планёр</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Сегодня, {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Активных задач", value: tasks.filter(t => !t.done).length, icon: "ListTodo", color: "#a855f7", border: "rgba(168,85,247,0.3)", bg: "rgba(168,85,247,0.12)" },
          { label: "Выполнено", value: completedCount, icon: "CheckCircle2", color: "#39ff14", border: "rgba(57,255,20,0.3)", bg: "rgba(57,255,20,0.1)" },
          { label: "Срочных", value: urgent.length, icon: "Flame", color: "#f72585", border: "rgba(247,37,133,0.3)", bg: "rgba(247,37,133,0.12)" },
        ].map((s, i) => (
          <div key={i} className={`glass-card rounded-2xl p-5 animate-fade-in opacity-0`}
            style={{ borderColor: s.border, animationDelay: `${i * 0.12}s` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <Icon name={s.icon} size={20} style={{ color: s.color }} />
              </div>
              <span className="font-montserrat font-black text-3xl" style={{ color: s.color }}>{s.value}</span>
            </div>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="glass-card rounded-3xl p-6 mb-8 animate-fade-in delay-300 opacity-0"
        style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,214,214,0.06))", borderColor: "rgba(168,85,247,0.25)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-montserrat font-bold text-xl mb-1">Прогресс дня</h2>
            <p className="text-muted-foreground text-sm">Продолжай в том же духе!</p>
          </div>
          <span className="font-montserrat font-black text-5xl text-glow-purple" style={{ color: "#a855f7" }}>{progressPct}%</span>
        </div>
        <div className="h-3 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full transition-all duration-700 glow-purple"
            style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #a855f7, #06d6d6, #f72585)" }} />
        </div>
      </div>

      {/* Urgent */}
      {urgent.length > 0 && (
        <div className="mb-8 animate-fade-in delay-400 opacity-0">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Flame" size={18} style={{ color: "#f72585" }} />
            <h2 className="font-montserrat font-bold text-lg" style={{ color: "#f72585" }}>Срочно требуют внимания</h2>
          </div>
          <div className="space-y-3">
            {urgent.slice(0, 3).map(t => (
              <div key={t.id} className="glass-card rounded-2xl p-4 flex items-center gap-4 hover-scale cursor-pointer"
                style={{ borderColor: "rgba(247,37,133,0.25)" }} onClick={() => setPage("tasks")}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#f72585" }} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.time && `${t.time} · `}{t.date}</p>
                </div>
                {t.reminder && <Icon name="Bell" size={14} style={{ color: "#f72585" }} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 animate-fade-in delay-500 opacity-0">
        <button onClick={() => { setPage("tasks"); }}
          className="glass-card rounded-2xl p-5 text-left hover-scale transition-all duration-200"
          style={{ borderColor: "rgba(6,214,214,0.25)" }}>
          <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ background: "rgba(6,214,214,0.15)" }}>
            <Icon name="Plus" size={20} style={{ color: "#06d6d6" }} />
          </div>
          <p className="font-semibold text-sm mb-1">Добавить задачу</p>
          <p className="text-xs text-muted-foreground">Создай новую задачу прямо сейчас</p>
        </button>
        <button onClick={() => pushNotif("🔔 Тест: не забудь про встречу в 15:00!", "reminder")}
          className="glass-card rounded-2xl p-5 text-left hover-scale transition-all duration-200"
          style={{ borderColor: "rgba(168,85,247,0.25)" }}>
          <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ background: "rgba(168,85,247,0.15)" }}>
            <Icon name="Bell" size={20} style={{ color: "#a855f7" }} />
          </div>
          <p className="font-semibold text-sm mb-1">Тест уведомления</p>
          <p className="text-xs text-muted-foreground">Проверить систему напоминаний</p>
        </button>
      </div>
    </div>
  );
}

function TasksPage({ tasks, allTasks, toggleTask, showAddTask, setShowAddTask, newTask, setNewTask, addTask, filterDone, setFilterDone }: {
  tasks: Task[]; allTasks: Task[]; toggleTask: (id: number) => void;
  showAddTask: boolean; setShowAddTask: (v: boolean) => void;
  newTask: { title: string; description: string; priority: Priority; date: string; time: string; reminder: boolean };
  setNewTask: (v: { title: string; description: string; priority: Priority; date: string; time: string; reminder: boolean }) => void;
  addTask: () => void;
  filterDone: "all" | "active" | "done"; setFilterDone: (v: "all" | "active" | "done") => void;
}) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-montserrat font-black text-4xl mb-1">Мои задачи</h1>
          <p className="text-muted-foreground">{allTasks.filter(t => !t.done).length} активных · {allTasks.filter(t => t.done).length} выполнено</p>
        </div>
        <button onClick={() => setShowAddTask(!showAddTask)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm hover-scale transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #a855f7, #06d6d6)", color: "white", boxShadow: "0 4px 20px rgba(168,85,247,0.4)" }}>
          <Icon name={showAddTask ? "X" : "Plus"} size={16} />
          {showAddTask ? "Отмена" : "Добавить"}
        </button>
      </div>

      {showAddTask && (
        <div className="glass-card rounded-3xl p-6 mb-6 animate-scale-in"
          style={{ borderColor: "rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.06)" }}>
          <h3 className="font-montserrat font-bold text-lg mb-4">Новая задача</h3>
          <div className="space-y-3">
            <input value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Название задачи..." className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "hsl(var(--foreground))" }} />
            <textarea value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Описание (необязательно)..." rows={2}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "hsl(var(--foreground))" }} />
            <div className="grid grid-cols-3 gap-3">
              <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                className="rounded-xl px-3 py-3 text-sm outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.12)", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}>
                <option value="high">🔥 Высокий</option>
                <option value="medium">⚡ Средний</option>
                <option value="low">🍃 Низкий</option>
              </select>
              <input type="date" value={newTask.date} onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                className="rounded-xl px-3 py-3 text-sm outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.12)", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
              <input type="time" value={newTask.time} onChange={e => setNewTask({ ...newTask, time: e.target.value })}
                className="rounded-xl px-3 py-3 text-sm outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.12)", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative w-10 h-6 flex-shrink-0" onClick={() => setNewTask({ ...newTask, reminder: !newTask.reminder })}>
                <div className="w-10 h-6 rounded-full transition-all duration-200"
                  style={{ background: newTask.reminder ? "linear-gradient(135deg, #a855f7, #06d6d6)" : "rgba(255,255,255,0.1)" }}>
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-200"
                    style={{ left: newTask.reminder ? "22px" : "4px" }} />
                </div>
              </div>
              <span className="text-sm text-muted-foreground">Включить напоминание</span>
              <Icon name="Bell" size={14} style={{ color: newTask.reminder ? "#a855f7" : "#6b7280" }} />
            </label>
            <button onClick={addTask}
              className="w-full py-3 rounded-xl font-semibold text-sm hover-scale transition-all"
              style={{ background: "linear-gradient(135deg, #a855f7, #06d6d6)", color: "white" }}>
              Добавить задачу
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6 animate-fade-in">
        {(["all", "active", "done"] as const).map(f => (
          <button key={f} onClick={() => setFilterDone(f)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={filterDone === f ? {
              background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(6,214,214,0.2))",
              border: "1px solid rgba(168,85,247,0.4)", color: "#a855f7"
            } : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280" }}>
            {f === "all" ? "Все" : f === "active" ? "Активные" : "Выполнено"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {tasks.map((task, i) => (
          <div key={task.id} className="glass-card rounded-2xl p-4 flex items-start gap-4 hover-scale transition-all duration-200 animate-fade-in opacity-0"
            style={{ animationDelay: `${i * 0.06}s`, borderColor: task.done ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)", opacity: undefined }}>
            <button onClick={() => toggleTask(task.id)}
              className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 transition-all duration-200"
              style={task.done ? {
                background: "linear-gradient(135deg, #a855f7, #06d6d6)",
                boxShadow: "0 0 12px rgba(168,85,247,0.5)"
              } : { border: "2px solid rgba(255,255,255,0.2)" }}>
              {task.done && <Icon name="Check" size={13} className="text-white" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-semibold text-sm" style={{
                  textDecoration: task.done ? "line-through" : "none",
                  color: task.done ? "#6b7280" : "hsl(var(--foreground))"
                }}>{task.title}</p>
                <span className={`priority-${task.priority} text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1`}>
                  <Icon name={PRIORITY_ICONS[task.priority]} size={10} />
                  {PRIORITY_LABELS[task.priority]}
                </span>
              </div>
              {task.description && <p className="text-xs text-muted-foreground mb-2">{task.description}</p>}
              <div className="flex items-center gap-3 flex-wrap">
                {task.date && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Icon name="Calendar" size={11} />{task.date}</span>}
                {task.time && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Icon name="Clock" size={11} />{task.time}</span>}
                {task.reminder && <span className="flex items-center gap-1 text-xs" style={{ color: "#a855f7" }}><Icon name="Bell" size={11} />Напоминание</span>}
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Icon name="CheckCircle2" size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Задач нет</p>
            <p className="text-sm">Добавь свою первую задачу!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarPage({ tasks, calendarDate, setCalendarDate, getDaysInMonth, getFirstDay, tasksForDay }: {
  tasks: Task[]; calendarDate: Date; setCalendarDate: (d: Date) => void;
  getDaysInMonth: (d: Date) => number; getFirstDay: (d: Date) => number;
  tasksForDay: (day: number) => Task[];
}) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const daysCount = getDaysInMonth(calendarDate);
  const firstDay = getFirstDay(calendarDate);
  const today = new Date();
  const selectedTasks = selectedDay ? tasksForDay(selectedDay) : [];

  const prevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));

  return (
    <div className="max-w-4xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-montserrat font-black text-4xl mb-1">Календарь</h1>
        <p className="text-muted-foreground">Планируй свои дни</p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 glass-card rounded-3xl p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="w-9 h-9 rounded-xl flex items-center justify-center hover-scale transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <Icon name="ChevronLeft" size={16} />
            </button>
            <h2 className="font-montserrat font-bold text-xl">{MONTHS_RU[calendarDate.getMonth()]} {calendarDate.getFullYear()}</h2>
            <button onClick={nextMonth} className="w-9 h-9 rounded-xl flex items-center justify-center hover-scale transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS_RU.map(d => (
              <div key={d} className="text-center text-xs font-medium py-2" style={{ color: "#6b7280" }}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysCount }).map((_, i) => {
              const day = i + 1;
              const dayTasks = tasksForDay(day);
              const isToday = today.getFullYear() === calendarDate.getFullYear() && today.getMonth() === calendarDate.getMonth() && today.getDate() === day;
              const isSelected = selectedDay === day;

              return (
                <button key={day} onClick={() => setSelectedDay(isSelected ? null : day)}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all duration-200 hover-scale relative"
                  style={isSelected ? {
                    background: "linear-gradient(135deg, #a855f7, #06d6d6)", color: "white",
                    boxShadow: "0 4px 16px rgba(168,85,247,0.4)"
                  } : isToday ? {
                    background: "rgba(168,85,247,0.2)", border: "1.5px solid rgba(168,85,247,0.5)", color: "#a855f7"
                  } : {
                    background: dayTasks.length > 0 ? "rgba(255,255,255,0.05)" : "transparent"
                  }}>
                  {day}
                  {dayTasks.length > 0 && !isSelected && (
                    <div className="absolute bottom-1 flex gap-0.5">
                      {dayTasks.slice(0, 3).map((t, idx) => (
                        <div key={idx} className="w-1 h-1 rounded-full"
                          style={{ background: t.priority === "high" ? "#f72585" : t.priority === "medium" ? "#ff6b35" : "#39ff14" }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-2 animate-slide-in-right">
          <div className="glass-card rounded-3xl p-5" style={{ minHeight: 300 }}>
            {selectedDay ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #a855f7, #06d6d6)" }}>
                    <span className="text-white font-bold text-sm">{selectedDay}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{selectedDay} {MONTHS_RU[calendarDate.getMonth()]}</p>
                    <p className="text-xs text-muted-foreground">{selectedTasks.length} задач</p>
                  </div>
                </div>
                {selectedTasks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTasks.map(t => (
                      <div key={t.id} className="rounded-xl p-3"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: t.priority === "high" ? "#f72585" : t.priority === "medium" ? "#ff6b35" : "#39ff14" }} />
                          <p className="text-sm font-medium flex-1 truncate"
                            style={{ textDecoration: t.done ? "line-through" : "none", color: t.done ? "#6b7280" : "inherit" }}>
                            {t.title}
                          </p>
                        </div>
                        {t.time && (
                          <p className="text-xs text-muted-foreground pl-4 flex items-center gap-1">
                            <Icon name="Clock" size={10} /> {t.time}
                            {t.reminder && <Icon name="Bell" size={10} style={{ color: "#a855f7" }} />}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon name="CalendarCheck" size={36} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm text-muted-foreground">Нет задач на этот день</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Icon name="Calendar" size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm text-muted-foreground">Выбери день,<br />чтобы увидеть задачи</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-6 animate-fade-in delay-300 opacity-0">
        {[{ color: "#f72585", label: "Срочные" }, { color: "#ff6b35", label: "Средние" }, { color: "#39ff14", label: "Обычные" }].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
            <span className="text-xs text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}