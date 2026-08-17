import { getHomePortfolioData } from "@/services/portfolio-service";
import { MainDisplayContainer } from "@/components/shell/MainDisplayContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  generateProjectsItemListSchema,
  generateSkillsItemListSchema,
  generateExperiencesSchema,
} from "@/services/seo-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getHomePortfolioData();

  const pageSchemas = [
    generateProjectsItemListSchema(data.projects),
    generateSkillsItemListSchema(data.skills),
    generateExperiencesSchema(data.experiences),
  ].filter(Boolean);

  return (
    <>
      <JsonLd data={pageSchemas} />
      <MainDisplayContainer initialData={data} />
    </>
  );
}
