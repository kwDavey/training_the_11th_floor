import SendGrid from '@sendgrid/mail';
import handlebars from 'handlebars';
import axios from 'axios';
SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

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
        let templateUrl = req.body.EmailURL;

        const { data: template } = await axios.get(templateUrl);
        const rendered = await template;
        await SendGrid.sendMultiple({
            from: { name: 'The 11th Floor', email: 'noreply@the11thfloor.co.za' },
            personalizations: req.body.details,
            subject: `Staff assessment - The 11th Floor`,
            html: rendered
        });
        res.send();
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

/* 
try {
    let templateUrl = req.body.EmailURL;

    const { data: template } = await axios.get(templateUrl);
    const rendered = await compile(handlebars.compile(template), req.body);
    await SendGrid.sendMultiple({
        from: { name: 'The 11th Floor', email: 'noreply@the11thfloor.co.za' },
        personalizations: [
            {
                to: req.body.email,
                substitutions:{
                    Name:['1','2'],
                    AssessmentLink:["11",'22']
                }
            }
        ],
        subject: `Staff assessment - The 11th Floor`,
        html: rendered
    });
    res.send();
} catch (error) {
    console.log(error);
    res.json(error);
} */
