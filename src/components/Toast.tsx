import { createToaster } from '@ark-ui/react/toast';
import { XIcon } from 'lucide-react';
import * as Toast from '~/components/ui/toast';
import { IconButton } from './ui/icon-button';

export const [Toaster, toast] = createToaster({
    placement: 'bottom',
    duration: 5000,
    render(toast) {
        return (
            <Toast.Root
                _open={{ animation: 'dialog-in' }}
                _closed={{ animation: 'dialog-out' }}
            >
                <Toast.Title>{toast.title}</Toast.Title>
                <Toast.Description>{toast.description}</Toast.Description>
                <Toast.CloseTrigger asChild>
                    <IconButton size="sm" variant="link">
                        <XIcon />
                    </IconButton>
                </Toast.CloseTrigger>
            </Toast.Root>
        );
    },
});
