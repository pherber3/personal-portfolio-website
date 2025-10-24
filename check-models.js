const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyBmdiXbM30j_rrVv8WaQPOYg3nwujf8qwY';
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('Fetching available models...\n');

    // List all models
    const models = await genAI.listModels();

    console.log('Available models that support generateContent:');
    console.log('='.repeat(50));

    for await (const model of models) {
      if (model.supportedGenerationMethods.includes('generateContent')) {
        console.log(`\nModel: ${model.name}`);
        console.log(`Display Name: ${model.displayName}`);
        console.log(`Description: ${model.description}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
