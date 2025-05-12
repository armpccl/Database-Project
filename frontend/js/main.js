const CAT_API = 'http://localhost:4000/api/books/categories';
window.addEventListener('DOMContentLoaded', async()=>{
  const cont = document.getElementById('categories');
  try {
    const r = await fetch(CAT_API);
    const cats = await r.json();
    cats.forEach(c=>{
      const d = document.createElement('div');
      d.className='category-card';
      d.innerHTML=`<h3>${c}</h3>`;
      d.onclick=()=>location=`books.html?cat=${encodeURIComponent(c)}`;
      cont.append(d);
    });
  } catch {
    cont.innerHTML='<p>Failed to load categories.</p>';
  }
});
