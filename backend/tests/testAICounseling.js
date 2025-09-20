import AICounselingService from '../services/AICounselingService.js';

const testGoogleAI = async () => {
  console.log('Testing Google AI integration...');
  
  try {
    const testMessage = "Hello, can you help me with my career?";
    const response = await AICounselingService.generateCounselingResponse(testMessage);
    
    console.log('✅ Google AI Test Successful!');
    console.log('Response:', response.response);
    console.log('Success:', response.success);
    
    return response;
  } catch (error) {
    console.error('❌ Google AI Test Failed:', error.message);
    throw error;
  }
};

// Run the test
testGoogleAI()
  .then((result) => {
    console.log('\n🎉 AI Counseling integration test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 AI Counseling integration test failed!');
    process.exit(1);
  });