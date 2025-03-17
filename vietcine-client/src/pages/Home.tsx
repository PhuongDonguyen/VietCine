import { NavBar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { HeroSection } from "../components/HeroSection"
import { FeaturedMovies } from "../components/FeatureMovies"
import { WhyChooseUs } from "../components/WhyChooseUs"
import { PromotionSection } from "../components/PromotionSection"

export default function Home() {
    return (
        <div className= "bg-black text-white min-h-screen" >
                {/* Navbar */ }
                < NavBar transparent = { true} />

                    {/* Hero Section */ }
                    < HeroSection />

                    {/* Main Content */ }
                    < main >
                    <FeaturedMovies />
                    < WhyChooseUs />
                    <PromotionSection />
                    </main>

            {/* Footer */ }
            <Footer />
        </div>
    )
}