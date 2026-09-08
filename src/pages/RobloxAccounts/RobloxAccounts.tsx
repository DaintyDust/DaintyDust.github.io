import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Background from "@/features/Background/Index";
import Widget from "@/features/SocialWidget";
import RobloxAccountCard from "./components/RobloxAccountCard";
import RobloxGroupCard from "./components/RobloxGroupCard";
import RobloxProgressBadge from "./components/RobloxProgressBadge";
import { fetchRobloxGroup, fetchRobloxUsers, GROUP_ID, ROBLOX_USER_IDS } from "./services/robloxApi";
import type { RobloxUser, GroupData } from "./types";
import "./RobloxAccounts.css";

export default function RobloxAccounts() {
  const [users, setUsers] = useState<RobloxUser[]>(() =>
    ROBLOX_USER_IDS.map((id) => ({
      id,
      displayName: `User ${id}`,
      name: "",
      avatarUrl: "",
      loading: true,
    })),
  );

  const [group, setGroup] = useState<GroupData | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetchRobloxGroup(GROUP_ID).then((groupData) => {
      if (!cancelled) setGroup(groupData);
    });

    void fetchRobloxUsers(
      ROBLOX_USER_IDS,
      (loadedUser) => {
        if (!cancelled) {
          setUsers((prev) => prev.map((u) => (u.id === loadedUser.id ? loadedUser : u)));
        }
      },
      () => cancelled,
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const loadedCount = users.filter((u) => !u.loading).length;

  return (
    <>
      <Background />

      <Link to="/" className="back-button">
        ← Back
      </Link>

      {group && (
        <Widget HeaderTitle="Roblox Group" position="top-right">
          <RobloxGroupCard group={group} groupId={GROUP_ID} />
        </Widget>
      )}

      <div className="roblox-page-content">
        <div className="roblox-header-bar">
          <h1 className="roblox-page-title">Roblox Accounts</h1>
          <RobloxProgressBadge loaded={loadedCount} total={users.length} />
        </div>

        <div className="roblox-accounts-grid">
          {users.map((user) => (
            <RobloxAccountCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </>
  );
}
