import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

const colSpanClasses = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
} as const;

const rowSpanClasses = {
  1: "row-span-1 md:row-span-1",
  2: "row-span-1 md:row-span-2",
  3: "row-span-1 md:row-span-3",
} as const;

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  children,
  colSpan = 1,
  rowSpan = 1,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2 | 3;
}) => {
  return (
    <div
      className={cn(
        "group/bento flex flex-col justify-between space-y-4 rounded-xl border border-(--app-surface-border) bg-(--app-surface-bg) p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-200 hover:border-(--app-surface-border-hover) hover:bg-(--app-surface-bg-hover) hover:shadow-[0_0_35px_-8px_rgba(0,240,255,0.45)]",
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        className,
      )}
    >
      {children ?? (
        <>
          {header}
          <div className="transition duration-200 group-hover/bento:translate-x-2">
            {icon}
            <div className="mt-2 mb-2 font-sans font-bold text-neutral-100">
              {title}
            </div>
            <div className="font-sans text-xs font-normal text-neutral-400">
              {description}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
