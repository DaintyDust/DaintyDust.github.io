import type { GroupData } from "../types";

interface RobloxGroupCardProps {
  group: GroupData;
  groupId: number;
}

export default function RobloxGroupCard({ group, groupId }: RobloxGroupCardProps) {
  return (
    <a href={`https://www.roblox.com/groups/${groupId}`} target="_blank" rel="noopener noreferrer" className="roblox-account-card">
      {group.iconUrl ? (
        <img src={group.iconUrl} alt={group.name} className="roblox-avatar" />
      ) : (
        <div className="roblox-avatar-placeholder">
          <span style={{ fontSize: "11px", color: "#666" }}>GRP</span>
        </div>
      )}

      <div className="roblox-info">
        <span className="roblox-display-name">{group.name}</span>
        <span className="roblox-username">
          {group.memberCount.toLocaleString()} Members • {group.totalVisits} Visits
        </span>
      </div>
    </a>
  );
}
