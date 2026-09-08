import { Loader } from "@mantine/core";
import type { RobloxUser } from "../types";

interface RobloxAccountCardProps {
  user: RobloxUser;
}

export default function RobloxAccountCard({ user }: RobloxAccountCardProps) {
  return (
    <a
      href={`https://www.roblox.com/users/${user.id}/profile`}
      target="_blank"
      rel="noopener noreferrer"
      className={`roblox-account-card${user.loading ? " loading" : ""}${user.error ? " roblox-card-error" : ""}`}
    >
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.displayName} className="roblox-avatar" />
      ) : (
        <div className="roblox-avatar-placeholder">
          {user.loading ? <Loader size={16} color="cyan" /> : <span style={{ fontSize: "11px", color: "#666" }}>N/A</span>}
        </div>
      )}

      <div className="roblox-info">
        <span className="roblox-display-name">
          {user.loading ? `Loading ID ${user.id}...` : user.error ? `User ${user.id} (Error)` : user.displayName}
        </span>
        <span className="roblox-username">
          {user.name ? `@${user.name}` : `ID: ${user.id}`}
        </span>
      </div>
    </a>
  );
}
