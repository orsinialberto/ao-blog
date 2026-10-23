import Image from "next/image";
import { withBasePath } from "@/lib/paths";

// Pin tip position as % of the image (x from left, y from top)
const pins = [
  { id: "spain", x: 46.2, y: 31.7 },
  { id: "italy", x: 51.5, y: 31 },
  { id: "cambodia", x: 77.8, y: 48.8 },
];

export function TravelsWorldMap() {
  return (
    <div className="relative mx-auto mb-16 w-full">
      <Image
        src={withBasePath("/images/world-map.png")}
        alt=""
        width={2558}
        height={1352}
        priority
        className="h-auto w-full mix-blend-multiply"
        sizes="(max-width: 1152px) 100vw, 1152px"
      />
      {pins.map((pin, i) => (
        <span
          key={pin.id}
          aria-hidden="true"
          className="world-pin text-brand-primary"
          style={{
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            animationDelay: `${400 + i * 350}ms`,
          }}
        >
          <svg viewBox="0 0 24 32" className="h-full w-full">
            <path
              d="M12.3 30.6C11.4 29.4 3.1 19.6 2.6 13.2 2.2 7.4 6.6 2.4 12.2 2.1c5.7-.3 9.9 4.3 9.3 10.4-.6 6.5-8.2 16.4-9.2 18.1Z"
              fill="currentColor"
            />
            <path
              d="M9.6 11.6c.4-1.6 2.3-2.3 3.6-1.5 1.3.8 1.4 2.8.2 3.7-1.2.9-3.2.5-3.8-.9-.1-.4-.1-.9 0-1.3Z"
              fill="white"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
