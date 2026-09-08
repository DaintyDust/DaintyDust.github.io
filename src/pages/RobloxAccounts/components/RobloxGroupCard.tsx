import type { GroupData } from "../types";

interface RobloxGroupCardProps {
  group: GroupData;
  groupId: number;
}

export default function RobloxGroupCard({ group, groupId }: RobloxGroupCardProps) {
  return (
    <a
      href={`https://www.roblox.com/groups/${groupId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="roblox-group-card"
    >
      {group.iconUrl && <img src={group.iconUrl} alt={group.name} className="roblox-group-icon" />}
      <div className="roblox-group-details">
        <span className="roblox-group-name">{group.name}</span>
        <span className="roblox-group-stat">{group.memberCount.toLocaleString()} Members</span>
        <span className="roblox-group-stat">{group.totalVisits} Visits</span>
      </div>
    </a>
  );
}
