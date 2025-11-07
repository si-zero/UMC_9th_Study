export const requestToUserPhone = (body) => {
    if (!body.phoneNumber) {
        return null; 
    }
    
    return {
        phone_number: body.phoneNumber,
        status: 'ACTIVE'
    };
};