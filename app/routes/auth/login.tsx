import {Card} from "primereact/card";
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import {type Auth, authApi} from "./service/auth.api";
import {toErrorMessage} from "../../services/api";
import {useState,useEffect} from "react";
export default function Login(){
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [data, setData] = useState<Auth[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'invalid-credentials' | 'error'>('idle');

    async function authenticateUser(){
        setLoading(true);
        setError(null);
        setLoginStatus('idle');
        setStatusMessage('Sending login request...');
        console.log('authenticateUser clicked', { email });

        try {
            const res = await authApi.login({email: email, password: password});
            // axios response should be in res.data
            console.log('login response', res);
            const token = (res && (res as any).data && (res as any).data.access_token) || (res as any).access_token;
            if (token) {
                // store both keys to be safe (some parts of app read different keys)
                localStorage.setItem('token', token);
                localStorage.setItem('access_token', token);
                setStatusMessage('Login successful — token saved');
            }
            setLoginStatus('success');
            // redirect to authenticated home
            window.location.href = '/';
        } catch(e: unknown) {
            console.log(e);
            const msg = toErrorMessage(e);
            setError(msg);
            setStatusMessage('Login failed');

            const AnyErr = e as any;
            const status: number | undefined = AnyErr?.response?.status;

            if (msg.toLowerCase().includes('invalid') || status === 401) {
                setLoginStatus('invalid-credentials');
            } else {
                setLoginStatus('error');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center mt-[100px]">
            {loginStatus === 'success' ? (
                <Card title="Login Successful" subTitle="You have been logged in successfully!" className="w-[400px] text-center">
                    <p className="m-0">Welcome back!</p>
                </Card>
            ) : loginStatus === 'invalid-credentials' ? (
                <Card title="Login Failed" subTitle="Invalid Credentials" className="w-[400px] text-center">
                    <p className="m-0">The email or password you entered is incorrect. Please try again.</p>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    <div className="flex justify-center mt-4">
                        <Button label="Back to login" onClick={() => { setLoginStatus('idle'); setError(null); }}/>
                    </div>
                </Card>
            ) : (
                <Card title="Login" subTitle="Sign in to your account" className="w-[400px] text-center">
                    <div className="m-0">
                        <p className="text-center">Email</p>
                        <InputText value={email} onChange={(e) => setEmail(e.target.value)} keyfilter="email" placeholder="Email"/>
                        <p className="text-center">Password</p>
                        <Password value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} tabIndex={1} />
                    </div>
                    {error && <p className="text-red-600 mt-2">{error}</p>}
                    {statusMessage && <p className="text-sm text-gray-600 mt-2">{statusMessage}</p>}
                    <div className="flex justify-center mt-[20px]">
                        <Button label={loading ? 'Logging in...' : 'Login'} onClick={authenticateUser} disabled={loading}/>
                    </div>
                </Card>
            )}
        </div>
    )
}