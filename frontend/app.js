let currentUserId = null;

document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    if (data.userId) {
        currentUserId = data.userId;
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', username);
        window.location.href = '/index.html';
    } else {
        alert('Login failed');
    }
});

document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    
    const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (response.status === 201) {
        alert('Registration successful! Please login.');
    } else {
        alert('Registration failed - username may be taken');
    }
});

if (document.getElementById('username')) {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    
    if (!userId) {
        window.location.href = '/login.html';
    } else {
        currentUserId = userId;
        document.getElementById('username').textContent = username;
        loadSessions();
    }
}

document.getElementById('session-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const duration = document.getElementById('duration').value;
    
    await fetch('/api/sessions/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, duration })
    });
    
    document.getElementById('duration').value = '';
    loadSessions();
});

async function loadSessions() {
    const response = await fetch(`/api/sessions/sessions/${currentUserId}`);
    const sessions = await response.json();
    
    const list = document.getElementById('sessions-list');
    list.innerHTML = sessions.map(s => 
        `<li>${new Date(s.date).toLocaleDateString()} - ${s.duration} minutes</li>`
    ).join('');
}