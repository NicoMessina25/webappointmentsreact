import { InputText } from 'primereact/inputtext'
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import InputTextCustom from '../../Inputs/InputText/InputTextCustom'
import RadioButtonGroup from '../../RadioButtonGroup/RadioButtonGroup'
import './ProfileForm.scss';
import { useIntl } from 'react-intl';
import InputDate from '../../Inputs/InputDate/InputDate';
import InputPhone from '../../Inputs/InputPhone/InputPhone';
import Combobox from '../../Combobox/Combobox';
import { Button } from 'primereact/button';
import { appContext } from '../../Context/appContext';
import { getMedicalCoverages, getPlans } from '../../../services/medicalCoverageService';
import { getCities } from '../../../services/citiesService';
import { savePatientInfo } from '../../../services/UserService';
import ErrorModal from '../../Modal/ErrorModal/ErrorModal';
import { useLocation } from 'react-router-dom';
import {PhoneNumberFormat, PhoneNumberUtil}  from  'google-libphonenumber';

const ProfileForm=forwardRef( (props:any,ref) => {

  const {user}:any = useContext(appContext);
  const {setUser}:any = useContext(appContext);
  const {getDefaultPatient}:any = useContext(appContext);
  const {returnValidPatientDTO}:any = useContext(appContext);

  let settings=localStorage.getItem("settings");
  
  const intl = useIntl();
  const [name,setName]=useState("");
  const genderOptions = [
      { label: intl.formatMessage({ id: "Female" }), value: "F" },
      { label: intl.formatMessage({ id: "Male" }), value: "M" }
  ]

  const documentOptions = [
    { label: intl.formatMessage({ id: "ID" }), value: 1 },
    { label: intl.formatMessage({ id: "Foreign" }), value: 2 }
  ]


let yes = intl.formatMessage({id: "Yes"});
let no = intl.formatMessage({id: "No"});

const yesNo = [
  {label: yes, value: true},
  {label: no, value: false}
]

const sendOptions = [
  { value: "Email", label: "Email" },
  { value: "SMS", label: "SMS" }
];

const [sendOption,setSendOption]=useState("");



function onChangeRemoveError(field:any){
  let _inputErrors:any = {...inputErrors}
  _inputErrors[field].isValid = true
  _inputErrors[field].caption = ""
  setInputErrors(_inputErrors)
}

const [inputErrors, setInputErrors] = useState({
  hasMedicalCoverage: {caption: "", isValid: true},
  isMedCoverageThroughJob: {caption: "", isValid:true},
  medicalCoverage: {caption: "", isValid: true},
  plan: {caption: "", isValid: true},
  memberNumber: {caption: "", isValid: true},
})

const [inputErrors2, setInputErrors2] = useState({
  firstname: { caption: "", isValid: true },
  lastname: { caption: "", isValid: true },
  birthdate: { caption: "", isValid: true },
  document: { caption: "", isValid: true },
  documentType: { caption: "", isValid: true },
  gender: { caption: "", isValid: true },
  mobilephone: { caption: "", isValid: true },
  address: { caption: "", isValid: true }
})

const [loadMoreFields, setLoadMoreFields] = useState(user.firstname !== "");

const [patient,setPatient]=useState(user);

const [errorModalVisibility,setErrorModalVisibility]=useState(false)

const [mobilePhone,setMobilePhone]=useState("")
const [mobilePhoneCopy,setMobilePhoneCopy]=useState("")

useImperativeHandle(ref,()=>({
  cancelEdit(){
    setPatient(user);
    setMobilePhoneCopy(mobilePhone)
  }
  ,
  saveChanges(){
    console.log(mobilePhoneCopy)
    savePatientInfo(patient,returnValidPatientDTO,mobilePhoneCopy).then(res=>{
      if(res.status===200 && res.data===true){
        setUser(patient);
      }
      else{
        setErrorModalVisibility(true);
      }
      })
  }
}))

function isValidPhone(){

  if (user.mobilephone.prefix=="" && user.mobilephone.area=="" && user.mobilephone.number.length>0){
    return false;
  }
  else return true;
}

useEffect(() => {
  setPatient(user)
  if(!isValidPhone())
    setMobilePhoneCopy(user.mobilephone.prefix+user.mobilephone.area+user.mobilephone.number)
},[user])

  return (
    <div className='flexible--column profile-form-container'>
        <div className='personal-data'>
            <div className='title textBold'>
            {intl.formatMessage({id:"PersonalData"})}
            </div>
        </div >

        <div className="flexible--row space-between">  
          <InputTextCustom className='width-50' disable={!props.isEditButtonClicked} value={patient.firstname} label={intl.formatMessage({ id: "Name" })} onChange={(e:any)=>{setPatient({ ...patient, firstname: e.target.value })}} placeholder=""/>
            
          <InputTextCustom className='width-50' value={patient.lastname} label={intl.formatMessage({ id: "Lastname" })} onChange={(e:any)=>{setPatient({ ...patient, lastname: e.target.value })}} placeholder="" disable={!props.isEditButtonClicked}/>
        </div>

        <div className="flexible--row space-between">
          <RadioButtonGroup options={genderOptions} setValue={(gender: any) => {
                          setPatient({...patient, gender: gender})
                      }} label={intl.formatMessage({ id: "Gender" })} value={patient.gender} className="radioGroup width-50" orientation={"row"} 
                      disable={!props.isEditButtonClicked}/>
        
          
        <InputDate value={patient.birthdate} className='width-50' label={intl.formatMessage({id:"BirthDate"})} onChange={(e:any)=>{setPatient({...patient,birthdate:e.value})}}  disable={!props.isEditButtonClicked} showIcon dateFormat="dd/mm/yy" maxDate={new Date()} placeholder='dd/mm/aaaa'/>

        </div>

        <div className="flexible--row space-between">
          <RadioButtonGroup options={documentOptions} setValue={(docType: any) => {
                              setPatient({ ...patient, documentType: docType })
                          }} label={intl.formatMessage({ id: "DocumentType" })} value={patient.documentType} className="radioGroup width-50" orientation={"row"} error={!inputErrors2.documentType.isValid} caption={inputErrors2.documentType.caption} disable={!props.isEditButtonClicked}/>
            <InputTextCustom  className='width-50' value={patient.document} disable={!props.isEditButtonClicked} label="Document" onChange={(e:any)=>{}} placeholder=""/>
        </div>
           
        <div className="flexible--row space-between">
          <InputTextCustom className='width-50' value={patient.address} disable={!props.isEditButtonClicked} label="Address" onChange={(e:any)=>{setPatient({...patient,address:e.target.value})}} placeholder=""/>
          
          <Combobox className='width-50' getItems={getCities} label={intl.formatMessage({ id: "City" })} optionLabel="location" value={patient.city} placeholder={patient.city?.  description} setValue={(c: any) => {
                        setPatient({ ...patient, city: c });
                    }} disable={!props.isEditButtonClicked}/>
        </div>

        <div className="flexible--row space-between">
          {isValidPhone() ? <InputPhone className='width-50' label={intl.formatMessage({ id: "Phone" })} value={patient.mobilephone} setValue={(val: any, valField: any) => {
                          let _patient = { ...patient }
                          _patient.mobilephone[valField] = val;
                          setPatient(_patient);
                      }} 
                      disable={!props.isEditButtonClicked}/> :
                      <InputTextCustom className="width-50" label={intl.formatMessage({ id: "Phone" })} value={mobilePhoneCopy} 
                      onChange={(e:any)=>{
                        setMobilePhoneCopy(e.target.value)
                      }} disable={!props.isEditButtonClicked}></InputTextCustom>
                    }
            
          <InputTextCustom className='width-50' value={patient.email} label={intl.formatMessage({ id: "Email" })} onChange={(e:any)=>{setPatient({...patient,email:e.target.value})}} placeholder="" disable={!props.isEditButtonClicked}/>
        </div>
        
        <div className='flexible--column'>
            <div className='title textBold'>
                {intl.formatMessage({id:"MedicalCoverage"})}
            </div>

            <div className='flexible--row'>
              
              <div className="width-20">
              <RadioButtonGroup id={1} className='radioGroup ' options={yesNo} value={patient.hasMedicalCoverage} setValue={(value:any)=>{
                setPatient({...patient, hasMedicalCoverage: value})
                //onChangeRemoveError("hasMedicalCoverage")
                }} label={intl.formatMessage({id: "DoYouHaveMedicalCoverage?"})} orientation="row" error={!inputErrors.hasMedicalCoverage.isValid} caption={inputErrors.hasMedicalCoverage.caption} disable={!props.isEditButtonClicked}/>
              </div>
              <div className="width-20">
              <RadioButtonGroup id={2} className='radioGroup' options={yesNo} value={patient.isMedCoverageThroughJob} setValue={(value:any)=>{
                  setPatient({...patient, isMedCoverageThroughJob: value})
                  //onChangeRemoveError("isMedCoverageThroughJob")
              }} label={intl.formatMessage({id: "IsThroughYourJob?"})} orientation="row" error={!inputErrors.isMedCoverageThroughJob.isValid} caption={inputErrors.isMedCoverageThroughJob.caption} disable={!props.isEditButtonClicked}/>
            </div>
            </div>
            <div className='flexible--row number-container space-between'>

            <Combobox label={intl.formatMessage({id: "PrepaidHealthInsurance"})} placeholder={patient.medicalCoverage?.name || intl.formatMessage({id: "Select"})} className="combobox" getItems={getMedicalCoverages} value={patient.medicalCoverage} setValue={(p:any)=>{
                    setPatient({...patient, medicalCoverage: p});
                    //onChangeRemoveError("medicalCoverage")
                    
                }} optionLabel="name" error={!inputErrors.medicalCoverage.isValid} caption={inputErrors.medicalCoverage.caption}disable={!props.isEditButtonClicked} />

              <Combobox label={intl.formatMessage({id:"Plan"})} className="combobox" placeholder={intl.formatMessage({id: "Select"})} getItems={(inputText:any, offSet:any, pageSize:any)=>{
                                  return getPlans(inputText, offSet, pageSize, patient.medicalCoverage?.entityid)
                              }} value={patient.plan} setValue={(p:any)=>{
                                  setPatient({...patient, plan: p})
                                  //onChangeRemoveError("plan");
                              }} optionLabel="name" reLoadItemsValue={patient.medicalCoverage} error={!inputErrors.plan.isValid} caption={inputErrors.plan.caption} disable={!props.isEditButtonClicked}/>
            
            <InputTextCustom label={intl.formatMessage({ id: "NumberOfMember" })}  value={patient.memberNumber} onChange={(e:any)=>{
                    setPatient({...patient, memberNumber: e.target.value})
                    //onChangeRemoveError("memberNumber");
                }} error={!inputErrors.memberNumber.isValid} caption={inputErrors.memberNumber.caption} disable={!props.isEditButtonClicked}/>
            
            </div>
            
          </div>

          <div className='flexible--column'>
            <div className='title textBold'>
                {intl.formatMessage({id:"Security"})}
            </div>
            <div className='flexible--row'>
              {intl.formatMessage({id:"SecurityMessage"})}
            </div>
            
            <div className='flexible--row width-100'>
              
              {/* <div className='flexible--row width-50-centered'> */}
              <RadioButtonGroup className='width-25' id={3} options={sendOptions} value={sendOption} setValue={(value:any)=>{
                setSendOption(value)
              }} orientation="row" />
              {/* </div> */}
         
            <Button icon="pi pi-check" label="Cambiar contraseña" className='buttonMain3'></Button>

            </div>
          </div>

          <ErrorModal visible={errorModalVisibility} setVisible={setErrorModalVisibility}></ErrorModal>
    </div>
  )
}
)

export default ProfileForm;