import { Button } from '@/components/ui/button'

export function RecordRoomAudio() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <Button>Gravar Áudio </Button>
      <p>Gravando....</p>
    </div>
  )
}
