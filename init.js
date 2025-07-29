const mongoose = require('mongoose');
const Chat = require('./models/chat.js');

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

main().then(res=>console.log('connected to mongoDB\n')).catch(err=>console.log('failed to establish connection with mongoDB\n'));

Chat.insertMany([
  {
    from: 'Aarav',
    to: 'Meera',
    msg: 'Hey Meera, hope your exam went well!',
    created_at: Date.now()
  },
  {
    from: 'Liam',
    to: 'Sanya',
    msg: 'Can you send the project files by tonight?',
    created_at: Date.now()
  },
  {
    from: 'Olivia',
    to: 'Ravi',
    msg: 'Loved your recent post, really inspiring!',
    created_at: Date.now()
  },
  {
    from: 'Ethan',
    to: 'Neha',
    msg: 'Let’s catch up this weekend, it’s been ages!',
    created_at: Date.now()
  }
]).then(res=>console.log(`msg sent `)).catch(err=>console.log('got error'));






