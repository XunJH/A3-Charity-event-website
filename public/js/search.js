async function loadCategories(){
  const res = await fetch('/api/categories');
  const cats = await res.json();
  const sel = document.getElementById('category');
  sel.innerHTML = '<option value="">全部类别</option>' + cats.map(c=>`<option value='${c.id}'>${c.name}</option>`).join('');
}
async function doSearch(){
  const date = document.getElementById('date').value;
  const location = document.getElementById('location').value;
  const category = document.getElementById('category').value;
  let q = [];
  if(date) q.push('date='+encodeURIComponent(date));
  if(location) q.push('location='+encodeURIComponent(location));
  if(category) q.push('category_id='+encodeURIComponent(category));
  const url = '/api/events/search' + (q.length?('?'+q.join('&')):'');
  const res = await fetch(url);
  const data = await res.json();
  const container = document.getElementById('results');
  container.innerHTML = '';
  if(!data || data.length===0){ container.innerHTML = '<p>未找到匹配的活动。</p>'; return; }
  data.forEach((e, idx)=>{
    const progress = Math.min(100, Math.round((e.raised_amount / e.goal_amount) * 100));
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<img src="images/event${(idx%8)+1}.jpg"><div class="card-body"><div class="card-title">${e.title}</div><div class="meta">📍 ${e.location} · 📅 ${e.event_date}</div><div class="progress-wrap"><div class="progress" style="width:${progress}%"></div></div><a class="btn-inline" href="event-detail.html?id=${e.id}">查看详情</a></div>`;
    container.appendChild(div);
  });
}
document.getElementById('searchBtn').addEventListener('click', doSearch);
document.getElementById('clearBtn').addEventListener('click', ()=>{ document.getElementById('date').value=''; document.getElementById('location').value=''; document.getElementById('category').value=''; document.getElementById('results').innerHTML=''; });
loadCategories();
