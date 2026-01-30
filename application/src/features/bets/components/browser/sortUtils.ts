interface WithCreatedAt {
  createdAt: string;
}
export function sortByCreatedAt(a: WithCreatedAt, b: WithCreatedAt) {
  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();

  return bTime - aTime;
}

interface WithUpdatedAt {
  updatedAt: string;
}
export function sortByUpdatedAt(a: WithUpdatedAt, b: WithUpdatedAt) {
  const aTime = new Date(a.updatedAt).getTime();
  const bTime = new Date(b.updatedAt).getTime();

  return bTime - aTime;
}
