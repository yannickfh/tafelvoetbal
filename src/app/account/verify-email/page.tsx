import { VStack } from 'styled-system/jsx';
import { Heading } from '~/components/ui/heading';
import { Text } from '~/components/ui/text';

export default function VerifyEmailPage() {
    return (
        <VStack gap="6">
            <Heading as="h1" fontWeight="bold" size="3xl">
                Verification mail sent!
            </Heading>
            <Text>
                A verification email has been sent to your email address. Please
                click the link in the email to verify your account.
            </Text>
        </VStack>
    );
}
