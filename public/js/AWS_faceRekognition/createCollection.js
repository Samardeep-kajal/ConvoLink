const { RekognitionClient, CreateCollectionCommand } = require("@aws-sdk/client-rekognition");
require('dotenv').config()

// Set up AWS credentials
const credentials = {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region
};
// Create an instance of the Rekognition client
const rekognitionClient = new RekognitionClient({ region: credentials.region, credentials });

// Function to create a face collection
async function createFaceCollection(faceCollectionId) {
    const params = {
        CollectionId: faceCollectionId
    };
    try {
        const command = new CreateCollectionCommand(params);
        const result = await rekognitionClient.send(command);
        console.log('Face collection created:', result);
        return result;
    } catch (error) {
        console.error('Error creating face collection:', error);
        throw error;
    }
}

module.exports = createFaceCollection