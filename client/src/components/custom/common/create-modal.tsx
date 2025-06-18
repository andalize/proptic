'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useFormContext } from 'react-hook-form';


interface CreateModalProps {
  title: string;
  onSubmit: (data: any) => void;
  children: React.ReactNode;
  isSubmitting?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  width?: string;
}

export const CreateModal: React.FC<CreateModalProps> = (props) => {

  const { handleSubmit } = useFormContext();

    const {
        title,
        onSubmit,
        children,
        isSubmitting = false,
        open,
        setOpen,
        width = 'sm:max-w-[600px]',
    } = props;
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={width}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Separator />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {children}
          <DialogFooter>
            <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
