import { User } from '@supabase/supabase-js';
import { BarChartBig, CandlestickChart, CircleUser } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';
import { Box, VStack } from 'styled-system/jsx';
import { IconButton } from '../ui/icon-button';

interface SidebarProps {
    user: User;
}

const Sidebar: FC<SidebarProps> = ({}) => {
    return (
        <VStack
            display="flex"
            bgColor="bg.default"
            position="fixed"
            w="14"
            top="0"
            bottom="0"
            p="4"
            borderRight="1px solid"
            borderColor="border.default"
        >
            <Box>
                <Link href="/dashboard">
                    <IconButton variant="ghost" borderRadius="full">
                        <BarChartBig />
                    </IconButton>
                </Link>
                <Link href="/dashboard/game">
                    <IconButton variant="ghost" borderRadius="full">
                        <CandlestickChart />
                    </IconButton>
                </Link>
            </Box>
            <Box flexGrow="1" />
            <Box>
                <Link href="/dashboard/account">
                    <IconButton variant="ghost" borderRadius="full">
                        <CircleUser />
                    </IconButton>
                </Link>
            </Box>
        </VStack>
    );
};

export default Sidebar;
