import HomePage from "@/app/components/HomePage";

// Key figures are computed at render: refresh daily (the GitHub calendar revalidates every 6 h)
export const revalidate = 86400;

export default function Home() {
  return <HomePage lang="fr" />;
}
