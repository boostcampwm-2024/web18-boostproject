import { Input } from '@/shared/ui';

interface SongFormProps {
  songFormRef: React.RefObject<HTMLFormElement>;
}

export function SongForm({ songFormRef }: SongFormProps) {
  return (
    <form ref={songFormRef} className="col-span-2 grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Input labelName="노래 제목 (30자 제한)" name="title" />
      </div>
      <div className="flex flex-col gap-4">
        <Input labelName="작곡가" name="composer" />
        <Input labelName="프로듀서" name="producer" />
        <Input labelName="노래 순서" name="trackNumber" placeholder="예시) 1" />
      </div>
      <div className="flex flex-col gap-4">
        <Input labelName="작사가" name="writer" />
        <Input labelName="연주/가수" name="instrument" />
        <Input labelName="출처 (50자 제한)" name="source" />
      </div>
      <div className="col-span-2">
        <label className="text-grayscale-100 text-sm">가사</label>
        <textarea
          name="lyrics"
          className="w-full rounded resize-none min-h-[194px] px-2 py-2"
        />
      </div>
      <div className="text-grayscale-100 col-span-2">
        <Input labelName="파일 등록" name="songFile" type="file" />
      </div>
    </form>
  );
}

SongForm.displayName = 'SongForm';
