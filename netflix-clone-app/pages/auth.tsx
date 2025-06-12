import axios from 'axios';
import { useCallback, useState } from 'react';
import { NextPageContext } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Input from '@/components/Input';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Auth = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [variant, setVariant] = useState<'login' | 'register'>('login');

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
    setErrors({});
  }, []);

  const validateFields = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (variant === 'register' && !name) {
      newErrors.name = 'Username is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, name, password, variant]);

  const login = useCallback(async () => {
    if (!validateFields()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/profiles'
      });

      if (result?.error) {
        toast.error('Invalid email or password');
        return;
      }

      toast.success('Logged in successfully!');
      router.push('/profiles');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router, validateFields]);

  const register = useCallback(async () => {
    if (!validateFields()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/register', {
        email,
        name,
        password
      });

      toast.success('Account created successfully!');
      await login();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [email, name, password, login, validateFields]);

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/profiles' });
    } catch (error) {
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" className="h-12" alt="Logo" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-8 font-semibold">
              {variant === 'login' ? 'Sign in' : 'Register'}
            </h2>
            <div className="flex flex-col gap-4">
              {variant === 'register' && (
                <Input
                  id="name"
                  type="text"
                  label="Username"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  error={errors.name}
                  disabled={isLoading}
                />
              )}
              <Input
                id="email"
                type="email"
                label="Email address"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                error={errors.email}
                disabled={isLoading}
              />
              <Input
                type="password"
                id="password"
                label="Password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                error={errors.password}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={variant === 'login' ? login : register}
              disabled={isLoading}
              className={`bg-red-600 py-3 text-white rounded-md w-full mt-10 transition ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
              }`}
            >
              {isLoading ? 'Loading...' : variant === 'login' ? 'Login' : 'Sign up'}
            </button>
            <div className="flex flex-row items-center gap-4 mt-8 justify-center">
              <div
                onClick={() => handleSocialLogin('google')}
                className={`w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer transition ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                }`}
              >
                <FcGoogle size={32} />
              </div>
              <div
                onClick={() => handleSocialLogin('github')}
                className={`w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer transition ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                }`}
              >
                <FaGithub size={32} />
              </div>
            </div>
            <p className="text-neutral-500 mt-12">
              {variant === 'login' ? 'First time using Netflix?' : 'Already have an account?'}
              <span
                onClick={isLoading ? undefined : toggleVariant}
                className={`text-white ml-1 cursor-pointer ${
                  isLoading ? 'opacity-50' : 'hover:underline'
                }`}
              >
                {variant === 'login' ? 'Create an account' : 'Login'}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default Auth;