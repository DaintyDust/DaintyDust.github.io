import type { RobloxUser, GroupData } from "../types";

const PROXY_BASE_URL = "roproxy.com";
export const GROUP_ID = 8193767;
export const ROBLOX_USER_IDS = [
  544088422, // daintydust05191
  524657251, // aardbei919
  523574085, // banaan919
  342197330, // nickverbrugg
  260990972, // nickverbruggen
  546138446, // nickverbruggen53
  455544701, // nickverbruggen592
  547057686, // nickverbruggen59
  543343227, // nickverbruggen595
  2420401490, // nickverbruggen5353
  383005337, // nicknnnnick
  5073139088, // NickStudiosUploader
  2717491346, // NanoBloxDev
  3538200700, // DaNickBuilder
  3538209403, // NickBrickGuy
  7691568131, // Nick_Test535
];

export async function safeApiCall<T>(url: string, options: RequestInit = {}, maxRetries = 3): Promise<T> {
  let delay = 1000;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (data?.errors?.some((e: { code?: number; message?: string }) => e.code === 4 || e.message?.includes("Too many requests"))) {
        throw new Error("RATE_LIMITED");
      }
      return data as T;
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
  throw new Error("Failed to fetch API");
}

export async function fetchRobloxGroup(groupId: number = GROUP_ID): Promise<GroupData> {
  const [groupData, iconData, gamesData] = await Promise.allSettled([safeApiCall<{ name: string; memberCount: number }>(`https://groups.${PROXY_BASE_URL}/v1/groups/${groupId}`), safeApiCall<{ data: Array<{ imageUrl: string }> }>(`https://thumbnails.${PROXY_BASE_URL}/v1/groups/icons?groupIds=${groupId}&size=150x150&format=Png`), safeApiCall<{ data: Array<{ placeVisits: number }> }>(`https://games.${PROXY_BASE_URL}/v2/groups/${groupId}/gamesv2?accessFilter=2&sortOrder=Asc&limit=10`)]);

  const name = groupData.status === "fulfilled" ? groupData.value.name : "Nick Studio's!";
  const memberCount = groupData.status === "fulfilled" ? groupData.value.memberCount : 80;
  const iconUrl = iconData.status === "fulfilled" && iconData.value.data?.[0]?.imageUrl ? iconData.value.data[0].imageUrl : "";

  let totalVisits = 0;
  if (gamesData.status === "fulfilled" && Array.isArray(gamesData.value.data)) {
    totalVisits = gamesData.value.data.reduce((sum, g) => sum + (g.placeVisits || 0), 0);
  }

  return {
    name,
    memberCount,
    totalVisits: totalVisits.toLocaleString(),
    iconUrl,
  };
}

export async function fetchRobloxUsers(userIds: number[] = ROBLOX_USER_IDS, onUserLoaded?: (user: RobloxUser) => void, isCancelled?: () => boolean): Promise<RobloxUser[]> {
  const thumbMap = new Map<number, string>();
  const userMap = new Map<number, { name: string; displayName: string }>();

  // 1. Attempt batch endpoints
  try {
    const [thumbRes, usersRes] = await Promise.allSettled([
      safeApiCall<{ data: Array<{ targetId: number; imageUrl: string }> }>(`https://thumbnails.${PROXY_BASE_URL}/v1/users/avatar-headshot?userIds=${userIds.join(",")}&size=150x150&format=Png&isCircular=false`),
      safeApiCall<{ data: Array<{ id: number; name: string; displayName: string }> }>(`https://users.${PROXY_BASE_URL}/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds, excludeBannedUsers: false }),
      }),
    ]);

    if (thumbRes.status === "fulfilled" && thumbRes.value.data) {
      thumbRes.value.data.forEach((t) => thumbMap.set(t.targetId, t.imageUrl));
    }

    if (usersRes.status === "fulfilled" && usersRes.value.data) {
      usersRes.value.data.forEach((u) => userMap.set(u.id, { name: u.name, displayName: u.displayName }));
    }
  } catch (err) {
    console.error("Batch load error:", err);
  }

  const results: RobloxUser[] = [];

  for (const id of userIds) {
    if (isCancelled?.()) break;

    const cachedUser = userMap.get(id);
    const cachedThumb = thumbMap.get(id);

    if (cachedUser) {
      const user: RobloxUser = {
        id,
        displayName: cachedUser.displayName,
        name: cachedUser.name,
        avatarUrl: cachedThumb || "",
        loading: false,
      };
      results.push(user);
      onUserLoaded?.(user);
      continue;
    }

    // Individual fallback if batch missed this user
    try {
      const data = await safeApiCall<{ name: string; displayName: string }>(`https://users.${PROXY_BASE_URL}/v1/users/${id}`);
      const thumb = cachedThumb || (await safeApiCall<{ data: Array<{ imageUrl: string }> }>(`https://thumbnails.${PROXY_BASE_URL}/v1/users/avatar-headshot?userIds=${id}&size=150x150&format=Png&isCircular=false`)).data?.[0]?.imageUrl || "";

      const user: RobloxUser = {
        id,
        displayName: data.displayName,
        name: data.name,
        avatarUrl: thumb,
        loading: false,
      };
      results.push(user);
      onUserLoaded?.(user);
    } catch {
      const user: RobloxUser = {
        id,
        displayName: `User ${id}`,
        name: "",
        avatarUrl: "",
        loading: false,
        error: true,
      };
      results.push(user);
      onUserLoaded?.(user);
    }
  }

  return results;
}
