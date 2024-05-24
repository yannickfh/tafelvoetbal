import { Duration, intervalToDuration } from 'date-fns';
import { useEffect, useState } from 'react';

export default function useTimer(startDate: Date) {
    const [timer, setTimer] = useState(
        intervalToDuration({
            start: startDate,
            end: new Date(),
        })
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(
                intervalToDuration({
                    start: startDate,
                    end: new Date(),
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [startDate]);

    return durationToTimer(timer);
}

const durationToTimer = (duration: Duration): string => {
    const hours = duration.hours?.toString().padStart(2, '0');
    const minutes = duration.minutes?.toString().padStart(2, '0') || '00';
    const seconds = duration.seconds?.toString().padStart(2, '0') || '00';


    return [hours, minutes, seconds].filter(Boolean).join(":");
};
