import { useState } from 'react';
import { Player, Transaction } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PiggyBank, ArrowLeftRight, History, UserPlus } from 'lucide-react';
import { PlayerCard } from '@/components/PlayerCard';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionHistory } from '@/components/TransactionHistory';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33F5',
  '#33FFF5', '#F5FF33', '#FF3333', '#33FF33'
];

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const { toast } = useToast();

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        balance: 1500,
        color: COLORS[players.length % COLORS.length],
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
      toast({
        title: "Joueur ajouté !",
        description: `${newPlayer.name} rejoint la partie avec 1500€`,
      });
    }
  };

  const handleTransaction = (toId: string, amount: number, description: string) => {
    if (!selectedPlayer) return;

    if (amount === 0) {
      toast({
        title: "Erreur",
        description: "Le montant doit être différent de zéro",
        variant: "destructive"
      });
      return;
    }

    // Pour les paiements (montant positif), vérifie si le joueur a assez d'argent
    if (amount > 0 && amount > selectedPlayer.balance) {
      toast({
        title: "Fonds insuffisants",
        description: "Tu n'as pas assez d'argent pour cette transaction !",
        variant: "destructive"
      });
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      fromId: amount > 0 ? selectedPlayer.id : toId,
      toId: amount > 0 ? toId : selectedPlayer.id,
      amount: Math.abs(amount),
      description: description || 'Transaction',
      timestamp: new Date()
    };

    setTransactions([newTransaction, ...transactions]);

    setPlayers(currentPlayers =>
      currentPlayers.map(player => {
        if (player.id === selectedPlayer.id) {
          return { ...player, balance: player.balance - amount };
        }
        if (player.id === toId && toId !== 'bank') {
          return { ...player, balance: player.balance + amount };
        }
        return player;
      })
    );

    const actionType = amount > 0 ? 'envoyés à' : 'reçus de';
    const targetName = toId === 'bank' ? 'la banque' : players.find(p => p.id === toId)?.name;

    toast({
      title: "Transaction réussie !",
      description: `${Math.abs(amount)}€ ${actionType} ${targetName}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6 bg-white/90 backdrop-blur shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-8 h-8 text-purple-500" />
              <h1 className="text-2xl font-bold text-purple-700">Banque Monopoly</h1>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nouveau Joueur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un joueur</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nom du joueur"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                  />
                  <Button onClick={handleAddPlayer}>Ajouter</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isSelected={selectedPlayer?.id === player.id}
                onClick={() => setSelectedPlayer(player)}
              />
            ))}
          </div>

          {selectedPlayer ? (
            <Tabs defaultValue="transaction" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="transaction">
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  Transaction
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="w-4 h-4 mr-2" />
                  Historique
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transaction">
                <TransactionForm
                  players={players}
                  currentPlayer={selectedPlayer}
                  onTransaction={handleTransaction}
                />
              </TabsContent>

              <TabsContent value="history">
                <TransactionHistory
                  transactions={transactions.filter(t => 
                    t.fromId === selectedPlayer.id || t.toId === selectedPlayer.id
                  )}
                  players={players}
                  currentPlayer={selectedPlayer}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center p-8 text-gray-500">
              <p>👆 Sélectionne un joueur pour commencer</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;