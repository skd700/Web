import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { WoundCase } from '@/lib/wound-types';
import { generateId } from '@/lib/wound-types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCase: (c: WoundCase) => void;
}

export default function NewCaseDialog({ open, onOpenChange, onCreateCase }: Props) {
  const [patientName, setPatientName] = useState('');
  const [surgeryType, setSurgeryType] = useState('');
  const [woundLocation, setWoundLocation] = useState('');
  const [surgeryDate, setSurgeryDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !surgeryType.trim()) return;
    onCreateCase({
      id: generateId(),
      patientName: patientName.trim(),
      surgeryType: surgeryType.trim(),
      woundLocation: woundLocation.trim(),
      surgeryDate,
      photos: [],
      createdAt: new Date(),
    });
    setPatientName('');
    setSurgeryType('');
    setWoundLocation('');
    setSurgeryDate('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">New Patient Case</DialogTitle>
          <DialogDescription>Enter the patient and surgery details to begin wound tracking.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-name">Patient Name *</Label>
            <Input id="patient-name" value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Jane Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surgery-type">Surgery Type *</Label>
            <Input id="surgery-type" value={surgeryType} onChange={e => setSurgeryType(e.target.value)} placeholder="Knee Replacement" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wound-location">Wound Location</Label>
            <Input id="wound-location" value={woundLocation} onChange={e => setWoundLocation(e.target.value)} placeholder="Left knee" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surgery-date">Surgery Date</Label>
            <Input id="surgery-date" type="date" value={surgeryDate} onChange={e => setSurgeryDate(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Create Case</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
