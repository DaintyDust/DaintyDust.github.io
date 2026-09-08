import { Loader } from "@mantine/core";

interface RobloxProgressBadgeProps {
  loaded: number;
  total: number;
}

export default function RobloxProgressBadge({ loaded, total }: RobloxProgressBadgeProps) {
  const isComplete = loaded === total;

  return (
    <div className="roblox-progress-badge">
      {!isComplete && <Loader size={12} color="cyan" />}
      <span>
        {loaded}/{total} Loaded
      </span>
    </div>
  );
}
