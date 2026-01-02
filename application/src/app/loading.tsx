import { IconButton } from "@app/ui/button/IconButton";

export default function Loading() {
  return (
    <div className="min-h-dvh flex flex-col items-center">
      <header className="my-4 px-4 flex w-full justify-between">
        <div className="flex gap-2 items-center">
          <IconButton icon="chevron-left" />

          <h1 className="font-bold">Loading...</h1>
        </div>
      </header>
    </div>
  );
}
