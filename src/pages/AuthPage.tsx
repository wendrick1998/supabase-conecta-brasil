
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';

// Form schema for login
const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

// Form schema for signup with additional fields
const signupSchema = z.object({
  name: z.string().min(1, 'Digite seu nome'),
  email: z.string().email('Digite um e-mail válido'),
  phone: z.string().min(1, 'Digite seu telefone'),
  role: z.string().min(1, 'Digite sua função'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<string>('login');
  const { user, isLoading, signIn, signUp } = useAuth();
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const onLoginSubmit = async (data: LoginFormValues) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      toast.error('Falha ao entrar', {
        description: error.message || 'Verifique suas credenciais e tente novamente',
      });
    }
  };
  
  const onSignupSubmit = async (data: SignupFormValues) => {
    const { error } = await signUp(data.email, data.password);
    if (error) {
      toast.error('Falha ao criar conta', {
        description: error.message || 'Verifique suas informações e tente novamente',
      });
    } else {
      toast.success('Conta criada com sucesso', {
        description: 'Verifique seu e-mail para confirmar o cadastro',
      });
      setActiveTab('login');
    }
  };

  // Redirect if user is already authenticated
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Helmet>
        <title>ResolveClick - Login</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6">
        <div className="mb-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700 w-24 text-center">ResolveClick</span>
        </div>
        
        <Card className="w-full max-w-sm mx-auto shadow-md rounded-lg bg-white">
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Digite seu e-mail" 
                              className="rounded-md border p-3" 
                              autoFocus
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Digite sua senha" 
                              className="rounded-md border p-3"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-md" 
                      disabled={loginForm.formState.isSubmitting}
                    >
                      {loginForm.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
                    </Button>
                    
                    <div className="text-center">
                      <button 
                        type="button"
                        onClick={() => setActiveTab('signup')} 
                        className="text-blue-600 underline text-sm mt-4 block text-center w-full"
                      >
                        Criar conta
                      </button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="signup">
                <div className="text-lg font-semibold text-center mb-4">Crie sua conta</div>
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormControl>
                            <Input 
                              placeholder="Digite seu nome" 
                              className="rounded-md border p-3" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Digite seu e-mail" 
                              className="rounded-md border p-3" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="Digite seu telefone" 
                              className="rounded-md border p-3" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormControl>
                            <Input 
                              placeholder="Digite sua função" 
                              className="rounded-md border p-3" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Digite sua senha" 
                              className="rounded-md border p-3" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirme sua senha" 
                              className="rounded-md border p-3" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-md" 
                      disabled={signupForm.formState.isSubmitting}
                    >
                      {signupForm.formState.isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>
                    
                    <div className="text-center">
                      <button 
                        type="button"
                        onClick={() => setActiveTab('login')} 
                        className="text-blue-600 underline text-sm mt-4 block text-center w-full"
                      >
                        Já tem conta? Faça login
                      </button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AuthPage;
