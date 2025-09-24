export type VideoItem = {
  id: string; // slug
  title: string;
  client?: string;
  thumbnail: string; // local image in /public or remote
  embedType: "youtube" | "vimeo" | "mp4";
  embedIdOrUrl: string; // YT/Vimeo id or mp4 url
  tags: string[];
  duration?: string; // "0:45"
};

export const portfolioItems: VideoItem[] = [
  {
    id: "city-of-mercy",
    title: "City of Mercy — Cinematic Short",
    client: "Independent",
    thumbnail: "https://picsum.photos/1920/1080?random=1",
    embedType: "youtube",
    embedIdOrUrl: "dQw4w9WgXcQ",
    tags: ["cinematic", "short film", "4K"],
    duration: "1:12"
  },
  {
    id: "gym-brand-reel",
    title: "Gym Brand Reel",
    client: "Atlas Strength",
    thumbnail: "https://picsum.photos/1920/1080?random=2",
    embedType: "vimeo",
    embedIdOrUrl: "76979871",
    tags: ["fitness", "ads", "social"],
    duration: "0:38"
  },
  {
    id: "fashion-edit",
    title: "Fashion Campaign Edit",
    client: "Eclipse Studio",
    thumbnail: "https://picsum.photos/1920/1080?random=3",
    embedType: "mp4",
    embedIdOrUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    tags: ["fashion", "brand", "vertical"],
    duration: "0:22"
  },
  {
    id: "restaurant-promo",
    title: "Restaurant Launch Promo",
    client: "Bella Vista",
    thumbnail: "https://picsum.photos/1920/1080?random=4",
    embedType: "youtube",
    embedIdOrUrl: "jNQXAC9IVRw",
    tags: ["food", "promo", "social"],
    duration: "0:45"
  },
  {
    id: "tech-startup",
    title: "Tech Startup Demo",
    client: "InnovateLab",
    thumbnail: "https://picsum.photos/1920/1080?random=5",
    embedType: "vimeo",
    embedIdOrUrl: "148751763",
    tags: ["tech", "product", "demo"],
    duration: "1:30"
  },
  {
    id: "music-video",
    title: "Indie Music Video",
    client: "Midnight Echo",
    thumbnail: "https://picsum.photos/1920/1080?random=6",
    embedType: "youtube",
    embedIdOrUrl: "9bZkp7q19f0",
    tags: ["music", "creative", "cinematic"],
    duration: "3:45"
  }
];

export const allTags = Array.from(new Set(portfolioItems.flatMap(item => item.tags)));
