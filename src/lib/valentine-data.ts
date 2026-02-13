import { Flower2, FileHeart, Candy, Heart, MessageCircleHeart, Users, Sparkles, PartyPopper } from 'lucide-react';

export interface ValentineDay {
  id: number;
  date: Date;
  name: string;
  title: string;
  icon: typeof Flower2;
  description: string;
  path: string;
  unlocked: boolean;
}

export const VALENTINE_DAYS: ValentineDay[] = [
  {
    id: 1,
    date: new Date(2026, 1, 7), // Feb 7
    name: 'Rose Day',
    title: 'The Infinite Garden',
    icon: Flower2,
    description: 'Tap to grow an eternal garden of roses',
    path: '/rose-garden',
    unlocked: false,
  },
  {
    id: 2,
    date: new Date(2026, 1, 8), // Feb 8
    name: 'Propose Day',
    title: 'The Friendship Contract',
    icon: FileHeart,
    description: 'Sign the sacred terms of our friendship',
    path: '/friendship-contract',
    unlocked: false,
  },
  {
    id: 3,
    date: new Date(2026, 1, 9), // Feb 9
    name: 'Chocolate Day',
    title: 'Sweet Catcher',
    icon: Candy,
    description: 'Catch the falling chocolates!',
    path: '/chocolate-game',
    unlocked: false,
  },
  {
    id: 4,
    date: new Date(2026, 1, 10), // Feb 10
    name: 'Teddy Day',
    title: 'Teddy Love Meter',
    icon: Heart,
    description: "Keep your teddy happy to win its love!",
    path: '/build-a-buddy',
    unlocked: false,
  },
  {
    id: 5,
    date: new Date(2026, 1, 11), // Feb 11
    name: 'Promise Day',
    title: 'Time Capsule',
    icon: MessageCircleHeart,
    description: 'Write a note to your future selves',
    path: '/time-capsule',
    unlocked: false,
  },
  {
    id: 6,
    date: new Date(2026, 1, 12), // Feb 12
    name: 'Hug Day',
    title: 'Hug Meter',
    icon: Users,
    description: 'Bring two hearts together',
    path: '/hug-meter',
    unlocked: false,
  },
  {
    id: 7,
    date: new Date(2026, 1, 13), // Feb 13
    name: 'Kiss Day',
    title: 'The Kiss Wall',
    icon: Sparkles,
    description: 'Fill the wall with kisses',
    path: '/kiss-wall',
    unlocked: false,
  },
  {
    id: 8,
    date: new Date(2026, 1, 14), // Feb 14
    name: "Valentine's Day",
    title: "The Constellation",
    icon: PartyPopper,
    description: "Connect the stars to reveal our story",
    path: '/the-constellation',
    unlocked: false,
  },
];

export function isDateUnlocked(date: Date, unlockAll: boolean = false): boolean {
  if (unlockAll) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return today >= compareDate;
}

export function getDaysWithUnlockStatus(unlockAll: boolean = false): ValentineDay[] {
  return VALENTINE_DAYS.map(day => ({
    ...day,
    unlocked: isDateUnlocked(day.date, unlockAll),
  }));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}