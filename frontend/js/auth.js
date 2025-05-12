const API = 'http://localhost:4000/api/auth';
async function loginUser(){
  const email = document.getElementById('email').value;
  const password = document.getElementById('pwd').value;
  const err = document.getElementById('error');
  err.textContent='';
  const res = await fetch(`${API}/login`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({email,password})
  });
  if(!res.ok){
    const {error} = await res.json();
    return err.textContent=error;
  }
  const {token} = await res.json();
  localStorage.setItem('token',token);
  const { role } = JSON.parse(atob(token.split('.')[1]));
  location = role==='admin'
    ? 'admin/dashboard.html'
    : 'index.html';
}

async function registerUser(){
  const data = {
    username:document.getElementById('username').value,
    email:document.getElementById('email').value,
    password:document.getElementById('pwd').value,
    fname:document.getElementById('fname').value,
    lname:document.getElementById('lname').value,
    phone:document.getElementById('phone').value
  };
  if(!/^\d{10}$/.test(data.phone)){
    return document.getElementById('error').textContent='Phone must be 10 digits';
  }
  const res = await fetch(`${API}/register`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  if(!res.ok){
    const {error} = await res.json();
    return document.getElementById('error').textContent=error;
  }
  alert('Registered! Please login.');
  location='login.html';
}

export { loginUser, registerUser };
