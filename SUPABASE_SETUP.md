# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in your project details:
   - Name: `document-management-system`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Update Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## 4. Create Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click "Create Bucket"
3. Bucket name: `documents`
4. Make it **Public** (so users can access uploaded files)
5. Click "Create bucket"

## 5. Set Up Storage Policies (Optional)

If you want to restrict access to files, you can set up Row Level Security (RLS) policies:

1. Go to **Storage** → **Policies**
2. Create policies for:
   - **SELECT**: Allow users to view files
   - **INSERT**: Allow authenticated users to upload files
   - **DELETE**: Allow admin users to delete files

## 6. Test the Integration

1. Start your development server: `npm run dev`
2. Log in as admin (`admin` / `admin123`)
3. Go to Admin Panel → Documents tab
4. Try uploading a file
5. Check your Supabase Storage dashboard to see the uploaded file
6. Go to Dashboard to view the uploaded document

## File Support

The application now supports:
- **Text files**: `.txt`, `.md`
- **Documents**: `.doc`, `.docx`, `.pdf`
- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`

All files are stored securely in Supabase Storage and can be accessed via direct links.

## Troubleshooting

### Common Issues:

1. **Upload fails**: Check your Supabase credentials in `.env`
2. **Files not showing**: Ensure the storage bucket is public
3. **CORS errors**: Verify your project URL is correct
4. **Large files fail**: Check Supabase storage limits (default: 50MB)

### Environment Variables Not Loading:
- Make sure your `.env` file is in the project root
- Restart your development server after updating `.env`
- Environment variables must start with `VITE_` for Vite projects