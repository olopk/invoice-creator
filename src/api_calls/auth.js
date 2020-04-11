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
                logIn(email: $email, password: $password){userData!}
            }
        `,
        variables: {
            email: email,
            password: password
        }
    }
    return axios.post('/graphql', JSON.stringify(graphQl))
        .then(res => {
            const response = res.data.data.In;
            return{status: 'success', message: response.message}
        })
        .catch(err => {
            const error = err.response.data.errors[0];
            return {status: 'error', message: error.message}
        })
       
}

export const logOut = (login, password) => {
    
}