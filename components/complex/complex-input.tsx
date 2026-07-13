'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useComplex } from '@/hooks/use-complex';
import { formatComplex } from '@/lib/complex';
import { trimNumber } from '@/lib/utils';
import { LineChart, Eraser } from 'lucide-react';

export function ComplexInput() {
  const { z, inputError, setInput, setParts } = useComplex();
  const [text, setText] = useState(formatComplex(z));
  const [reText, setReText] = useState(trimNumber(z.re, 6));
  const [imText, setImText] = useState(trimNumber(z.im, 6));

  useEffect(() => {
    setText(formatComplex(z));
    setReText(trimNumber(z.re, 6));
    setImText(trimNumber(z.im, 6));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [z.re, z.im]);

  const plot = () => setInput(text);
  const clearAll = () => {
    setText('');
    setReText('0');
    setImText('0');
    setParts(0, 0);
  };

  return (
    <Card>
      <CardContent className="flex flex-wrap items-end gap-4 p-5">
        <div className="min-w-[220px] flex-1 space-y-1.5">
          <Label htmlFor="complexInput">Enter Complex Number (a + bi)</Label>
          <Input
            id="complexInput"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && plot()}
            placeholder="e.g. 3 + 4i"
            aria-describedby="complexInputError"
          />
          {inputError && (
            <p id="complexInputError" role="alert" className="text-xs font-medium text-destructive">
              {inputError}
            </p>
          )}
        </div>

        <span className="pb-2.5 text-xs text-muted-foreground">or</span>

        <div className="w-28 space-y-1.5">
          <Label htmlFor="reInput">a (Real Part)</Label>
          <Input
            id="reInput"
            type="number"
            step="any"
            value={reText}
            onChange={(e) => setReText(e.target.value)}
            onBlur={() => setParts(parseFloat(reText), parseFloat(imText))}
          />
        </div>
        <div className="w-28 space-y-1.5">
          <Label htmlFor="imInput">b (Imaginary Part)</Label>
          <Input
            id="imInput"
            type="number"
            step="any"
            value={imText}
            onChange={(e) => setImText(e.target.value)}
            onBlur={() => setParts(parseFloat(reText), parseFloat(imText))}
          />
        </div>

        <div className="flex gap-2 pb-0.5">
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button onClick={plot}>
              <LineChart className="h-4 w-4" />
              Plot
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button variant="outline" onClick={clearAll}>
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
