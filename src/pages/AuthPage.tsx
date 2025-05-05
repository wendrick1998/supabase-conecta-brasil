
import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabParam === 'signup' ? 'signup' : 'login');
  const { user, isLoading, signIn, signUp } = useAuth();
  
  useEffect(() => {
    if (tabParam === 'signup') {
      setActiveTab('signup');
    } else if (tabParam === 'login') {
      setActiveTab('login');
    }
  }, [tabParam]);
  
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
        <title>Vendah+ - {activeTab === 'login' ? 'Login' : 'Cadastro'}</title>
      </Helmet>
      
      <div className="min-h-screen bg-dark-gradient flex flex-col justify-center items-center px-4 py-10">
        <div className="mb-8 flex flex-col items-center">
          <img 
            src="/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png" 
            alt="Vendah+"
            className="h-28 mb-2" 
          />
        </div>
        
        <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl border-vendah-purple/30 overflow-hidden bg-vendah-blue/90 backdrop-blur-md">
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8 bg-vendah-black/40 p-1 rounded-lg border border-vendah-purple/20">
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-vendah-purple data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-400 py-3 text-base transition-all duration-200"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-vendah-purple data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-400 py-3 text-base transition-all duration-200"
                >
                  Cadastro
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 text-sm mb-1 font-medium">E-mail</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Digite seu e-mail" 
                              className="bg-vendah-black/60 border-2 border-vendah-purple/50 text-white placeholder:text-gray-400 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.4)]" 
                              autoFocus
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 text-sm mb-1 font-medium">Senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Digite sua senha" 
                              className="bg-vendah-black/60 border-2 border-vendah-purple/50 text-white placeholder:text-gray-400 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.4)]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <div className="text-right">
                      <a href="#" className="text-vendah-neon hover:underline text-sm">Esqueceu a senha?</a>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-vendah-neon hover:bg-vendah-neon/90 text-vendah-black font-bold py-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.6)] text-base"
                      disabled={loginForm.formState.isSubmitting}
                    >
                      {loginForm.formState.isSubmitting ? 'Entrando...' : 'ENTRAR'}
                    </Button>
                    
                    <div className="text-center pt-2">
                      <button 
                        type="button"
                        onClick={() => setActiveTab('signup')} 
                        className="text-vendah-neon hover:underline text-base"
                      >
                        Criar conta
                      </button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="signup">
                <h2 className="text-xl font-bold mb-6 text-center text-vendah-purple">Cadastrar sua conta</h2>
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-5">
                    <FormField
                      control={signupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 text-sm mb-1 font-medium">Nome completo</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite seu nome" 
                              className="bg-vendah-black/60 border-2 border-vendah-purple/50 text-white placeholder:text-gray-400 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.4)]" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 text-sm mb-1 font-medium">E-mail</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Digite seu e-mail" 
                              className="bg-vendah-black/60 border-2 border-vendah-purple/50 text-white placeholder:text-gray-400 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.4)]" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 text-sm mb-1 font-medium">Telefone</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="Digite seu telefone" 
                              className="bg-vendah-black/60 border-2 border-vendah-purple/50 text-white placeholder:text-gray-400 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.4)]" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 text-sm mb-1 font-medium">Função na empresa</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite sua função" 
                              className="bg-vendah-black/60 border-2 border-vendah-purple/50 text-white placeholder:text-gray-400 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.4)]" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 text-sm mb-1 font-medium">Senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Digite sua senha" 
                              className="bg-vendah-black/60 border-2 border-vendah-purple/50 text-white placeholder:text-gray-400 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.4)]" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 text-sm mb-1 font-medium">Confirmar senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirme sua senha" 
                              className="bg-vendah-black/60 border-2 border-vendah-purple/50 text-white placeholder:text-gray-400 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.4)]" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-vendah-purple hover:bg-vendah-purple/90 text-white font-bold py-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(93,46,140,0.6)] mt-2 text-base"
                      disabled={signupForm.formState.isSubmitting}
                    >
                      {signupForm.formState.isSubmitting ? 'Cadastrando...' : 'CADASTRAR'}
                    </Button>
                    
                    <div className="text-center pt-2">
                      <button 
                        type="button"
                        onClick={() => setActiveTab('login')} 
                        className="text-vendah-neon hover:underline text-base"
                      >
                        Já tem conta? Fazer login
                      </button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-gray-500 text-sm">
          © 2025 Vendah+. Todos os direitos reservados.
        </div>
      </div>
    </>
  );
};

export default AuthPage;
