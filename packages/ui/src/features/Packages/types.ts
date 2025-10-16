export interface Package {
  name: string;
  version: string;
  description: string;
  author?: {
    name: string;
    email?: string;
    url?: string;
  };
  authorAvatar?: string;
  packageAvatar?: string;
  homepage?: string;
  repository?: string;
  npmUrl?: string;
  iconUrl?: string | null;
}
