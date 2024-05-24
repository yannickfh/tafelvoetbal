'use client';
import { FC } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '~/components/ui/button';

interface SubmitButtonProps {}

const SubmitButton: FC<SubmitButtonProps> = ({}) => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" width="full" disabled={pending}>
            Save
        </Button>
    );
};

export default SubmitButton;
