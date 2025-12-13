import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>PharmaInnovate AI - Transform Pharmaceutical Data Into Innovation</title>
        <meta name="description" content="AI-powered pharmaceutical innovation platform. Identify drug repurposing opportunities, analyze clinical trials, and make data-driven innovation decisions." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <Hero />
          <section id="features">
            <Features />
          </section>
          <section id="how-it-works">
            <HowItWorks />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
