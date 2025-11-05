import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { spendingCategories, currencies } from '../lib/mockData';
import { toast } from 'sonner';

interface AddSpendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectCurrency: string;
}

export function AddSpendingModal({ isOpen, onClose, projectId, projectCurrency }: AddSpendingModalProps) {
  const { addSpendingEntry, currentUser } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(projectCurrency);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !amount || !date) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    setIsSubmitting(true);
    
    try {
      addSpendingEntry({
        projectId,
        date,
        title,
        description,
        category,
        amount: parseFloat(amount),
        currency,
        authorId: currentUser?.id || 'user-1',
        notes
      });
      
      toast.success('Spending entry added successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setAmount('');
      setCurrency(projectCurrency);
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
      
      onClose();
    } catch (error) {
      toast.error('Failed to add spending entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Spending Entry</DialogTitle>
          <DialogDescription>
            Record a new expense for this project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="spending-date">
              Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="spending-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="spending-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="spending-title"
              type="text"
              placeholder="e.g., Lunch at Joe's"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="spending-description">Description</Label>
            <Input
              id="spending-description"
              type="text"
              placeholder="Optional details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="spending-category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="spending-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {spendingCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spending-amount">
                Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="spending-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spending-currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="spending-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(curr => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="spending-notes">Notes (Optional)</Label>
            <Textarea
              id="spending-notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
