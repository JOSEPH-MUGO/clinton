import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging for development
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing'
  })
}

if (supabaseUrl?.includes('your-project-url') || supabaseAnonKey?.includes('your-anon-key')) {
  console.error('Please update your Supabase credentials in .env file')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Storage bucket name for documents
export const STORAGE_BUCKET = 'document-files'

// Helper function to check if the storage bucket exists
export const checkBucketExists = async (): Promise<{ exists: boolean; error?: string; buckets?: string[] }> => {
  try {
    console.log('🔍 Checking if bucket exists:', STORAGE_BUCKET)
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Failed to list buckets:', listError)
      return { exists: false, error: `Failed to check buckets: ${listError.message}` }
    }

    console.log('📋 Available buckets:', buckets?.map(b => b.name))
    
    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET)
    
    return { 
      exists: bucketExists, 
      buckets: buckets?.map(b => b.name) || []
    }
  } catch (error) {
    console.error('❌ Error checking buckets:', error)
    return { exists: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Helper function with instructions for manual bucket creation
export const getBucketCreationInstructions = () => {
  return `To create the storage bucket manually:
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to Storage in the left sidebar
4. Click "Create Bucket"
5. Name: "${STORAGE_BUCKET}"
6. Make it Public (toggle ON)
7. Click "Create bucket"

This needs to be done manually due to Row Level Security policies.`
}

// Test function to verify Supabase connection
export const testSupabaseConnection = async (): Promise<{ success: boolean; error?: string; details?: any }> => {
  try {
    console.log('🧪 Testing Supabase connection...')
    
    // Test 1: Check if we can list buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      return { 
        success: false, 
        error: `Cannot list buckets: ${listError.message}`,
        details: listError
      }
    }

    // Test 2: Find our documents bucket
    const documentsBucket = buckets?.find(bucket => bucket.name === STORAGE_BUCKET)
    
    if (!documentsBucket) {
      return {
        success: false,
        error: `Bucket "${STORAGE_BUCKET}" not found`,
        details: { availableBuckets: buckets?.map(b => b.name) }
      }
    }

    // Test 3: Check if bucket is public
    const isPublic = documentsBucket.public

    return {
      success: true,
      details: {
        bucketExists: true,
        isPublic: isPublic,
        bucketInfo: documentsBucket,
        totalBuckets: buckets?.length
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown connection error',
      details: error
    }
  }
}

// Helper function to upload file to Supabase Storage
export const uploadFile = async (file: File): Promise<{ path: string; error?: string }> => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      return { path: '', error: 'Supabase configuration is missing. Please check your .env file.' }
    }

    if (supabaseUrl.includes('your-project-url') || supabaseAnonKey.includes('your-anon-key')) {
      return { path: '', error: 'Please update your Supabase credentials in .env file.' }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
    
    console.log('🔄 Upload Details:', {
      fileName,
      fileSize: file.size,
      fileType: file.type,
      bucketName: STORAGE_BUCKET,
      supabaseUrl: supabaseUrl?.substring(0, 30) + '...',
      hasAnonKey: !!supabaseAnonKey
    })
    
    // Check if the bucket exists before uploading
    const bucketCheck = await checkBucketExists()
    if (bucketCheck.error) {
      console.error('❌ Bucket check failed:', bucketCheck.error)
      return { path: '', error: bucketCheck.error }
    }
    
    if (!bucketCheck.exists) {
      console.error('❌ Bucket does not exist')
      return { 
        path: '', 
        error: `Storage bucket "${STORAGE_BUCKET}" not found. Please create it manually in your Supabase dashboard:\n\n${getBucketCreationInstructions()}` 
      }
    }

    console.log('✅ Bucket exists, proceeding with upload...')
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file)

    console.log('📤 Upload Response:', { 
      success: !!data, 
      error: error?.message,
      dataPath: data?.path 
    })

    if (error) {
      console.error('❌ Supabase storage error:', error)
      if (error.message.includes('Bucket not found')) {
        return { 
          path: '', 
          error: `Please create a storage bucket named "${STORAGE_BUCKET}" in your Supabase dashboard (Storage → Create Bucket → Name: "${STORAGE_BUCKET}" → Make it Public → Create)` 
        }
      }
      if (error.message.includes('policies') || error.message.includes('policy')) {
        return { 
          path: '', 
          error: `Storage policy error: ${error.message}. You may need to set up storage policies for uploads in your Supabase dashboard.` 
        }
      }
      if (error.message.includes('JWT') || error.message.includes('authentication')) {
        return { 
          path: '', 
          error: `Authentication error: ${error.message}. Please check your Supabase credentials.` 
        }
      }
      return { path: '', error: `Storage error: ${error.message}` }
    }

    if (!data) {
      return { path: '', error: 'Upload failed: No data returned' }
    }

    console.log('File uploaded successfully:', data.path)
    return { path: data.path }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { path: '', error: error instanceof Error ? error.message : 'Upload failed' }
  }
}

// Helper function to get public URL for a file
export const getFileUrl = (path: string): string => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Helper function to delete a file from storage
export const deleteFile = async (path: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path])

    if (error) {
      throw error
    }

    return {}
  } catch (error) {
    console.error('Error deleting file:', error)
    return { error: error instanceof Error ? error.message : 'Delete failed' }
  }
}