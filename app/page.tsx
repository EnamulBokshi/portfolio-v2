import { getHomePortfolioData } from "@/services/portfolio-service";
import { MainDisplayContainer } from "@/components/shell/MainDisplayContainer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getHomePortfolioData();

  return <MainDisplayContainer initialData={data} />;
}
