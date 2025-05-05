
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

// Form schema for login
const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      toast.error('Falha ao entrar', {
        description: error.message || 'Verifique suas credenciais e tente novamente',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200 text-sm mb-1 font-medium">E-mail</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Digite seu e-mail" 
                  className="bg-vendah-black/80 border-2 border-vendah-purple/40 text-white placeholder:text-gray-500 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.5)]" 
                  autoFocus
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200 text-sm mb-1 font-medium">Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha" 
                    className="bg-vendah-black/80 border-2 border-vendah-purple/40 text-white placeholder:text-gray-500 rounded-lg py-6 px-4 pr-10 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.5)]"
                    {...field} 
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        <div className="text-right">
          <a href="#" className="text-vendah-neon hover:text-vendah-neon/80 hover:underline text-sm font-medium transition-colors">Esqueceu a senha?</a>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-vendah-neon hover:bg-vendah-neon/90 text-vendah-black font-bold py-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.6)] text-base"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Entrando...' : 'ENTRAR'}
        </Button>
        
        <div className="text-center pt-2">
          <button 
            type="button"
            onClick={onSwitchToSignup} 
            className="text-vendah-neon hover:text-vendah-neon/80 hover:underline text-base font-medium transition-colors"
          >
            Criar conta
          </button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
