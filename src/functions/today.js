const today = () =>{
    const dt = new Date();
    const DD = ("0" + dt.getDate()).slice(-2);
    var MM = ("0" + (dt.getMonth() + 1)).slice(-2);
    const YYYY = dt.getFullYear();

    const date_string = DD + "/" + MM + "/" + YYYY;
    return date_string;  
    }
export default today;