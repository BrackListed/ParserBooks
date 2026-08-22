import { BentoGrid, BentoGridItem } from "@/ui/bento-grid";
import DotGrid from "@/assets/DotGrid";
import PillNav from "@/assets/PillNav";
import {
  Sparkles,
  ImagePlus,
  Users,
  Heart,
  MessageSquare,
  Bell,
  TrendingUp,
  User,
} from "lucide-react";

const recentLikes = [
  { name: "Alex Chen", initials: "AC", action: "liked your post", time: "2m ago" },
  { name: "Maria Lopez", initials: "ML", action: "liked your post", time: "18m ago" },
  { name: "Sam Patel", initials: "SP", action: "liked your comment", time: "1h ago" },
  { name: "Riya Kapoor", initials: "RK", action: "liked your post", time: "3h ago" },
];

export function Feed() {
  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full inset-0 -z-50 fixed bg-(--app-bg)">
        <DotGrid
          baseColor="#1b3038"
          activeColor="#00f0ff"
          dotSize={5}
          gap={15}
          resistance={2000}
          returnDuration={1}
          shockStrength={1}
          proximity={50}

        />
      </div>
      <div className="flex h-full w-full p-6 flex-col gap-10 text-white font-mono overflow-y-auto">
        <div className="flex w-full justify-center">
          <PillNav
          logo=""
          items={[
            { label: 'Home', href: '/' },
            { label: 'Feed', href: '/feed' },
            { label: 'Contacts', href: '/services' },
            { label: 'Settings', href: '/contact' }
          ]}
          activeHref="/"
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#00f0ff"
          pillColor="#0b0f17"
          hoveredPillTextColor="#05060b"
          pillTextColor="#00f0ff"
          initialLoadAnimation={false}
/>
        </div>
        <div className="mt-8">
          <BentoGrid>
            <BentoGridItem colSpan={1}>
              <div className="flex h-full flex-col justify-between">
                <Sparkles className="h-5 w-5 text-(--app-accent) drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]" />
                <div>
                  <div className="bg-linear-to-r from-(--app-accent) to-(--app-accent-2) bg-clip-text font-sans text-3xl font-extrabold text-transparent drop-shadow-[0_0_18px_rgba(0,240,255,0.35)]">
                    Carreire
                  </div>
                  <p className="mt-1 font-sans text-xs text-neutral-400">
                    Stay connected, stay seen.
                  </p>
                </div>
              </div>
            </BentoGridItem>

            <BentoGridItem
              colSpan={1}
              icon={<ImagePlus className="h-4 w-4 text-(--app-accent)" />}
              title="128"
              description="Posts uploaded this month"
            />

            <BentoGridItem
              colSpan={1}
              icon={<Users className="h-4 w-4 text-(--app-accent)" />}
              title="4.2K"
              description="Followers"
            />

            <BentoGridItem colSpan={2}>
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-2 font-sans font-bold text-neutral-100">
                  <Heart className="h-4 w-4 text-(--app-accent-2) drop-shadow-[0_0_6px_rgba(255,43,214,0.6)]" />
                  Recent Likes
                </div>
                <div className="mt-3 flex flex-1 flex-col justify-between gap-2">
                  {recentLikes.map((like) => (
                    <div key={like.name} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--app-accent)/15 font-sans text-xs font-semibold text-(--app-accent)">
                        {like.initials}
                      </div>
                      <div className="flex flex-1 items-baseline justify-between font-sans text-sm">
                        <span className="text-neutral-200">
                          <span className="font-semibold text-neutral-100">{like.name}</span>{" "}
                          <span className="text-neutral-400">{like.action}</span>
                        </span>
                        <span className="shrink-0 text-xs text-neutral-500">{like.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BentoGridItem>

            <BentoGridItem colSpan={1}>
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--app-accent)/15">
                  <User className="h-7 w-7 text-(--app-accent)" />
                </div>
                <div className="mt-3 font-sans font-bold text-neutral-100">Jayce</div>
                <div className="font-sans text-xs text-neutral-400">@jayce</div>
                <div className="mt-2 font-sans text-xs text-neutral-500">
                  128 posts · 4.2K followers
                </div>
              </div>
            </BentoGridItem>

            <BentoGridItem
              colSpan={1}
              icon={<MessageSquare className="h-4 w-4 text-(--app-accent)" />}
              title="12"
              description="Unread messages"
            />

            <BentoGridItem
              colSpan={1}
              icon={<Bell className="h-4 w-4 text-(--app-accent)" />}
              title="5"
              description="New notifications"
            />

            <BentoGridItem
              colSpan={1}
              icon={<TrendingUp className="h-4 w-4 text-(--app-accent)" />}
              title="87%"
              description="Engagement rate this week"
            />
          </BentoGrid>
        </div>
      </div>
    </div>
  );
}
