import { createServiceClient } from './supabase'

const BUCKET = 'mnr-photos'
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export type PhotoKind = 'before' | 'healing' | 'longterm'

// 업로드 성공 시 storage 내 path 반환 (DB에는 이 path를 저장)
export async function uploadPhoto(file: File, serialToken: string, kind: PhotoKind): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('이미지 파일만 업로드할 수 있습니다.')
  if (file.size > MAX_SIZE) throw new Error('사진은 10MB 이하여야 합니다.')
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${serialToken}/${kind}-${Date.now()}.${ext}`
  const supabase = createServiceClient()
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type })
  if (error) throw new Error('사진 업로드에 실패했습니다.')
  return path
}
