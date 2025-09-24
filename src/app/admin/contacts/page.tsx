"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
      } else {
        setError('Failed to fetch contacts');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading contacts...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{backgroundColor: '#0A0A0C'}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{color: '#F7F10A'}}>
          Contact Form Submissions
        </h1>

        {contacts.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <p className="text-gray-300">No contact submissions yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {contacts.map((contact) => (
              <Card key={contact._id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex justify-between items-start">
                    <span>{contact.name}</span>
                    <span className="text-sm text-gray-400 font-normal">
                      {new Date(contact.createdAt).toLocaleString()}
                    </span>
                  </CardTitle>
                  <p className="text-gray-300">{contact.email}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 whitespace-pre-wrap">{contact.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={fetchContacts}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
