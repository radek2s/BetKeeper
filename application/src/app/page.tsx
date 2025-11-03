/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */

import Link from "next/link";
import { Button } from "../lib/components/button/Button";
import { IconButton } from "../lib/components/button/IconButton";

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.tailwind file.
   */
  return (
    <div>
      <header className="flex justify-between items-center mx-4 py-6">
        <div className="flex gap-2">
          <Link href="/profile">
            <img
              className="avatar h-[48px]"
              src="/avatars/avatar_01.png"
              alt="Profile"
            />
          </Link>
          <div>
            <span>Hi Monica!</span>
            <h1>Bets</h1>
          </div>
        </div>
        <div className="flex gap-1">
          <IconButton icon="notification" />
          <IconButton icon="group" />
        </div>
      </header>
      <section>
        <h2>Pending requests</h2>
      </section>
      <section>
        <h2>Unresolved</h2>
      </section>
      <section>
        <h2>Uncompleted</h2>
      </section>
      <Button>Show all</Button>
      <IconButton icon="add" variant="primary" />
    </div>
  );
}
