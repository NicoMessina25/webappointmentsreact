import "./Register.scss"
import { Steps } from 'primereact/steps';
import { useIntl } from 'react-intl';
import { useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import PersonalDataForm from "./PersonalDataForm/PersonalDataForm";
import CoverageDataForm from "./CoverageDataForm/CoverageDataForm";
import SecurityDataForm from "./SecurityDataForm/SecurityDataForm";
import Modal from "../Modal/Modal";

export default function Register(){
    const intl = useIntl();
    const [activeIndex, setActiveIndex] = useState(0);
    const [user, setUser] = useState({
        username: "",
        password: "",
        documentType:0,
        documentNumber:"",
        name: "",
        lastname: "",
        mail:"",
        gender: "",
        date: "",
        phone: {
            prefix: "",
            area: "",
            number:"",
        },
        address: "",
        city: "",
        memberNumber:"",
        medicalCoverage: false,
        medCoverageThroughJob: true,
        prepaid:{},
        plan:"",
        acceptTerms:false,
    });
    const [displayRegisterCancel, setDisplayRegisterCancel] = useState(false)

    const items = [
        {label: intl.formatMessage({ id: 'Personal' })},
        {label: intl.formatMessage({ id: 'Coverage'})},
        {label: intl.formatMessage({ id: 'Security'})}
    ];

    const {step}:any = useParams();

    useEffect(() => {
      setActiveIndex(step-1)
    }, [step])
    

    function renderStep(){
        switch (step){
            case "1":return <PersonalDataForm user={user} setUser={setUser} setDisplayRegisterCancel={setDisplayRegisterCancel}/>;
            case "2": return <CoverageDataForm setStep={setActiveIndex} user={user} setUser={setUser} setDisplayRegisterCancel={setDisplayRegisterCancel}/>; 
            case "3": return <SecurityDataForm setStep={setActiveIndex} user={user} setUser={setUser} setDisplayRegisterCancel={setDisplayRegisterCancel}/>;
            
            default: <PersonalDataForm user={user} setUser={setUser} setDisplayRegisterCancel={setDisplayRegisterCancel}/>;
        }
    }

    return(
        <div className="flexible--column registerContainer">
            <header className="flexible--column registerHeader">
                <img src="/img/ccyr.png" alt="" />
                <h1>{intl.formatMessage({id: "Registration"})}</h1>
                <Steps model={items} className="steps" activeIndex={activeIndex}/>
            </header>
            <main className="registerBody">
                {renderStep()}
                    
                {/* <Routes>
                    <Route path="/step1" element={
                            <PersonalDataForm setStep={setActiveIndex} user={user} setUser={setUser} setDisplayRegisterCancel={setDisplayRegisterCancel}/>
                        }/>
                    <Route path="/step2" element={
                            <CoverageDataForm setStep={setActiveIndex} setDisplayRegisterCancel={setDisplayRegisterCancel}/>
                        }/>
                    <Route path="/step3" element={
                            <SecurityDataForm setStep={setActiveIndex} user={user} setUser={setUser} setDisplayRegisterCancel={setDisplayRegisterCancel}/>
                        }/>
                </Routes> */}
                <Modal visible={displayRegisterCancel} setVisible={setDisplayRegisterCancel} header={intl.formatMessage({ id: 'CancelSignUp' })}  footerButtonRightText={intl.formatMessage({ id: 'ContinueSigningUp' })}  footerButtonLeftText={intl.formatMessage({ id: 'YesCancel' })} onClickRightBtn={()=>{setDisplayRegisterCancel(false)}}  pathLeftBtn={"/"} pathRightBtn={"#"}>
                        {intl.formatMessage({id:"CancelSignUpDescription"})}
                </Modal>
            </main>
        </div>
    );
}