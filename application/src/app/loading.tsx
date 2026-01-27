export default function Loading() {
  return (
    <div className="min-h-dvh flex flex-col items-center">
      <header className="my-4 px-4 flex w-full justify-between">
        <div className="flex gap-2 items-center">
          <div className="skeleton rounded h-[48px] w-[48px]" />
          <div className="skeleton h-[32px] w-[128px]" />
        </div>
      </header>
      <div className="flex justify-center">
        <div className="loader-icon" />
      </div>
    </div>
  );
}
