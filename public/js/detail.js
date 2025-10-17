async function loadDetail(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '1';
  const res = await fetch('/api/events/' + id);
  const e = await res.json();
  if(!e){ document.getElementById('detail-area').innerHTML = '<p>未找到该活动。</p>'; return; }
  const progress = Math.min(100, Math.round((e.raised_amount / e.goal_amount) * 100));
  document.getElementById('detail-area').innerHTML = `
    <div class="card">
      <img src="images/event${(e.id%8)||8}.jpg" alt="活动图片">
      <div class="card-body">
        <h2>${e.title}</h2>
        <p class="meta">📍 ${e.location} · 📅 ${e.event_date} · 类别: ${e.category_name || ''}</p>
        <div class="progress-wrap"><div class="progress" style="width:${progress}%"></div></div>
        <p>筹款目标：¥${Number(e.goal_amount).toLocaleString()}</p>
        <p>已筹金额：¥${Number(e.raised_amount).toLocaleString()}</p>
        <p style="margin-top:12px;">这是由系统生成的活动介绍段落，用于展示活动目的与安排。在正式提交时，你可以替换为更详细的活动描述。</p>
        <button class="btn-inline" style="margin-top:10px">立即参与</button>
      </div>
    </div>
  `;
}
loadDetail();
