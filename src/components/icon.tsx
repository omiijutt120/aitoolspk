import {
  Sparkles,
  Video,
  PenTool,
  Text,
  Code2,
  LayoutGrid,
  Shield,
  Play,
  Monitor,
  ArrowUpRight,
} from 'lucide-react';
const icons = {
  sparkles: Sparkles,
  video: Video,
  pen: PenTool,
  text: Text,
  code: Code2,
  grid: LayoutGrid,
  shield: Shield,
  play: Play,
  monitor: Monitor,
};
export function CategoryIcon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  const Icon = icons[name as keyof typeof icons] || ArrowUpRight;
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}
