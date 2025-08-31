import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUsers } from '@/services/userService';
import { toast } from 'sonner';

export function ApiTester() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    status: '',
    sort: '-createdAt'
  });

  const testApi = async () => {
    try {
      setLoading(true);
      
      // Filter out empty values
      const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      const response = await getUsers(cleanParams);
      setResult(response);
      toast.success('API call successful!');
    } catch (error) {
      console.error('API Error:', error);
      toast.error('API call failed: ' + (error.response?.data?.message || error.message));
      setResult({ error: error.message, details: error.response?.data });
    } finally {
      setLoading(false);
    }
  };

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>API Tester - Get Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Page</label>
              <Input
                type="number"
                value={params.page}
                onChange={(e) => updateParam('page', parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Limit</label>
              <Input
                type="number"
                value={params.limit}
                onChange={(e) => updateParam('limit', parseInt(e.target.value) || 10)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Search</label>
              <Input
                value={params.search}
                onChange={(e) => updateParam('search', e.target.value)}
                placeholder="Enter search term"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Input
                value={params.role}
                onChange={(e) => updateParam('role', e.target.value)}
                placeholder="candidate, recruiter"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Input
                value={params.status}
                onChange={(e) => updateParam('status', e.target.value)}
                placeholder="active, banned"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sort</label>
              <Input
                value={params.sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                placeholder="-createdAt, createdAt, fullname"
              />
            </div>
          </div>
          
          <Button onClick={testApi} disabled={loading} className="w-full">
            {loading ? 'Testing...' : 'Test API'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
