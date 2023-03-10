import "./Register.scss"
import { Steps } from 'primereact/steps';
import { useIntl } from 'react-intl';
import { useEffect, useState, useRef, useContext } from "react";
import { Toast } from 'primereact/toast';
import { useNavigate, useParams } from "react-router-dom";
import PersonalDataForm from "./PersonalDataForm/PersonalDataForm";
import CoverageDataForm from "./CoverageDataForm/CoverageDataForm";
import SecurityDataForm from "./SecurityDataForm/SecurityDataForm";
import Modal from "../Modal/Modal";
import { saveUser} from "../../services/nsUserService";
import { appContext } from "../Context/appContext";
import { langContext } from "../Context/langContext";

export default function Register() {
    const intl = useIntl();
    const [activeIndex, setActiveIndex] = useState(0);
    
    const [displayRegisterCancel, setDisplayRegisterCancel] = useState(false)
    const [displayRegisterComplete, setDisplayRegisterComplete] = useState(false);

    const {user}:any = useContext(appContext);
    const {setUser}:any = useContext(appContext);


    const items = [
        { label: intl.formatMessage({ id: 'Personal' }) },
        { label: intl.formatMessage({ id: 'Coverage' }) },
        { label: intl.formatMessage({ id: 'Security' }) }
    ];

    const { step }: any = useParams();
    const toast: any = useRef(null);
    const navigate = useNavigate();
    const { languageId }: any = useContext(langContext)

    useEffect(() => {
        setActiveIndex(step - 1)
    }, [step]);



    function onSubmit(user: any) {


        saveUser(user, false).then((res: any) => {



            switch (res.status) {
                case 201: setDisplayRegisterComplete(true); break;
                case 409:
                case 226: {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: intl.formatMessage({ id: res.status === 409 ? "ThereAreMissingRequiredFields" : "ThereIsAlreadyAnUserWithTheSameDocument" }) });
                    navigate("/register/1");
                    break;
                }
                case 302: {
                    saveUser(user, true);
                    break;
                }
                case 303: {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: intl.formatMessage({ id: "ThatUsernameIsAlreadyUsed" }) });
                    break;
                }

                default: console.log("nada")
            }



        });
    }


    function renderStep() {
        switch (step) {
            case "1": return <PersonalDataForm user={user} setUser={setUser} setDisplayRegisterCancel={setDisplayRegisterCancel} toast={toast} />;
            case "2": return <CoverageDataForm user={user} setUser={setUser} setDisplayRegisterCancel={setDisplayRegisterCancel} />;
            case "3": return <SecurityDataForm user={user} setUser={setUser} setDisplayRegisterCancel={setDisplayRegisterCancel} onSubmit={onSubmit} />;

            default: <PersonalDataForm user={user} setUser={setUser} setDisplayRegisterCancel={setDisplayRegisterCancel} toast={toast} />;
        }
    }




    return (
        <div className="flexible--column registerContainer">
            <header className="flexible--column registerHeader">
                <img src="/img/advenio-medere.png" alt="" />
                <div className="flexible--column stepsContainer" >
                    <h1>{intl.formatMessage({ id: "Registration" })}</h1>
                    <Steps model={items} className="steps" activeIndex={activeIndex} />
                </div>
                
            </header>
            <main className="registerBody">
                {renderStep()}
                <Modal visible={displayRegisterCancel} setVisible={setDisplayRegisterCancel} header={intl.formatMessage({ id: 'CancelSignUp' })} footerButtonRightText={intl.formatMessage({ id: 'ContinueSigningUp' })} footerButtonLeftText={intl.formatMessage({ id: 'YesCancel' })} onClickRightBtn={() => { setDisplayRegisterCancel(false) }} pathLeftBtn={"/"} pathRightBtn={"#"}>
                    {intl.formatMessage({ id: "CancelSignUpDescription" })}
                </Modal>
                <Modal visible={displayRegisterComplete} setVisible={setDisplayRegisterComplete} header={intl.formatMessage({ id: "SuccessfullSignUp" })} footerButtonRightText={intl.formatMessage({ id: 'Join' })} footerButtonLeftText={intl.formatMessage({ id: 'Cancel' })} onClickLeftBtn={() => setDisplayRegisterComplete(false)} pathLeftBtn={"#"} pathRightBtn={"/"}>
                    {intl.formatMessage({ id: 'SuccessfullSignUpDescription' })}
                </Modal>


                <Toast ref={toast} />
            </main>
        </div>
    );
}