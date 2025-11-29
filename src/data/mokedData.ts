import { User, Document } from '../types';

export let users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: '2',
    username: 'user1',
    password: 'user123',
    role: 'user'
  }
];

export let documents: Document[] = [
  {
    id: '1',
    title: 'Welcome Document',
    content: 'This is the content of the welcome document.',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Project Guidelines',
    content: 'These are the project guidelines for all users.',
    createdAt: '2024-01-02'
  }
];

// Helper functions to manage data
export const addUser = (user: Omit<User, 'id'>) => {
  const newUser: User = {
    ...user,
    id: Date.now().toString()
  };
  users.push(newUser);
  return newUser;
};

export const addDocument = (document: Omit<Document, 'id' | 'createdAt'>) => {
  const newDocument: Document = {
    ...document,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0]
  };
  documents.push(newDocument);
  return newDocument;
};