diff --git a//dev/null b/script.js
index 0000000000000000000000000000000000000000..458b962d749c2e342466a0bcf2654a772ec33c70 100644
--- a//dev/null
+++ b/script.js
@@ -0,0 +1,83 @@
+const titleElement = document.getElementById('calendar-title');
+const daysContainer = document.getElementById('calendar-days');
+const prevButton = document.getElementById('prev-month');
+const nextButton = document.getElementById('next-month');
+
+const today = new Date();
+let currentYear = today.getFullYear();
+let currentMonth = today.getMonth();
+
+const formatter = new Intl.DateTimeFormat('ja-JP', {
+  year: 'numeric',
+  month: 'long'
+});
+
+function createDayElement(day, { isCurrentMonth = true, isToday = false } = {}) {
+  const dayElement = document.createElement('div');
+  dayElement.textContent = day;
+  dayElement.classList.add('calendar__day');
+
+  if (!isCurrentMonth) {
+    dayElement.classList.add('calendar__day--inactive');
+  }
+
+  if (isToday) {
+    dayElement.classList.add('calendar__day--today');
+  }
+
+  return dayElement;
+}
+
+function renderCalendar(year, month) {
+  const firstDayOfMonth = new Date(year, month, 1);
+  const lastDayOfMonth = new Date(year, month + 1, 0);
+  const lastDayOfPreviousMonth = new Date(year, month, 0);
+
+  const leadingEmptyDays = firstDayOfMonth.getDay();
+  const totalDaysInMonth = lastDayOfMonth.getDate();
+  const totalDaysInPreviousMonth = lastDayOfPreviousMonth.getDate();
+
+  daysContainer.innerHTML = '';
+  titleElement.textContent = formatter.format(firstDayOfMonth);
+
+  for (let i = leadingEmptyDays; i > 0; i -= 1) {
+    const dayNumber = totalDaysInPreviousMonth - i + 1;
+    daysContainer.appendChild(createDayElement(dayNumber, { isCurrentMonth: false }));
+  }
+
+  for (let day = 1; day <= totalDaysInMonth; day += 1) {
+    const isToday =
+      year === today.getFullYear() &&
+      month === today.getMonth() &&
+      day === today.getDate();
+
+    daysContainer.appendChild(createDayElement(day, { isToday }));
+  }
+
+  const totalCells = leadingEmptyDays + totalDaysInMonth;
+  const trailingDays = (7 - (totalCells % 7)) % 7;
+
+  for (let day = 1; day <= trailingDays; day += 1) {
+    daysContainer.appendChild(createDayElement(day, { isCurrentMonth: false }));
+  }
+}
+
+prevButton.addEventListener('click', () => {
+  currentMonth -= 1;
+  if (currentMonth < 0) {
+    currentMonth = 11;
+    currentYear -= 1;
+  }
+  renderCalendar(currentYear, currentMonth);
+});
+
+nextButton.addEventListener('click', () => {
+  currentMonth += 1;
+  if (currentMonth > 11) {
+    currentMonth = 0;
+    currentYear += 1;
+  }
+  renderCalendar(currentYear, currentMonth);
+});
+
+renderCalendar(currentYear, currentMonth);
