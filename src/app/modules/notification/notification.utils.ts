import admin from 'firebase-admin';

const sendPushNotification = async (
    token: string,
    title: string,
    body: string,
) => {
    try {
        await admin.messaging().send({
            token: token,
            notification: {
                title,
                body,
            },
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};
export { sendPushNotification };
