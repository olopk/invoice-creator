const validateNip = (nip) => {
    if(!nip){
      return{
        validateStatus: 'error',
        errorMsg: 'NIP nie może być pusty'
      }
    }
    if(nip != parseInt(nip) || nip.length > 10){
      return{
        validateStatus: 'error',
        errorMsg: 'Podany NIP jest nieprawidłowy'
      }
    }
    if(nip.length == 10){
      const count = (nip[0]*6+nip[1]*5+nip[2]*7+nip[3]*2+nip[4]*3+nip[5]*4+nip[6]*5+nip[7]*6+nip[8]*7)%11;
      if(count != nip[9]){
        return{
          validateStatus: 'error',
          errorMsg: 'Podany NIP jest nieprawidłowy'
        }
      }
    }
    return{
      validateStatus: 'success',
      errorMsg: null
    }
  }

  export default validateNip;