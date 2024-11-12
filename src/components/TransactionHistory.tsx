import { Transaction, Player } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TransactionHistoryProps {
  transactions: Transaction[];
  players: Player[];
  currentPlayer: Player;
}

export function TransactionHistory({ transactions, players, currentPlayer }: TransactionHistoryProps) {
  const getPlayerName = (id: string) => {
    if (id === 'bank') return 'Banque';
    return players.find((p) => p.id === id)?.name || 'Inconnu';
  };

  const getTransactionStyle = (transaction: Transaction) => {
    if (transaction.fromId === currentPlayer.id) {
      return 'bg-red-50 border-red-200';
    }
    if (transaction.toId === currentPlayer.id) {
      return 'bg-green-50 border-green-200';
    }
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">Aucune transaction pour le moment</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`p-3 rounded-lg border ${getTransactionStyle(transaction)}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {getPlayerName(transaction.fromId)} → {getPlayerName(transaction.toId)}
                  </span>
                </div>
                <span className="text-xl font-semibold">{transaction.amount}€</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-600">{transaction.description}</p>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(transaction.timestamp, { locale: fr, addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}