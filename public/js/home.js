async function loadEvents(){
  const res = await fetch('/api/events');
  const data = await res.json();
  const container = document.getElementById('events');
  if(!data || data.length===0){ container.innerHTML='<p>当前没有活动。</p>'; return; }
  data.forEach((e, idx) => {
    const progress = Math.min(100, Math.round((e.raised_amount / e.goal_amount) * 100));
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="images/event${(idx%8)+1}.jpg" alt="活动图片">
      <div class="card-body">
        <div class="card-title">${e.title}</div>
        <div class="meta">📍 ${e.location} · 📅 ${e.event_date} · ${e.category_name || ''}</div>
        <div class="progress-wrap"><div class="progress" style="width:${progress}%"></div></div>
        <a class="btn-inline" href="event-detail.html?id=${e.id}">查看详情</a>
      </div>
    `;
    container.appendChild(card);
  });
}
loadEvents();
