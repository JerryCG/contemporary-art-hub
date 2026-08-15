export type Show = {
  title: string;
  venue: string;
  city: string;
  region: "hong-kong" | "asia" | "world" | "online";
  dates: string;
  why: string;
  href: string;
  live?: boolean;
};
