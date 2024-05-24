import { FC } from 'react';
import useTimer from './useTimer';

interface Props {
    startDate: Date;
}

export const Timer: FC<Props> = ({ startDate }) => {
    const time = useTimer(startDate);

    return (
        <>{time}</>
    );
};
