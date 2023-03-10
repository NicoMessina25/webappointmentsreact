import { useContext, useEffect, useRef, useState } from 'react';
import RadioButtonGroup from '../../RadioButtonGroup/RadioButtonGroup';
import { useIntl } from 'react-intl';
import "./PersonalDataForm.scss"
import InputTextCustom from '../../Inputs/InputText/InputTextCustom';
import InputPhone from '../../Inputs/InputPhone/InputPhone';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import Combobox from '../../Combobox/Combobox';
import { getCities } from '../../../services/nsGeneralService';
import { appContext } from '../../Context/appContext';
import InputDate from '../../Inputs/InputDate/InputDate';
import Modal from '../../Modal/Modal';
import { existsPatientAndNotUser, getValidationData, sendValidationDataAnswers } from '../../../services/nsUserService';
import UserVerificationForm from '../UserVerificationForm/UserVerificationForm';
import { Toast } from 'primereact/toast';
import Loader from '../../Loader/Loader';
import { langContext } from '../../Context/langContext';

export default function PersonalDataForm({ user, setUser, setDisplayRegisterCancel, onSubmit }: any) {
    const [cities, setCities] = useState();
    /* const [inputErrors, setInputErrors] = useState({
        firstname: { caption: "", isValid: true },
        lastname: { caption: "", isValid: true },
        birthdate: { caption: "", isValid: true },
        document: { caption: "", isValid: true },
        documentType: { caption: "", isValid: true },
        gender: { caption: "", isValid: true },
        mobilephone: { caption: "", isValid: true },
        address: { caption: "", isValid: true }
    }) */

    let inputFields = ["firstname", "lastname", "birthdate", "document", "documentType", "gender", "mobilephone", "address"];

    const [questions, setQuestions]: any = useState(null);
    const [answers, setAnswers]: any = useState({
        city: null,
        birthDate: null,
        phone: "",
        address: "",
        email: ""
    })
    const [patientId, setPatientId] = useState(0);
    const [completedAnswers, setCompletedAnswers] = useState(true);
    const [displayUserVerification, setDisplayUserVerification] = useState(false);
    const [displayCouldNotValidateUser, setDisplayCouldNotValidateUser] = useState(false);
    const [loadMoreFields, setLoadMoreFields] = useState(user.firstname !== "");
    const [loading, setLoading] = useState(false);

    const { languageId}: any = useContext(langContext);
    const {inputErrors, validMobileForInputPhone, onChangeRemoveError, validateData}:any = useContext(appContext);

    const [displayUserExists,setDisplayUserExists]=useState(false);


    const navigate = useNavigate();
    const intl = useIntl();

    const toast: any = useRef(null);



    useEffect(() => {
        if (cities != undefined && !user.city) {

            setUser({ ...user, city: cities[238] });
        }

    }, [cities]);

    useEffect(() => {
        if (questions?.length > 2) {


            setDisplayUserVerification(true);
        }
    }, [questions]);



    const documentOptions = [
        { label: intl.formatMessage({ id: "ID" }), value: 1 },
        { label: intl.formatMessage({ id: "Foreign" }), value: 2 }
    ]

    const genderOptions = [
        { label: intl.formatMessage({ id: "Female" }), value: "F" },
        { label: intl.formatMessage({ id: "Male" }), value: "M" }
    ]

    function validateCompleteAnswers() {
        let numberAnswered = 0;

        for (const a in answers) {
            answers[a] && numberAnswered++
        }


        return numberAnswered > 2
    }

    function verifyIfPatientExists(document: any, docType: any) {
        setQuestions([]);
        user.document && existsPatientAndNotUser(document, docType).then(patientId => {
            if (patientId > 0) {
                setCompletedAnswers(true);
                getValidationData(languageId, patientId).then(res => {
                    setPatientId(patientId);
                    switch (res.status) {
                        case 200: {
                            

                            let validationData = res.data;
                            let _questions = [];

                            for (const q in validationData) {
                                let options: any = [];
                                validationData[q]?.forEach((op: any) => {
                                    switch (q) {
                                        case "city": options.push({ label: op.location, value: op }); break;
                                        case "birthDate": {
                                            let date = new Date(op);
                                            options.push({ label: date.toLocaleDateString(), value: date });
                                            break;
                                        }
                                        default: options.push({ label: op, value: op });
                                    }
                                })

                                _questions.push({ label: intl.formatMessage({ id: q[0].toUpperCase() + q.slice(1) }), field: q, options: options })
                            }

                            setQuestions(_questions);

                            break;
                        }
                        case 204: {
                            setDisplayCouldNotValidateUser(true)
                        }
                    }
                    setLoading(false);
                })
            } else if(patientId===-2){
                setLoadMoreFields(true);
                setUser({
                    ...user,
                    username: "",
                    password: "",
                    firstname: "",
                    lastname: "",
                    email: "",
                    gender: "",
                    birthdate: null,
                    mobilephone: {
                        prefix: "+54",
                        number: "",
                    },
                    address: "",
                    city: { location: 'Mar del Plata, Buenos Aires, Argentina', city: 1 },
                    affiliateNo: "",
                    hasMedicalCoverage: null,
                    isMedCoverageThroughJob: null,
                    medicalCoverage: null,
                    plan: null,
                    acceptTerms: false,
                    repeatPassword: ""
                })
                setLoading(false);
            }else{
                setDisplayUserExists(true)
                setLoading(false);
            }
        })

    }


    return (
        <div className='flexible--column'>
            <RadioButtonGroup options={documentOptions} setValue={(docType: any) => {
                setUser({ ...user, documentType: docType })
                onChangeRemoveError("documentType")
                setLoadMoreFields(false)
            }} label={intl.formatMessage({ id: "DocumentType" })} value={user.documentType} className="radioGroup" orientation={"row"} error={!inputErrors.documentType.isValid} caption={inputErrors.documentType.caption} />

            <InputTextCustom value={user.document} onChange={(e: any) => {
                setUser({ ...user, document: e.target.value })
                onChangeRemoveError("document")
                setLoadMoreFields(false)
            }} label={intl.formatMessage({id: "DocumentNumber"})} error={!inputErrors.document.isValid} caption={inputErrors.document.caption} />

            {loadMoreFields &&
                <div>
                    <InputTextCustom value={user.firstname} onChange={(e: any) => {
                        setUser({ ...user, firstname: e.target.value })
                        onChangeRemoveError("firstname")
                    }} label={intl.formatMessage({id: "Name"})} error={!inputErrors.firstname.isValid} caption={inputErrors.firstname.caption} />

                    <InputTextCustom value={user.lastname} onChange={(e: any) => {
                        setUser({ ...user, lastname: e.target.value })
                        onChangeRemoveError("lastname")
                    }} label={intl.formatMessage({id: "Lastname"})} error={!inputErrors.lastname.isValid} caption={inputErrors.lastname.caption} />

                    <RadioButtonGroup options={genderOptions} setValue={(gender: any) => {
                        setUser({ ...user, gender: gender })
                        onChangeRemoveError("gender")
                    }} label={intl.formatMessage({ id: "Gender" })} value={user.gender} className="radioGroup" orientation={"row"} error={!inputErrors.gender.isValid} caption={inputErrors.gender.caption} />

                    <InputDate value={user.birthdate} label={intl.formatMessage({ id: "BirthDate" })} onChange={(e: any) => {
                        setUser({ ...user, birthdate: e.value })
                        onChangeRemoveError("birthdate")
                    }} showIcon dateFormat="dd/mm/yy" maxDate={new Date()} placeholder='dd/mm/aaaa' caption={inputErrors.birthdate.caption} error={!inputErrors.birthdate.isValid} />

                    <InputPhone label={intl.formatMessage({id: "Phone"})} value={user.mobilephone} setValue={(val: any, valField: any) => {
                        let _user = { ...user }
                        _user.mobilephone[valField] = val;
                        setUser(_user);
                        onChangeRemoveError("mobilephone")
                    }} error={!inputErrors.mobilephone.isValid} caption={inputErrors.mobilephone.caption} />


                    <InputTextCustom value={user.address} onChange={(e: any) => {
                        setUser({ ...user, address: e.target.value })
                        onChangeRemoveError("address");
                    }} label={intl.formatMessage({id: "Address"})} error={!inputErrors.address.isValid} caption={inputErrors.address.caption} />

                    <Combobox getItems={getCities} label={intl.formatMessage({ id: "City" })} optionLabel="location" value={user.city} placeholder={user.city?.description} setValue={(c: any) => {
                        setUser({ ...user, city: c });
                    }} />
                </div>
            }



            <div className='flexible--row flex-end buttonContainer'>
                <Button label={intl.formatMessage({ id: "Cancel" })} className='buttonMain3' onClick={() => { setDisplayRegisterCancel(true) }} />
                {loadMoreFields ? <Button icon="pi pi-angle-right" iconPos='right' label={intl.formatMessage({ id: "Follow" })} onClick={() => {
                    if (validateData(inputFields, user)) {
                        navigate("/register/2")
                    }
                }} className='buttonMain' /> : <Button  label={intl.formatMessage({ id: "Confirm" })} onClick={() => {

                    if (validateData(["document", "documentType"], user)) {
                        setLoading(true)
                        verifyIfPatientExists(user.document, user.documentType);
                    }
                }} className='buttonMain' >{loading && <Loader size={25} strokeWidth={6} className={"whiteSpinner"} margin={"0% 5%"} />}  </Button>}
            </div>

            <Modal visible={displayUserVerification} setVisible={setDisplayUserVerification} header={"Ya existen tus datos en el sistema..."} footerButtonRightText={intl.formatMessage({ id: 'Verify' })} footerButtonLeftText={intl.formatMessage({ id: 'Back' })} onClickLeftBtn={() => {
                setDisplayUserVerification(false);
                setUser({ ...user, document: "" })
            }} onClickRightBtn={() => {
                if (validateCompleteAnswers()) {
                    sendValidationDataAnswers(answers, patientId).then((patient) => {
                        const { firstname, address, lastname, email, document, documentType, gender, healthpatientcoverage, mobilePhone, birthdate, city } = patient
                        let _user:any;
                        if(healthpatientcoverage){
                            const { hasMedicalCoverage, healthentity, healthentityplan } = healthpatientcoverage;
                            _user={
                                hasMedicalCoverage: hasMedicalCoverage,
                                medicalCoverage: healthentity,
                                plan: healthentityplan,
                            }
                        }

                        if (patient) {
                            _user = {
                                ..._user,
                                ...user,
                                firstname: firstname,
                                lastname: lastname,
                                address: address,
                                birthdate: new Date(birthdate),
                                email: email,
                                mobilephone: validMobileForInputPhone(mobilePhone),
                                document: document,
                                documentType: documentType.documentType,
                                gender: gender,
                                city: city
                            }
                            
                            
                            toast.current?.show({ severity: 'success', summary: intl.formatMessage({id:"Success"}), detail: "Los datos coincidieron" });
                            setUser(_user);
                            setDisplayUserVerification(false)
                            setLoadMoreFields(true)
                        } else {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: intl.formatMessage({ id: "IncorrectAnswers" }) });
                        }

                    })

                } else {
                    setCompletedAnswers(false);
                }

            }} >
                <UserVerificationForm questions={questions} answers={answers} setAnswers={setAnswers} error={!completedAnswers} />
            </Modal>
            <Modal visible={displayCouldNotValidateUser} setVisible={setDisplayCouldNotValidateUser} header={intl.formatMessage({ id: "Attention" })} footerButtonLeftText={intl.formatMessage({ id: "Back" })} onClickLeftBtn={() => {
                setDisplayCouldNotValidateUser(false);
            }} footerButtonRightText={intl.formatMessage({ id: "CustomersService" })} >
                <p className='textDark'>{intl.formatMessage({ id: "CouldNotValidateLabel" })}.</p>
            </Modal>
                <Modal visible={displayUserExists} setVisible={setDisplayUserExists} header={intl.formatMessage({id:"Attention"})} footerButtonRightText={intl.formatMessage({id: "Back"})} 
                onClickRightBtn={()=>{
                    setDisplayUserExists(false)
                 }} >
                    <p className='textDark'>{intl.formatMessage({id: "ThereIsAlreadyAnUserWithTheSameDocument"}) + ". " + intl.formatMessage({id: "IfYouForgotYourPassword"})
                    +" "}
                    <Link to={"/forgotPassword"} className="link">{intl.formatMessage({ id: 'ClickHere' })}</Link>
                    </p>
                </Modal>
            <Toast ref={toast} />
        </div>
    );
}