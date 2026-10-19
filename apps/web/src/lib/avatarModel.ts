import { LOCAL_DEFAULT_MODEL, resolveAvatarModelUrl } from "@/lib/rpmAssets";

export function getAvatarModelUrl(): string {
  return resolveAvatarModelUrl(null, process.env.NEXT_PUBLIC_RPM_AVATAR_URL);
}

export { LOCAL_DEFAULT_MODEL };
