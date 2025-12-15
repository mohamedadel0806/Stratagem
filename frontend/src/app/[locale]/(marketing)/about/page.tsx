import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | GRC Platform",
  description: "Learn more about our mission to modernize GRC in the Middle East.",
}

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          About Us
        </h1>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          We are dedicated to simplifying Governance, Risk, and Compliance for organizations across the Middle East.
        </p>
      </div>
      <div className="mx-auto max-w-[58rem] mt-10 space-y-6">
        <p className="leading-7">
          Founded in 2024, our mission is to bring cutting-edge technology to the world of GRC. We understand the unique challenges faced by businesses in Saudi Arabia, UAE, and Egypt, and we have built a platform tailored to meet those needs.
        </p>
        <p className="leading-7">
          Our team consists of experts in compliance, risk management, and artificial intelligence. We are passionate about helping organizations build trust, ensuring resilience, and driving sustainable growth.
        </p>
        <h2 className="font-heading text-2xl leading-[1.1] sm:text-2xl md:text-4xl mt-8">
          Our Vision
        </h2>
        <p className="leading-7">
          To be the leading AI-powered GRC platform in the MENA region, empowering organizations to navigate complex regulatory landscapes with confidence and ease.
        </p>
      </div>
    </div>
  )
}