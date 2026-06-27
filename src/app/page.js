import { getFeaturedClasses } from "@/actions/classes";
import { getPublicForumPosts } from "@/actions/forum-posts";

import HowItWorksSection from "@/app/components/home/HowItWorksSection";
import CategoriesSection from "@/app/components/home/CategoriesSection";
import Banner from "@/app/components/home/Banner";
import FeaturedClassesSection from "@/app/components/home/FeaturedClassesSection";
import LatestForumSection from "./components/home/LatestForumSection";
import BmiCalculatorSection from "./components/home/BmiCalculatorSection";
export const dynamic = "force-dynamic";

export default async function HomePage() {
    const [featuredResult, postsResult] = await Promise.all([
        getFeaturedClasses(6),
        getPublicForumPosts({ page: 1, limit: 3 }),
    ]);

    return (
        <main className="min-h-screen bg-[#050505]">
            <Banner></Banner>
            <FeaturedClassesSection classes={featuredResult.classes} />
            <HowItWorksSection />
            <LatestForumSection posts={postsResult.posts} />
            <CategoriesSection /> 
            <BmiCalculatorSection></BmiCalculatorSection>
        </main>
    );
}