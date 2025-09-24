const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkContacts() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('abramovich-media');
    const collection = db.collection('contacts');
    
    const contacts = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    console.log(`\n📧 Found ${contacts.length} contact submissions:\n`);
    
    contacts.forEach((contact, index) => {
      console.log(`${index + 1}. ${contact.name} (${contact.email})`);
      console.log(`   Date: ${new Date(contact.createdAt).toLocaleString()}`);
      console.log(`   Message: ${contact.message.substring(0, 100)}${contact.message.length > 100 ? '...' : ''}`);
      console.log('   ---');
    });
    
    if (contacts.length === 0) {
      console.log('No contact submissions yet. Submit a test form first!');
    }
    
    await client.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkContacts();
