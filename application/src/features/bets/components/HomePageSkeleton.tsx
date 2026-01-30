function HomePageSkeleton() {
  return (
    <div className="m-4 flex flex-col items-center">
      <header className="flex justify-between w-[100dvw] px-4 items-center">
        <div className="flex items-center gap-1">
          <div className="skeleton rounded h-[48px] w-[48px]" />
          <div className="skeleton h-[32px] w-[128px]"></div>
        </div>
        <div className="flex gap-1">
          <div className="skeleton rounded h-[36px] w-[36px]" />
          <div className="skeleton rounded h-[36px] w-[36px]" />
        </div>
      </header>
      <div className="w-[400px] mt-4">
        <BetSearchSkeleton />
        <BetBrowserSkeleton />
      </div>
    </div>
  );
}

export function BetSearchSkeleton() {
  return (
    <>
      <div className="skeleton h-[40px] w-full" />
      <div className="flex gap-2 justify-around mt-4">
        <div className="skeleton rounded h-[60px] w-[60px]" />
        <div className="skeleton rounded h-[60px] w-[60px]" />
        <div className="skeleton rounded h-[60px] w-[60px]" />
        <div className="skeleton rounded h-[60px] w-[60px]" />
      </div>
    </>
  );
}
export function BetBrowserSkeleton() {
  return (
    <div className="flex flex-col mt-6 gap-2">
      <div className="skeleton h-[128px]" />
      <div className="skeleton h-[128px]" />
    </div>
  );
}
export default HomePageSkeleton;
