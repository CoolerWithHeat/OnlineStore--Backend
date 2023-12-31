import React from "react";
import { ErrorWindow, GetHost, Get_Static_Url, ProviderButton } from "./components";
import {GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, getAuth} from "firebase/auth";
import firebaseConfig from "./firebase";
import { initializeApp, registerVersion } from "firebase/app";
import jwtDecode from 'jwt-decode'
import { json } from "react-router-dom";

function AccountLoginRegisterform(){
    
    var [SocialAuthData, Update_SocialAuthData] = React.useState('')

    async function getStyle(){
        let obj = await import('./loginForm.css');
    }

    getStyle()

    var [RegisterCredentials, UpdateRegisterCredentials] = React.useState({email: '', password1: '', password2: ''})
    var [LoginCredentials, UpdateLoginCredentials] = React.useState({email: '', password: ''})
    var [ErrorState, UpdateErrorState] = React.useState(false)
    
    

    const StartOauth2Authentication = (AuthType) => {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        if (AuthType == "google"){

            async function ManageRequest(){

                const googleProvider = new GoogleAuthProvider();
                const ProviderRequest = signInWithPopup(auth, googleProvider);
                const data = await ProviderRequest

                const BackendRequest = await fetch(Get_Static_Url(`/SignUp/`), {

                    method:'POST',
                    
                    headers: {
                        
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',

                    },

                    body: JSON.stringify({google: data}),

                })

            }

            ManageRequest()
            

        }

        else if (AuthType == "facebook"){

            async function ManageRequest(){
                const FacebookProvider = new FacebookAuthProvider();
                const ProviderRequest = signInWithPopup(auth, FacebookProvider);
                const data = await ProviderRequest

                const BackendRequest = await fetch(Get_Static_Url(`/SignUp/`), {

                    method:'POST',
                    
                    headers: {
                        
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',

                    },

                    body: JSON.stringify({facebook: data}),

                })

            }

            ManageRequest()

        }
        
    }

    const UpdateCredentials = (InputBase) => {
        const indexData = InputBase.target.name;
        const value = InputBase.target.value;

        UpdateRegisterCredentials((InitialState)=>{
            return {...RegisterCredentials, [indexData]: value}
        })

    }




    const UpdateCredentialsForLogin = (InputBase) => {

        const indexData = InputBase.target.name;
        const value = InputBase.target.value;

        UpdateLoginCredentials((InitialState)=>{
            return {...LoginCredentials, [indexData]: value}
        })

    }

    function CheckIfDataValid(){

        if (!RegisterCredentials.password1 || !RegisterCredentials.password2){
            UpdateErrorState((InitialState)=>{
                return 'make sure to provide data to each field';
            })

            return false
        }

        if (!(RegisterCredentials.password1 == RegisterCredentials.password2)){
            
            UpdateErrorState((InitialState)=>{
                return 'passwords does not match!';
            })

            return false

        }

        

        if (RegisterCredentials.password1.length < 8){
            
            UpdateErrorState((InitialState)=>{
                return 'password has to be at least 8 characters';
            })

            return false

        }

        if (!(RegisterCredentials.email.endsWith("@gmail.com"))){
            
            UpdateErrorState((InitialState)=>{
                return 'make sure to provide valid Gmail address';
            })

            return false

        }

        return true

    }

    function SubmitToBackend(){

        if (CheckIfDataValid()){
            UpdateErrorState(()=>false)

            async function ManageRequest(){
                
                const BackendRequest = await fetch(Get_Static_Url(`/SignUp/`), {

                    method:'POST',
                    
                        headers: {
                            
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',

                        },

                    body: JSON.stringify({custom: RegisterCredentials}),

                })

                if (BackendRequest.status==200){
                    window.location.href = '../Main/'
                }

            }
            
            ManageRequest()
        }

    }

    function SubmitToBackendForLogin(){
        if (!(LoginCredentials.email.endsWith("@gmail.com"))){
            UpdateErrorState((InitialState)=>{
                return 'make sure to provide valid Gmail address';
            })

        }
        else if (LoginCredentials.password.length < 8){
            UpdateErrorState((InitialState)=>{
                return 'password has to be at least 8 characters';
            })

        }else{
            UpdateErrorState((InitialState)=>{
                return false;
            })
            async function ManageRequest(){

                const BackendRequest = await fetch(Get_Static_Url(`/SignIn/`), {

                    method:'POST',
                    
                    headers: {
                        
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',

                    },

                    body: JSON.stringify({credentials: LoginCredentials}),

                })

                if (BackendRequest.status == 500){
                    const message = await BackendRequest.json().result;
                    UpdateErrorState((InitialState)=>{
                        return message;
                    })
                }

            }

            ManageRequest()
        }
    }

    return (
        <div className="main">  	
           
            <input type="checkbox" id="chk" aria-hidden="true"/>

                <div className="signup">
                    {ErrorState ? <ErrorWindow text={ErrorState}/> : null}
                        
                        <label htmlFor="chk" aria-hidden="true">Sign up</label>
                        <input onChange={UpdateCredentials} type="email" name="email" placeholder="Email adress" required={true}/>
                        <input onChange={UpdateCredentials} type="password" name="password1" placeholder="Password" required={true}/>
                        <input onChange={UpdateCredentials} type="password" name="password2" placeholder="confirm your password" required={true}/>
                        <button onClick={SubmitToBackend} >Sign up</button>
                        <div id="ButtonWindow">
                
                            <button onClick={()=>StartOauth2Authentication("google")} id="AuthButton"><img id="ProviderButtonImage" src="https://cdn-icons-png.flaticon.com/512/2504/2504739.png"/></button>
                            <button onClick={()=>StartOauth2Authentication("facebook")} id="AuthButton"><img id="ProviderButtonImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png"/></button>
                            
                        </div>

                </div>

                <div className="login">
                        <label htmlFor="chk" aria-hidden="true">Login</label>
                        <input onChange={UpdateCredentialsForLogin} type="email" name="email" placeholder="Email" required=""/>
                        <input onChange={UpdateCredentialsForLogin} type="password" name="password" placeholder="Password" required=""/>
                        <button onClick={SubmitToBackendForLogin}>Login</button>
                        <div id="ButtonWindow">
                
                            <button onClick={()=>StartOauth2Authentication("google")} id="AuthButton"><img id="ProviderButtonImage" src="https://cdn-icons-png.flaticon.com/512/2504/2504739.png"/></button>
                            <button onClick={()=>StartOauth2Authentication("facebook")} id="AuthButton"><img id="ProviderButtonImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png"/></button>
                            
                        </div>
                </div>
        </div>
    )
}

export default AccountLoginRegisterform;