import axios from '../axiosInstance';
// AUTHROIZATION

export const signIn = (userdata) => {
    const graphQl = {
        query: `
            mutation SignInNewUser($userdata: SignInInputData!){
                signIn(signInInput: $userdata){message}
            }
        `,
        variables: {
            userdata: userdata
        }
    }
    return axios.post('/graphql', JSON.stringify(graphQl))
        .then(res => {
            const response = res.data.data.signIn;
            return{status: 'success', message: response.message}
        })
        .catch(err => {
            const error = err.response.data.errors[0];
            return {status: 'error', message: error.message}
        })
}

export const logIn = (email, password) => {
    const graphQl = {
        query: `
            query LogInUser($email: String!, $password: String!){
                logIn(email: $email, password: $password){token tokenExpiry}
            }
        `,
        variables: {
            email: email,
            password: password
        }
    }
    return axios.post('/graphql', JSON.stringify(graphQl))
        .then(res => {
            const response = res.data.data.logIn;

            localStorage.setItem("token", response.token)

            const date = new Date();
            const tokenExpiration = date.getTime() + (response.tokenExpiry*60*1000) 
            localStorage.setItem("tokenExpiration", tokenExpiration)

            return response.token
        })
        .then(token => {
            return getUser(token)
        })
        .catch(err => {
            const error = err.response.data.errors[0];
            return {status: 'error', message: error.message}
        })
       
}
export const getUser = (token) => {
    const graphQl = {
        query: `{getUser{_id name}}`
    }

    return axios({
        url: '/graphql',
        method: 'POST',
        data: JSON.stringify(graphQl),
        headers:{
            'Authorization': 'Bearer '+token,
        }
    })
        .then(res => {
            const response = res.data.data.getUser;
            return{status: 'success', message: `Witaj, ${response.name}`, userData: response}
        })
        .catch(err => {
            if(err.response.data.message){
                return {status: 'error', message: err.response.data.message}
            }
            const error = err.response.data.errors[0];
            return {status: 'error', message: error.message}
        })
}