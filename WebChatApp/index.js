// index.js

const express = require('express');
const { QuickDB } = require('quick.db');
const app = express();
const port = 3000;

const db = new QuickDB();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/stylesheet'));

app.get('/', async (req, res) => {
    const storedMessages = await db.get('messages') || [];
    res.render('index', { messages: storedMessages });
});

app.post('/send-message', express.urlencoded({ extended: true }), async (req, res) => {
    const { username, message } = req.body;

    if (!username || !message || username.trim() === '' || message.trim() === '') {
        return res.send('<script>alert("Lütfen geçerli bir kullanıcı adı ve mesaj girin."); window.location.href = "/";</script>');
    }

    if (username.toLowerCase() === 'admreset') {
        await db.delete('messages');
        return res.redirect('/');
    }

    const timestamp = new Date().toLocaleString();
    const formattedTimestamp = `[${timestamp}]`;

    const messages = await db.get('messages') || [];
    messages.push({ username, message, timestamp: formattedTimestamp, highlight: true });
    await db.set('messages', messages);

    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
