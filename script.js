// ==== 月間カレンダー描画（Googleカレンダー風の7×6マス） ====

// 要素参照
const $title = document.getElementById("title");
const $grid = document.getElementById("grid");
const $weekday = document.getElementById("weekday");
const $prev = document.getElementById("prev");
const $next = document.getElementById("next");
const $today = document.getElementById("today");

// 状態
let current = new Date(); // 現在表示の基準（年・月のみ使用）

// 曜日ヘッダー（固定）
const weekLabels = ["日","月","火","水","木","金","土"];
$weekday.innerHTML = weekLabels.map(w => `<div>${w}</div>`).join("");

// ダミー予定（後でローカルストレージに差し替え可）
const demoEvents = {
  // "YYYY-MM-DD": ["テキスト", ...]
};

// ユーティリティ
const fmt = new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long" });
const iso = (y,m,d) => `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

function daysInMonth(y, mZeroBase) {
  return new Date(y, mZeroBase + 1, 0).getDate();
}

function render() {
  const y = current.getFullYear();
  const m0 = current.getMonth();           // 0始まりの月
  const m = m0 + 1;                        // 1-12
  $title.textContent = `${fmt.format(current)}`;

  $grid.innerHTML = ""; // クリア

  // その月の1日の曜日（0=日…6=土）
  const firstW = new Date(y, m0, 1).getDay();
  const dim = daysInMonth(y, m0);

  // 前月表示に必要な日数
  const prevDim = daysInMonth(y, m0 - 1);
  const prevStart = prevDim - firstW + 1;

  // 42マス（7×6）を埋める
  let cells = [];

  // 前月ぶん
  for (let d = prevStart; d <= prevDim; d++) {
    cells.push({ y, m: m0 === 0 ? 12 : m0, d, other: true, dateObj: new Date(y, m0-1, d) });
  }
  // 当月ぶん
  for (let d = 1; d <= dim; d++) {
    cells.push({ y, m, d, other: false, dateObj: new Date(y, m0, d) });
  }
  // 残りは翌月ぶん
  const rest = 42 - cells.length;
  for (let d = 1; d <= rest; d++) {
    cells.push({ y, m: m0 === 11 ? 1 : m0 + 2, d, other: true, dateObj: new Date(y, m0+1, d) });
  }

  const today = new Date();
  const isSameDay = (A,B) =>
    A.getFullYear()===B.getFullYear() && A.getMonth()===B.getMonth() && A.getDate()===B.getDate();

  // 描画
  for (const c of cells) {
    const div = document.createElement("div");
    div.className = "cell" + (c.other ? " other-month" : "") + (isSameDay(c.dateObj, today) ? " today" : "");

    // 右上の日付
    const num = document.createElement("div");
    num.className = "date";
    num.textContent = c.d;
    div.appendChild(num);

    // 予定（デモ）
    const key = iso(c.dateObj.getFullYear(), c.dateObj.getMonth()+1, c.dateObj.getDate());
    const events = demoEvents[key] || [];
    if (events.length) {
      events.slice(0, 2).forEach(t => {
        const badge = document.createElement("div");
        badge.className = "event";
        badge.textContent = t;
        div.appendChild(badge);
      });
    }

    $grid.appendChild(div);
  }
}

// ナビゲーション
$prev.addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  render();
});
$next.addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  render();
});
$today.addEventListener("click", () => {
  const now = new Date();
  current = new Date(now.getFullYear(), now.getMonth(), 1);
  render();
});

// 初期化
render();
