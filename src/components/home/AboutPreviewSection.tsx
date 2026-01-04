import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/paths";
import { strings } from "@/config/strings";

export function AboutPreviewSection() {
  return (
    <section className="relative">
      <div className="relative flex flex-col px-4 lg:px-24 lg:flex-row">
        {/* Image */}
        <div className="relative w-full aspect-square">
          <Image
            src={withBasePath("/images/moto-profile.JPG")}
            alt="Alberto in moto"
            fill
            className="object-cover"
            sizes="max-width: 1024px"
            loading="lazy"
          />
        </div>

        {/* Text Box */}
        <div className="relative w-full flex items-start justify-center pt-8 md:pt-12 md:pb-12 lg:aspect-square lg:items-center lg:pt-0 lg:pb-0" >
          <div className="space-y-6 text-center lg:text-left lg:px-24">
            <h2 className="font-klee text-4xl font-normal text-brand-primary pb-6">
              {strings.components.aboutPreview.title}
            </h2>
            <div className="space-y-4 text-brand-muted pb-6">
              <p className="font-klee text-base leading-relaxed">
                {strings.components.aboutPreview.description1}
              </p>
              <p className="font-klee text-base leading-relaxed">
                {strings.components.aboutPreview.description2}
              </p>
            </div>
            <div className="flex justify-center lg:justify-start">
              <Link
                href="/about"
                className="inline-flex w-fit items-center justify-center bg-sky-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
              >
                {strings.components.aboutPreview.aboutLink}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

