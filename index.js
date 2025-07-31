const express = require('express');
const port = 4000;
const app = express();

const mongoose = require('mongoose');
const path = require('path');
const Chat = require('./models/chat.js');
const override = require('method-override');
const ExpErr = require('./ExpErr.js');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

main()
    .then(res => console.log('connected to mongoDB\n'))
    .catch(err => console.log('failed to establish connection with mongoDB\n'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(override('_method'));

app.listen(port, (req, res) => {
    console.log(`listening on http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('<h1> Animesh <h1/>');
});

app.get('/chats', async (req, res) => {
    let chats = await Chat.find();
    res.render('index.ejs', { chats });
});

app.get('/chats/new', (req, res) => {
    res.render('new.ejs');
});

app.post('/chats', (req, res, next) => {
    let { from, msg, to } = req.body;

    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: Date.now()
    });

    newChat.save()
        .then(res => console.log('chat saved'))
        .catch(err => console.log(err));

    res.redirect('/chats');
});

app.get('/chats/:id', async (req, res, next) => {
    try {
        let { id } = req.params;
        let chat = await Chat.findById(id);

        if (!chat) {
            next(new ExpErr(404, 'Bad request'));
        }

        res.render('edit.ejs', { chat });
    } catch (err) {
        next(err);
    }
});

app.get('/chats/:id/edit', async (req, res, next) => {
    try {
        let { id } = req.params;
        let chat = await Chat.findById(id);

        res.render('edit.ejs', { chat });
    } catch (err) {
        next(err);
    }
});

app.put('/chats/:id', async (req, res, next) => {
    try {
        let { id } = req.params;
        let { from, msg, to } = req.body;

        await Chat.findByIdAndUpdate(id, {
            from: from,
            msg: msg,
            to: to
        });

        res.redirect('/chats');
    } catch (err) {
        next(err);
    }
});

app.delete('/chats/:id', async (req, res) => {
    let { id } = req.params;

    await Chat.findByIdAndDelete(id);

    res.redirect('/chats');
});
