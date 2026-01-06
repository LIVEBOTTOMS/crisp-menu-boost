import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DebugUser() {
    const [email, setEmail] = useState('menuxlive@gmail.com');
    const [password, setPassword] = useState('MenuXPrime123!');
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const checkUser = async () => {
        setLoading(true);
        setStatus('Attempting to create user to check existence...');

        try {
            // Attempt to sign up
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: 'MenuX Admin',
                    }
                }
            });

            if (error) {
                if (error.message.includes('already registered')) {
                    setStatus('User ALREADY EXISTS. The password might be incorrect.');
                } else {
                    setStatus(`Error: ${error.message}`);
                }
            } else if (data.user) {
                if (data.user.identities && data.user.identities.length === 0) {
                    setStatus('User ALREADY EXISTS (Identity found but no new identity created).');
                } else {
                    setStatus('User DID NOT EXIST. Account has now been CREATED successfully with password: ' + password);
                }
            } else {
                setStatus('Unknown state.');
            }
        } catch (e: any) {
            setStatus(`Exception: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        setLoading(true);
        setStatus('Sending password reset email...');
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/admin/update-password', // Assuming this route exists or just root
        });

        if (error) {
            setStatus(`Error sending reset: ${error.message}`);
        } else {
            setStatus('Password reset email sent! Check your inbox.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
                <CardHeader>
                    <CardTitle>Debug User: {email}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="bg-gray-700 border-gray-600"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>New/Test Password</Label>
                        <Input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="bg-gray-700 border-gray-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <Button
                            onClick={checkUser}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? 'Checking...' : 'Check / Create User'}
                        </Button>

                        <Button
                            onClick={resetPassword}
                            disabled={loading}
                            variant="outline"
                            className="w-full border-gray-600 hover:bg-gray-700"
                        >
                            Send Password Reset Email
                        </Button>
                    </div>

                    {status && (
                        <div className={`p-4 rounded ${status.includes('CREATED') ? 'bg-green-900/50 text-green-200' : 'bg-yellow-900/50 text-yellow-200'}`}>
                            <strong>Result:</strong> {status}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
