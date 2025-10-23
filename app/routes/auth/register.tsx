import {Button} from "primereact/button";
import {Password} from "primereact/password";
import {InputText} from "primereact/inputtext";
import {Card} from "primereact/card";
import {useState,useEffect} from "react";
import {type Auth, authApi} from "./service/auth.api";
import {toErrorMessage} from "../../services/api";

export default function Register(){
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password , setPassword] = useState('');

    // unused data state removed
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // 'idle' | 'success' | 'email-exists' | 'error'
    const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'email-exists' | 'error'>('idle');


   async function createUser(){
       setLoading(true);
       setError(null);
       setRegistrationStatus('idle');

       try {
           const user = await authApi.create({email: email, password: password, firstname: fname, lastname: lname});
           console.log('created', user);
           // If creation returned data, treat as success
           setRegistrationStatus('success');
       }catch(e: unknown){
           console.log(e);
           const msg = toErrorMessage(e);
           setError(msg);

           // Try to detect axios error with response/status for more robust handling
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           const anyErr = e as any;
           const status: number | undefined = anyErr?.response?.status;
           const respData: any = anyErr?.response?.data;

           // If backend returns 400, treat it as the common 'email already exists' case for now
           if (status === 400) {
               setRegistrationStatus('email-exists');
               return;
           }

           // fallback: if message text looks like email-exists
           if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('exist')) {
               setRegistrationStatus('email-exists');
           } else {
               setRegistrationStatus('error');
           }
       }finally {
           setLoading(false);
       }
   }

        useEffect(() => {
            // check current user for debugging - ignore result
            authApi.getCurrentUser().then(() => {
                    // noop
            }).catch(() => {
                    // ignore
            });

        }, []);


    return (
        <div className="flex justify-center mt-[100px]">
            {registrationStatus === 'success' ? (
                <Card title="Registration successful!" className="w-[400px] text-center">
                    <p>Your account has been created. You can now log in.</p>
                </Card>
            ) : registrationStatus === 'email-exists' ? (
                <Card title="Registration failed" className="w-[400px] text-center">
                    <p className="text-red-600">Email already exists</p>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    <div className="flex justify-center mt-4">
                        <Button label="Back to register" onClick={() => { setRegistrationStatus('idle'); setError(null); }}/>
                    </div>
                </Card>
            ) : (
                <Card title="Register" subTitle="Create an account" className="w-[400px] text-center">
                    <div className="m-0">
                        <p className="text-center">First Name</p>
                        <InputText value={fname} onChange={(e) => setFname(e.target.value)}/>
                        <p className="text-center">Last Name</p>
                        <InputText value={lname} onChange={(e) => setLname(e.target.value)}/>
                        <p className="text-center">Email</p>
                        <InputText value={email} keyfilter="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                        <p className="text-center">Password</p>
                        <Password value={password} onChange={(e) => setPassword(e.target.value)} feedback={false}
                                  tabIndex={1}/>
                    </div>
                    {error && <p className="text-red-600 mt-2">{error}</p>}
                    <div className="flex justify-center mt-[20px]">
                        <Button label={loading ? 'Registering...' : 'Register'} onClick={createUser} disabled={loading}/>
                    </div>
                </Card>
            )}
        </div>
    )
}