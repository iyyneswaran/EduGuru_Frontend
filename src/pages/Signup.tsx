import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, Eye, EyeOff, User, Sparkles, GraduationCap, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedName) {
            setError('Name is required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await signup(normalizedName, normalizedEmail, password, role);
            navigate(role === 'TEACHER' ? '/admin' : '/');
        } catch (err: any) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const fields = [
        {
            id: 'signup-name',
            label: 'Name *',
            icon: User,
            type: 'text',
            placeholder: 'John Doe',
            value: name,
            onChange: setName,
            delay: 0.3,
        },
        {
            id: 'signup-email',
            label: 'Email *',
            icon: Mail,
            type: 'email',
            placeholder: 'you@example.com',
            value: email,
            onChange: setEmail,
            delay: 0.35,
        },
        {
            id: 'signup-password',
            label: 'Password *',
            icon: Lock,
            type: showPassword ? 'text' : 'password',
            placeholder: '••••••••',
            value: password,
            onChange: setPassword,
            delay: 0.4,
            isPassword: true,
        },
        {
            id: 'signup-confirm-password',
            label: 'Confirm Password *',
            icon: Lock,
            type: showPassword ? 'text' : 'password',
            placeholder: '••••••••',
            value: confirmPassword,
            onChange: setConfirmPassword,
            delay: 0.45,
        },
    ];

    return (
        <div className="min-h-screen bg-background relative flex items-center justify-center px-4 overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-32 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[120px]"
                    animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
                    animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md relative z-10"
            >
                {/* Card */}
                <div className="bg-card/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-accent/5">
                    {/* Logo */}
                    <motion.div
                        className="flex flex-col items-center mb-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-accent to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-accent/30">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Create Account
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">Start your learning journey today</p>
                    </motion.div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selector */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <label className="text-sm font-medium text-foreground/80 mb-2 block">I am a *</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('STUDENT')}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${role === 'STUDENT'
                                            ? 'border-accent bg-accent/10 text-accent shadow-lg shadow-accent/10'
                                            : 'border-white/10 bg-secondary/30 text-muted-foreground hover:border-white/20'
                                        }`}
                                >
                                    <GraduationCap className="w-5 h-5" />
                                    <span className="font-semibold text-sm">Student</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('TEACHER')}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${role === 'TEACHER'
                                            ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
                                            : 'border-white/10 bg-secondary/30 text-muted-foreground hover:border-white/20'
                                        }`}
                                >
                                    <BookOpen className="w-5 h-5" />
                                    <span className="font-semibold text-sm">Teacher</span>
                                </button>
                            </div>
                        </motion.div>

                        {fields.map((field) => (
                            <motion.div
                                key={field.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: field.delay }}
                            >
                                <label className="text-sm font-medium text-foreground/80 mb-1.5 block">
                                    {field.label}
                                </label>
                                <div className="relative">
                                    <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id={field.id}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        required
                                        className={`pl-10 bg-secondary/50 border-white/5 focus:border-accent/50 h-11 ${field.isPassword ? 'pr-10' : ''
                                            }`}
                                    />
                                    {field.isPassword && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="pt-1"
                        >
                            <Button
                                id="signup-submit"
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 text-base font-semibold bg-gradient-to-r from-accent to-cyan-600 hover:from-accent/90 hover:to-cyan-600/90 shadow-lg shadow-accent/25 transition-all duration-300 hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <motion.div
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    />
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Create Account
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                        <span className="text-xs text-muted-foreground">or</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    {/* Login link */}
                    <motion.p
                        className="text-center text-sm text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-accent font-semibold hover:text-accent/80 transition-colors"
                        >
                            Sign in
                        </Link>
                    </motion.p>
                </div>

                {/* Bottom glow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-accent/20 blur-2xl rounded-full" />
            </motion.div>
        </div>
    );
}
