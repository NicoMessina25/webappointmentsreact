import axios from "axios";
import { idText } from "typescript";
const url=process.env.REACT_APP_MEDERE_ADDRESS+'/rest/webappointments/'



export function getMailAndCellphone(document:any,documenttype:any){
    
    return axios.get(process.env.REACT_APP_MEDERE_ADDRESS+'/rest/webappointments/getMailAndCellphone', {
        params: {
          document: document,
          documenttype:documenttype
        }
      })
      .then(res => 
        res.data
      )
      .catch(er => 
        er
      );
}

export function saveUser(user:any) {
  let newUser= {...user}
  newUser.mobilephone = user.mobilephone.prefix + user.mobilephone.area + user.mobilephone.number
  //newUser.birthdate = Date.parse(user.birthdate);
  newUser.city = user.city.city;
  newUser.medicalCoverage = user.medicalCoverage?.entityid;
  newUser.plan = user.plan?.healthentityplan
  

  return axios.post(process.env.REACT_APP_MEDERE_ADDRESS+'/rest/webappointments/saveUserAndPatient',
    newUser).then((res)=>{
    return res.data;
    
  }).catch((err)=>{console.log(err);
  })
}

export function postNewPassword(id:number,password : string,repeatPassword : string,token:string,code:string){
  return axios.post(url+ 'resetpassword', {
    id: id,
    password: password,
    repeatPassword: repeatPassword,
    token:token,
    verificationCode:code
  },{
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => 
    response
  )
  .catch(error => 
      error
  );
}

export function sendCodeByMail(id:number){
  return axios.post(
    url+'sendRecoveryCodeEmail',{
      id:id
    },{
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => 
      response
    )
    .catch(error => 
        error
    )
};

export function validateRecoveryCode(id:number,code:string){
  return axios.post(
    url+'validateRecoveryCode',{
      id:id,
      code:code
    },{
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => 
      response.data
    )
    .catch(error => 
        error
    )
}

export async function validateMedereUser(username:string,password:string){

    return axios.post(
      url+'validatemedereuser',{
        username:username,
        password:password
      },{
        headers: {
          'Content-Type': 'application/json',
        }})
      .then(response => 
        response
      )
  
  
}


export function sendLocationConsent(userId:number){

  

  const onLocationAllowed = ({coords, timestamp}:any) => {
    
    axios.post(process.env.REACT_APP_MEDERE_ADDRESS+'/rest/webappointments/saveDigitalConsent',
    {
      userId: userId,
      latitude: coords.latitude,
      longitude: coords.longitude
    }).then((res)=>{
    console.log(res.data);
    
  }).catch((err)=>{console.log(err);
  })
  }

  const onLocationNotAllowed = () => {
    
    
    
    axios.post(process.env.REACT_APP_MEDERE_ADDRESS+'/rest/webappointments/saveDigitalConsent',
    {
      userId: userId,
      latitude: null,
      longitude: null
    }).then((res)=>{
    console.log(res.data);
    
  }).catch((err)=>{console.log(err);
  })
  }


  //console.log(userId +  " ea");
  navigator.geolocation?.getCurrentPosition(onLocationAllowed, onLocationNotAllowed);
  
  
}

