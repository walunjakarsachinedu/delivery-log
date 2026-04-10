import { authApi } from '@/api/authApi';
import { useDeliveryStore } from '@/store/useDeliveryStore';
import {
  Box,
  Button,
  Field,
  Heading,
  Icon,
  Input,
  Stack
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fetchDeliveries = useDeliveryStore(state => state.fetchDeliveries);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      await authApi.login({
        email,
        password,
      });

      fetchDeliveries();
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="start"
      justifyContent="center"
      p={4}
      _before={{
        content: '""',
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <Box
        w="full"
        maxW="420px"
        border="1px solid"
        backgroundColor={"whiteAlpha.100"}
        borderRadius="md"
        mt={50}
        boxShadow="0 0 0 1px rgba(120,100,220,0.08), 0 24px 64px rgba(0,0,0,0.6)"
        bg="gray.900"
        p={8}
        rounded="xl"
        borderWidth="1px"
        borderColor="gray.700"
      >

        {/* Heading */}
        <Heading
          as="h1"
          fontSize="xl"
          fontWeight="600"
          color="whiteAlpha.900"
          mb={6}
          fontFamily="'DM Sans', sans-serif"
          letterSpacing="-0.02em"
          textAlign="center"
        >
          Sign in
        </Heading>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Stack gap={5}>
            <Field.Root required>
              <Field.Label
                fontSize="xs"
                fontWeight="500"
                color="whiteAlpha.700"
                mb={.5}
                fontFamily="'DM Mono', monospace"
              >
                Email address
              </Field.Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color="whiteAlpha.900"
                fontSize="sm"
                h="42px"
                px={3}
                borderRadius="md"
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label
                fontSize="xs"
                fontWeight="500"
                color="whiteAlpha.700"
                mb={.5}
                fontFamily="'DM Mono', monospace"
              >
                Password
              </Field.Label>
              <Box position="relative" width="100%">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  color="whiteAlpha.900"
                  fontSize="sm"
                  h="42px"
                  px={3}
                  pr={10}
                  borderRadius="md"
                />
                <Box
                  as="button"
                  // type="button"
                  position="absolute"
                  right={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="whiteAlpha.300"
                  _hover={{ color: 'whiteAlpha.600' }}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <Icon as={showPassword ? EyeOff : Eye} boxSize={4} />
                </Box>
              </Box>
            </Field.Root>

            <Button
              type="submit"
              w="full"
              h="42px"
              loading={isLoading}
              loadingText="Signing in..."
              bg="whiteAlpha.900"
              color="black"
              fontWeight="600"
              fontSize="sm"
              borderRadius="md"
              _hover={{ bg: 'whiteAlpha.850' }}
              _active={{ bg: 'whiteAlpha.700' }}
              mt={6}
            >
              Sign in
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}