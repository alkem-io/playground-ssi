export const ErrorHandling = async (error: Error) => {
    if (error){
        var msg = error.toString();
        msg = msg.slice(0, msg.indexOf('{'))
        msg = msg.replace('Error: execution reverted:', 'Error: ');
        alert(msg);
    }
};