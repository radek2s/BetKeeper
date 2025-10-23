import NextUserRepository from "application/src/core/repositories/NextUserRepository";

interface UserDetailsProps {
  params: { userId: string };
}
export default async function User({ params }: UserDetailsProps) {
  const { userId } = params;
  const userRepository = new NextUserRepository();

  const user = await userRepository.findById(userId);

  if (user) return <div>{user.name}</div>;

  return <div>User with {userId} was not found!</div>;
}
