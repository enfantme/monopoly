import { useState } from 'react';
import { Player } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight, ArrowLeft, Landmark } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TransactionFormProps {
  players: Player[];
  currentPlayer: Player;
  onTransaction: (toId: string, amount: number, description: string) => void;
}

export function TransactionForm({ players, currentPlayer, onTransaction }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [toId, setToId] = useState('bank');
  const [description, setDescription] = useState('');
  const [direction, setDirection] = useState<'send' | 'receive'>('send');

  const getRecipientDisplay = () => {
    if (direction === 'receive') {
      return (
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4" />
          <span>Banque</span>
        </div>
      );
    }

    if (toId === 'bank') {
      return (
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4" />
          <span>Banque</span>
        </div>
      );
    }

    const player = players.find(p => p.id === toId);
    if (player) {
      return (
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: player.color }}
          />
          <span>{player.name}</span>
        </div>
      );
    }

    return "Choisir destinataire";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (numAmount > 0 && toId) {
      if (direction === 'receive' && toId === 'bank') {
        onTransaction('bank', -numAmount, description);
      } else {
        onTransaction(toId, numAmount, description);
      }
      setAmount('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RadioGroup
        defaultValue="send"
        value={direction}
        onValueChange={(value) => {
          setDirection(value as 'send' | 'receive');
          if (value === 'receive') {
            setToId('bank');
          }
        }}
        className="flex justify-center space-x-4 mb-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="send" id="send" />
          <Label htmlFor="send" className="flex items-center gap-1">
            <ArrowRight className="w-4 h-4" />
            Envoyer
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="receive" id="receive" />
          <Label htmlFor="receive" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Recevoir
          </Label>
        </div>
      </RadioGroup>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Montant"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />
        </div>
        {direction === 'send' ? (
          <ArrowRight className="w-6 h-6 text-gray-400" />
        ) : (
          <ArrowLeft className="w-6 h-6 text-gray-400" />
        )}
        <div className="flex-1">
          <Select 
            value={toId} 
            onValueChange={setToId}
            disabled={direction === 'receive'}
          >
            <SelectTrigger>
              <SelectValue>
                {getRecipientDisplay()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4" />
                  <span>Banque</span>
                </div>
              </SelectItem>
              {players
                .filter((p) => p.id !== currentPlayer.id)
                .map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                      <span>{player.name}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Input
        placeholder="Description (optionnel)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button type="submit" className="w-full">
        {direction === 'send' ? 'Envoyer' : 'Recevoir'}
      </Button>
    </form>
  );
}