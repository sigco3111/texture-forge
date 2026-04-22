export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#1a1a1a] border-b border-[#333333]">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎨</span>
        <h1 className="text-lg font-bold text-[#e0e0e0]">텍스처 포지</h1>
      </div>
      <span className="text-xs text-[#999999]">절차적 텍스처 생성기</span>
    </header>
  );
}