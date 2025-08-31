import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  User, 
  Mail, 
  Calendar,
  MoreHorizontal,
  UserCheck,
  UserX,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock data for demo
const mockUsers = [
  {
    _id: '1',
    fullname: 'Bùi Minh Khôi',
    email: 'c10@gmail.com',
    role: 'candidate',
    active: true,
    createdAt: '2023-03-19T19:00:00Z',
  },
  {
    _id: '2',
    fullname: 'Nguyễn Văn An',
    email: 'admin@example.com',
    role: 'recruiter',
    active: true,
    createdAt: '2023-02-15T10:30:00Z',
  },
  {
    _id: '3',
    fullname: 'Trần Thị Lan',
    email: 'recruiter@company.com',
    role: 'recruiter',
    active: false,
    createdAt: '2023-01-20T14:15:00Z',
  }
];

export function UserManagementDemo() {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [users] = useState(mockUsers);

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case 'recruiter':
        return <Badge className="bg-blue-100 text-blue-800">Recruiter</Badge>;
      case 'candidate':
        return <Badge variant="outline">Candidate</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (active) => {
    return active ? 
      <Badge className="bg-green-100 text-green-800">Active</Badge> :
      <Badge variant="destructive">Banned</Badge>;
  };

  // Filter users based on current filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.active) ||
      (statusFilter === 'banned' && !user.active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management Demo</h1>
        <p className="text-gray-600">Interactive demo of the user management interface</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>
            Demo version with search button functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-10 pr-20"
              />
              <div className="absolute right-2 top-2 flex gap-1">
                {searchInput && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClearSearch}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleSearch}
                  className="h-6 px-2 text-xs"
                >
                  Search
                </Button>
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-createdAt">Newest First</SelectItem>
                <SelectItem value="createdAt">Oldest First</SelectItem>
                <SelectItem value="fullname">Name A-Z</SelectItem>
                <SelectItem value="-fullname">Name Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active filters indicator */}
          {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700 font-medium">Active filters:</span>
              {searchTerm && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  <span>Search: "{searchTerm}"</span>
                  <button
                    onClick={handleClearSearch}
                    className="ml-1 hover:bg-blue-200 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {roleFilter !== 'all' && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  <span>Role: {roleFilter}</span>
                  <button
                    onClick={() => setRoleFilter('all')}
                    className="ml-1 hover:bg-blue-200 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {statusFilter !== 'all' && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  <span>Status: {statusFilter}</span>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="ml-1 hover:bg-blue-200 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results count */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {filteredUsers.length > 0 ? (
                <>
                  Showing {filteredUsers.length} of {users.length} users
                  {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
                    <span className="text-blue-600 ml-1">(filtered)</span>
                  )}
                </>
              ) : (
                'No users found'
              )}
            </div>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user._id} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{user.fullname}</h3>
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.active)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.active ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => console.log('Ban user:', user._id)}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Ban User
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => console.log('Activate user:', user._id)}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
