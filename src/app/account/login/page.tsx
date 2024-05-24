import Link from 'next/link';
import { Stack, VStack } from 'styled-system/jsx';
import { Button } from '~/components/ui/button';
import { FormLabel } from '~/components/ui/form-label';
import { Heading } from '~/components/ui/heading';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { login } from './actions';

export default function LoginPage() {
    return (
        <form>
            <VStack gap="6">
                <Heading as="h1" fontWeight="bold" size="3xl">
                    Log in
                </Heading>
                <Stack gap="1.5" width="xs">
                    <FormLabel htmlFor="email">Email:</FormLabel>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="naam@freshheads.com"
                        required
                    />
                </Stack>
                <Stack gap="1.5" width="xs">
                    <FormLabel htmlFor="password">Password:</FormLabel>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="password"
                        required
                    />
                </Stack>
                <Button formAction={login} width="full">
                    Log in
                </Button>
                <Text>
                    Don&apos;t have an account?{' '}
                    <Button asChild variant="link">
                        <Link href="/account/signup">Sign up</Link>
                    </Button>
                </Text>
            </VStack>
        </form>
    );
}
