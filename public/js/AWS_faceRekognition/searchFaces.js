const { RekognitionClient, SearchFacesByImageCommand, DetectFacesCommand } = require("@aws-sdk/client-rekognition");
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');
require('dotenv').config()

const credentials = {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region
};

// const imagePath = 'awsFace/m3.jpg'
// const collectionId = 'testCollection1.2';

const rekognitionClient = new RekognitionClient({ credentials });

const searchFace = async(imageUrl, collectionId) => {
    // const imageBuffer = fs.readFileSync(imagePath)

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    const detectFaces = async(imageBuffer) => {
        const detectFacesCommand = new DetectFacesCommand({ Image: { Bytes: imageBuffer } });
        return rekognitionClient.send(detectFacesCommand);
    };

    // Function to search faces by image
    const searchFacesByImage = async(imageBuffer) => {
        const searchFacesByImageCommand = new SearchFacesByImageCommand({
            CollectionId: collectionId,
            Image: { Bytes: imageBuffer },
        });
        return rekognitionClient.send(searchFacesByImageCommand);
    };

    // Main function to process the group photo
    const processGroupPhoto = async() => {
        try {
            // Detect faces in the group photo
            const detectFacesResponse = await detectFaces(imageBuffer);
            const presentMem = []

            // Check if faces were detected
            if (detectFacesResponse.FaceDetails && detectFacesResponse.FaceDetails.length > 0) {
                console.log('Faces detected in the group photo:');

                // Iterate through each detected face
                for (const faceDetail of detectFacesResponse.FaceDetails) {
                    const { BoundingBox } = faceDetail;

                    // Crop the face from the original image using the bounding box
                    const croppedImageBuffer = await cropFace(imageBuffer, BoundingBox);

                    // Search for the cropped face in the collection
                    const searchResponse = await searchFacesByImage(croppedImageBuffer);

                    // Check if a match was found
                    if (searchResponse.FaceMatches && searchResponse.FaceMatches.length > 0) {
                        presentMem.push(searchResponse.FaceMatches[0].Face.ExternalImageId)
                        console.log(`Person found with face ID: ${searchResponse.FaceMatches[0].Face.FaceId}`, searchResponse.FaceMatches[0].Face.ExternalImageId);
                    } else {
                        console.log('No matching person found for this face.');
                    }

                }
                return presentMem
            } else {
                console.log('No faces detected in the group photo.');
                return ["no faces detected"]
            }
        } catch (error) {
            console.error('Error:', error);
            return [error]
        }
    };

    // Function to crop a face from the image using bounding box
    const cropFace = async(imageBuffer, boundingBox) => {
        const imageWidth = getWidth(imageBuffer);
        const imageHeight = getHeight(imageBuffer);

        // Convert bounding box values to pixel coordinates
        const left = Math.floor(boundingBox.Left * imageWidth);
        const top = Math.floor(boundingBox.Top * imageHeight);
        const width = Math.floor(boundingBox.Width * imageWidth);
        const height = Math.floor(boundingBox.Height * imageHeight);

        // Crop the face from the image
        const croppedImageBuffer = cropImage(imageBuffer, left, top, width, height);

        return croppedImageBuffer;
    };

    // Helper function to get the width of an image buffer
    const getWidth = (buffer) => {
        return require('image-size')(buffer).width; // 'image-size' library is used here
    };

    // Helper function to get the height of an image buffer
    const getHeight = (buffer) => {
        return require('image-size')(buffer).height; // 'image-size' library is used here
    };

    // Helper function to crop an image buffer
    const cropImage = (buffer, left, top, width, height) => {
        return sharp(buffer)
            .extract({ left, top, width, height })
            .toBuffer();
    };

    // Run the main function
    return processGroupPhoto();
}

module.exports = searchFace