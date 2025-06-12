"use client";

import {useState, useEffect} from 'react';
import Image from "next/image";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from "next/navigation";

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useCreateMutation } from '@/hooks/api/common/create';
import { setToken } from "@/lib/token";



const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login(){
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);


  const { mutate, isPending, data, error } = useCreateMutation({
    queryKey: "user-login",
    endpoint: "/users/login/",
    Entity: "Login",
    showToast: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });


  const onSubmit = async (values: LoginFormData) => {
    mutate({
      data: values,
      onSuccess: {
        callback: (data) => {

          setToken(data?.token);

          const roles = data?.roles || [];

          if (roles && roles.length === 1) {
            return router.push(`/${roles[0].name}`);
          }

          router.push("/select-role");
        },
        message: "Logged in successfully",
      },
    });
  };

  const togglePasswordVisibility = () => setShowPassword(v => !v);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 w-full min-h-screen w-full shadow-lg overflow-hidden bg-white">
      <div className="hidden lg:block lg:col-span-7 bg-gray-100 h-full relative">
        <Image
          src="/images/penthouse-1.jpg"
          alt="login-cover-photo"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-90"></div>
        <h2 className="absolute top-8 left-8 text-white text-4xl font-bold z-10">
          Proptic
        </h2>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="text-white text-1xl lg:text-2xl font-semibold text-center">
            Property management made easy
          </span>
        </div>
      </div>
      <div className="col-span-1 lg:col-span-5 flex flex-col justify-center p-8 h-full">
        <Card className="w-full shadow-none border-none max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Sign in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              {generalError && (
                <Alert variant="destructive">
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}  />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
