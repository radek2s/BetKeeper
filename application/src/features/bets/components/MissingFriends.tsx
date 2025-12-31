"use server";
import { Button } from "@app/ui/button/Button";
import Image from "next/image";
import Link from "next/link";

export async function MissingFriends() {
  return (
    <div className="flex flex-col items-center text-center my-4">
      <Image
        width={300}
        height={100}
        src={"/quiet-street.svg"}
        alt="Empty street"
      />
      <p className="my-1">Seems that you does not have any friend yet?</p>
      <p className="text-sm">
        Try to invite someone to your friend list to create your first bet!
      </p>
      <Link href={"/friends"} className="my-4">
        <Button variant="primary">Move to friend list</Button>
      </Link>
    </div>
  );
}
// export default MissingFriends;
