const { RekognitionClient, IndexFacesCommand } = require("@aws-sdk/client-rekognition");
const axios = require('axios');
require('dotenv').config()

const credentials = {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region
};
// Create an instance of the Rekognition client
const rekognitionClient = new RekognitionClient({ region: credentials.region, credentials });

const registerFace = async(collectionId, externalImageId, imageUrl) => {
    const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer' // Ensure response is treated as binary data
    });
    const imageBuffer = Buffer.from(imageResponse.data);

    const params = {
        CollectionId: collectionId,
        Image: {
            Bytes: imageBuffer,
        },
        ExternalImageId: externalImageId,
    };
    const command = new IndexFacesCommand(params);
    try {
        const response = await rekognitionClient.send(command);;
        console.log('Face registered:', response);
    } catch (error) {
        console.error('Error registering face:', error);
    }
};

module.exports = registerFace