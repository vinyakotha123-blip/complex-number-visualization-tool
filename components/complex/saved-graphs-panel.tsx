'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useComplex } from '@/hooks/use-complex';
import { useSavedGraphs } from '@/hooks/use-saved-graphs';
import { useToast } from '@/hooks/use-toast';
import { formatComplex } from '@/lib/complex';
import { randomHexColor } from '@/lib/utils';
import { Save, RotateCw, Pencil, Trash2 } from 'lucide-react';

export function SavedGraphsPanel() {
  const { z, setZ } = useComplex();
  const { graphs, loading, error, saveGraph, renameGraph, deleteGraph } = useSavedGraphs();
  const { toast } = useToast();
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const handleSave = async () => {
    const saved = await saveGraph({ name: `z${graphs.length + 1}`, re: z.re, im: z.im, color: randomHexColor(graphs.length) });
    if (saved) toast({ title: 'Graph saved', description: `${formatComplex(z)} stored in MongoDB.` });
    else toast({ title: 'Could not save graph', variant: 'destructive' });
  };

  const openRename = (id: string, current: string) => { setRenameId(id); setRenameValue(current); };
  const confirmRename = async () => {
    if (renameId && renameValue.trim()) await renameGraph(renameId, renameValue.trim());
    setRenameId(null);
  };

  return (
    <Card id="saved-graphs">
      <CardHeader>
        <CardTitle>Saved Graphs</CardTitle>
        <Button size="sm" onClick={handleSave}><Save className="h-4 w-4" />Save Current z</Button>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-3 text-xs font-medium text-destructive">{error}</p>}
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading saved graphs…</p>
        ) : graphs.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No saved graphs yet. Plot a number and click &ldquo;Save Current z&rdquo;.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {graphs.map((g) => (
              <li key={g._id} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-3 py-2.5">
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: g.color }} />
                <span className="flex-shrink-0 text-sm font-bold">{g.name}</span>
                <span className="font-mono text-sm text-muted-foreground">{formatComplex({ re: g.re, im: g.im })}</span>
                <span className="ml-auto hidden text-xs text-muted-foreground/70 sm:inline">{new Date(g.createdAt).toLocaleString()}</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" aria-label={`Load ${g.name}`} onClick={() => { setZ({ re: g.re, im: g.im }); toast({ title: `Loaded ${g.name}` }); }}>
                    <RotateCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label={`Rename ${g.name}`} onClick={() => openRename(g._id, g.name)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label={`Delete ${g.name}`} onClick={() => deleteGraph(g._id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <Dialog open={!!renameId} onOpenChange={(open) => !open && setRenameId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename Graph</DialogTitle></DialogHeader>
          <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && confirmRename()} autoFocus />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameId(null)}>Cancel</Button>
            <Button onClick={confirmRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
