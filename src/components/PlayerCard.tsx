import { Player } from '@/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: Player;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PlayerCard({ player, isSelected, onClick }: PlayerCardProps) {
  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all hover:scale-105',
        isSelected && 'ring-2 ring-purple-500',
      )}
      onClick={onClick}
      style={{ borderLeft: `4px solid ${player.color}` }}
    >
      <h3 className="font-semibold">{player.name}</h3>
      <p className="text-2xl font-bold">{player.balance}€</p>
    </Card>
  );
}