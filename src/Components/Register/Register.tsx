import "./Register.scss"
import { Steps } from 'primereact/steps';
import { useIntl } from 'react-intl';
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import PersonalDataForm from "./PersonalDataForm/PersonalDataForm";
import CoverageDataForm from "./CoverageDataForm/CoverageDataForm";
import SecurityDataForm from "./SecurityDataForm/SecurityDataForm";

export default function Register(){
    const intl = useIntl();
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        {label: intl.formatMessage({ id: 'Personal' })},
        {label: intl.formatMessage({ id: 'Coverage'})},
        {label: intl.formatMessage({ id: 'Security'})}
    ];

    return(
        <div className="flexible--column registerContainer">
            <header className="flexible--column registerHeader">
                <img src="/img/ccyr.png" alt="" />
                <h1>{intl.formatMessage({id: "Registration"})}</h1>
                <Steps model={items} className="steps" activeIndex={activeIndex}/>
            </header>
            <main className="registerBody">
                <Routes>
                    <Route path="/step1" element={
                            <PersonalDataForm setStep={setActiveIndex}/>
                        }/>
                    <Route path="/step2" element={
                            <CoverageDataForm setStep={setActiveIndex}/>
                        }/>
                    <Route path="/step3" element={
                            <SecurityDataForm setStep={setActiveIndex}/>
                        }/>
                </Routes>
            </main>
        </div>
    );
}