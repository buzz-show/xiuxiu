import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

export function useCamera() {
  const supabase = useSupabaseClient()

  async function captureAndUpload(bucket: string, path: string): Promise<string | null> {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Blob,
        source: CameraSource.Prompt,
        allowEditing: true,
        width: 400,
      })
      if (!photo.blob) return null
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, photo.blob, { upsert: true, contentType: 'image/jpeg' })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path)
      return publicUrl
    } catch {
      return null
    }
  }

  return { captureAndUpload }
}
