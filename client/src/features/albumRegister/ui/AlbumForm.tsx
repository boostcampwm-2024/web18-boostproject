import { Input } from '@/shared/ui';
interface AlbumFormProps {
  albumFormRef: React.RefObject<HTMLFormElement>;
}
export function AlbumForm({ albumFormRef }: AlbumFormProps) {
  return (
    <form ref={albumFormRef} className="col-span-2 flex flex-col gap-4">
      <Input labelName="앨범 이름 (50자 제한) *" name="title" />
      <Input labelName="앨범 아티스트 (50자 제한) *" name="artist" />
      <Input
        labelName="앨범 태그 (30자 제한, 쉼표와 공백 포함) *"
        name="albumTag"
        placeholder="힙합, 댄스, 국내"
      />
      <Input labelName="발매일 *" name="releaseDate" type="datetime-local" />
      <div className="text-grayscale-100 flex flex-col">
        <Input labelName="앨범 커버" name="albumCover" type="file" />
        <Input labelName="이벤트 배너" name="bannerCover" type="file" />
      </div>
    </form>
  );
}
