import { BentoGridThirdDemo } from "@/assets/BentoGrid";
import DotGrid from "@/assets/DotGrid";

export function Feed() {
  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full inset-0 -z-50 fixed bg-zinc-900">
        <DotGrid
          baseColor="#414141"
          dotSize={5}
          gap={15}
          resistance={2000}
          returnDuration={1}
          shockStrength={1}
          proximity={50}

        />
      </div>
      <div className="flex h-full w-full items-center justify-center p-6">
        <BentoGridThirdDemo />
      </div>
    </div>
  );
}
