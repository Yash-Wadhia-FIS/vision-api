const express = require('express');
const cors = require('cors');
const formidable = require('formidable');

const app = express();
app.use(cors());

app.post('/vision', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        console.log('fields', fields, err);
        const uris = fields.uris;
        const token = fields.token;
        const url = 'https://visionai.googleapis.com/v1alpha1/projects/ai-lab-280706/locations/us-central1/retailEndpoints/ENDP001:batchAnalyze';
        const data = JSON.stringify({
            "gcsSource": {
                "uris": [
                    uris
                ]
            },
            "features": [
                {
                    "type": "TYPE_PRODUCT_RECOGNITION",
                    "productRecognitionConfig": {
                        "product_detection_model": "builtin/stable"
                    }
                }
            ],
            "outputGcsDestination": {
                "outputUriPrefix": "gs://shelfchecking-integration-test-data/inference-output"
            }
        });
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: data,
            method: 'POST'
        };
        fetch(url, config)
        .then(response => response.json())
        .then(result => {
            console.log('result', result);
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log('error', err);
            res.send(err);
        });
    })
});

app.listen('3000', () => {
    console.log('listening to the port: ', 3000);
})

exports.app = app;