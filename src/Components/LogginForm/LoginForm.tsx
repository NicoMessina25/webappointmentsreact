import React, { useState} from "react";
import "../../scss/styles.scss"
import "./LoginForm.scss"
import {Button} from "primereact/button"
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Link } from "react-router-dom";
import Modal from "../Modal/Modal";
import { useIntl } from 'react-intl';

export default function LogginForm(){
    const [checked, setChecked] = useState(false);
    const [displayNotUserFound, setDisplayNotUserFound] = useState(false);
    const [displayRegister, setDisplayRegister] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    function validateUser(){
        console.log(userName, password);
        
        setDisplayNotUserFound(true)
    }
    
    const intl = useIntl();
    return( 
        <div className="formContainer flexible--column">
            <div className="loginHeader">
                <h1>{intl.formatMessage({ id: 'Welcome' })}</h1>
                <h4>{intl.formatMessage({ id: 'EnterOrRequestYourTurnOrRecipe' })}</h4>
            </div>
            <div className="flexible--column loginBody">
            
               <Button label={intl.formatMessage({ id: 'SignInWithGoogle' })} className="buttonMain2"/>
               <div className="lineContainer flexible--row">
                    <div className="lineGreenBlue"></div>
                    <p>O</p>
                    <div className="lineGreenBlue"></div>
               </div>
               <div className="flexible--column inputContainer">
                    <p>{intl.formatMessage({ id: 'User' })}</p>
                    <InputText value={userName} onChange={(e) => setUserName(e.target.value)} className="input" placeholder=""/>
               </div>
               <div className="flexible--column inputContainer">
                    <p>{intl.formatMessage({ id: 'Password' })}</p>
                    <Password value={password} onChange={(e) => setPassword(e.target.value)} toggleMask={true} />
               </div>
               <div className="rememberForgetPasswordContainer flexible--row">
                    <div className="checkboxContainer flexible--row">
                        <Checkbox onChange={e => setChecked(e.checked)} checked={checked} className="checkbox"/>
                        <p>{intl.formatMessage({ id: 'RememberMe' })}</p>
                    </div>
                    <div className="linkContainer flexible--row">
                        <Link to={"/"} className="link">{intl.formatMessage({ id: 'ForgotPassword' })}</Link>
                    </div>
               </div>
               <Button  label={intl.formatMessage({ id: 'Join' })} className="buttonMain" onClick={()=>{validateUser()}}/>
               <p className="text">{intl.formatMessage({ id: 'FirstTimeHere' })}</p>
               <Button label={intl.formatMessage({ id: 'SignIn' })} className="buttonMain2" onClick={()=>setDisplayRegister(true)}/>
            </div>
            <Modal visible={displayNotUserFound} setVisible={setDisplayNotUserFound} header={intl.formatMessage({ id: 'UserDoesNotExist' })} footerButtonRightText={intl.formatMessage({ id: 'Return' })}  onClickRightBtn={()=>setDisplayNotUserFound(false)}>
            {intl.formatMessage({ id: 'UserDoesNotExistDescription' })}
            </Modal>
            <Modal visible={displayRegister} setVisible={setDisplayRegister} header={intl.formatMessage({ id: 'BeforeStarting' }) + "..."}  footerButtonRightText={intl.formatMessage({ id: 'Continue' })}  footerButtonLeftText={intl.formatMessage({ id: 'Cancel' })} onClickLeftBtn={()=>setDisplayRegister(false)}>
            {intl.formatMessage({ id: 'BeforeStartingDescription' })}
            </Modal>
        </div>
    );
}