// Test file để kiểm tra API call
import { getUsers } from './src/services/userService.js';

async function testGetUsers() {
  try {
    console.log('Testing getUsers API...');
    
    const params = {
      status: 'active',
      page: 1,
      limit: 10,
      search: 'Bùi',
      sort: '-createdAt',
      role: 'candidate'
    };
    
    const response = await getUsers(params);
    console.log('API Response:', response);
    
    if (response.success) {
      console.log('✅ API call successful');
      console.log('Users found:', response.data.data.length);
      console.log('Total items:', response.data.meta.totalItems);
    } else {
      console.log('❌ API call failed:', response.message);
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('Error details:', error.response?.data || error.message);
  }
}

// Chạy test
testGetUsers();
