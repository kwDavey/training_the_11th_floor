import axios from 'axios';

const compile = (template, data) => {
    return new Promise((resolve, reject) => {
        try {
            const rendered = template(data);
            resolve(rendered);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = async (req, res) => {
    try {
        try {
            await axios({
                method: 'POST',
                url: `https://www.winsms.co.za/api/batchmessage.asp?user=chave@ium.co.za&password=C4w38XRqWYxkqP&message=` + req.body.details
            });
        } catch (error) {
            console.log(error);
        }
        res.send();
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};
