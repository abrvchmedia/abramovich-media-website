import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    await connectDB();

    // Get contacts from the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recentContacts = await Contact.find({
      createdAt: { $gte: yesterday }
    }).sort({ createdAt: -1 });

    // Get total contacts count
    const totalContacts = await Contact.countDocuments();

    // Create email transporter (using Gmail as example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
      },
    });

    // Create email content
    const emailContent = `
      <h2>📊 Daily Contact Report - Abramovich Media</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>New Inquiries (Last 24h):</strong> ${recentContacts.length}</p>
      <p><strong>Total Inquiries:</strong> ${totalContacts}</p>
      
      ${recentContacts.length > 0 ? `
        <h3>📧 New Inquiries:</h3>
        ${recentContacts.map((contact, index) => `
          <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
            <h4>${index + 1}. ${contact.name}</h4>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Time:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f5f5f5; padding: 10px; border-radius: 3px;">${contact.message}</p>
          </div>
        `).join('')}
      ` : `
        <p>✅ No new inquiries in the last 24 hours.</p>
      `}
      
      <hr>
      <p><small>View all contacts: <a href="https://abramovich-media.vercel.app/admin/contacts">Admin Dashboard</a></small></p>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.REPORT_EMAIL || process.env.EMAIL_USER,
      subject: `📊 Daily Report: ${recentContacts.length} New Inquiries - Abramovich Media`,
      html: emailContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Daily report sent successfully',
      newContacts: recentContacts.length,
      totalContacts,
    });

  } catch (error) {
    console.error('Daily report error:', error);
    return NextResponse.json(
      { error: 'Failed to send daily report' },
      { status: 500 }
    );
  }
}
