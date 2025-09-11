import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Check, 
  X, 
  Search, 
  Building2, 
  Globe, 
  Users, 
  Calendar,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Star,
  Clock,
  FileText,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { industryEnum } from '@/lib/schemas';
import { toast } from 'sonner';
import { getAllCompaniesForAdmin, getSystemStats, approveCompany, rejectCompany, getCompanyProfile } from '@/services/companyService';

export function EnhancedCompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('createdAt_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [detailedCompany, setDetailedCompany] = useState(null);
  const [bulkSelection, setBulkSelection] = useState(new Set());
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, verified: 0 });
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isConfirmingReapproval, setIsConfirmingReapproval] = useState(false);
  
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const params = {
          page: currentPage,
          limit: 10,
          sort: sortOption,
        };
        if (searchTerm) params.search = searchTerm;
        if (statusFilter !== 'all') params.status = statusFilter;
        if (industryFilter !== 'all') params.industry = industryFilter;
        
        const companyResponse = await getAllCompaniesForAdmin(params);
        if (companyResponse && companyResponse.data && companyResponse.data.success) {
          const { data, meta } = companyResponse.data;
          const transformedData = data
            .filter(item => item.company && item.company.name)
            .map(item => ({
            id: item._id,
            name: item.company.name,
            description: item.company.about,
            logo: item.company.logo,
            email: item.company.contactInfo.email,
            phone: item.company.contactInfo.phone,
            website: item.company.website,
            industry: item.company.industry,
            size: item.company.size,
            founded: 'N/A', // Not in API response
            revenue: 'N/A', // Not in API response
            status: item.company.status,
            verified: item.company.verified,
            rejectionReason: item.company.rejectReason,
            location: {
              street: item.company.address.street || 'N/A',
              city: item.company.address.city || 'N/A',
              state: item.company.address.state || 'N/A',
              zipCode: item.company.address.zipCode || 'N/A',
              country: item.company.address.country || 'N/A',
            },
            rating: 4.5, // Placeholder
            reviewCount: 120, // Placeholder
            jobPostings: 15, // Placeholder
            totalApplications: 2500, // Placeholder
            hiringRate: 65, // Placeholder
            responseTime: '2 days', // Placeholder
            documents: [ // Placeholder
              { type: 'business_registration', status: 'approved', url: item.company.businessRegistrationUrl },
              { type: 'tax_id', status: 'approved', url: '#' }
            ],
            tags: ['Tech', 'Innovative', 'Fast-paced'], // Placeholder
          }));
          setCompanies(transformedData);
          setTotalPages(meta.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        toast.error("Could not load company data.");
      }
    };

    const fetchStats = async () => {
      try {
        const statsResponse = await getSystemStats();
        if (statsResponse && statsResponse.data?.success) {
          const companyStats = statsResponse.data.data.companies;
          setStats({
            total: companyStats?.total ?? 0,
            pending: companyStats?.pending ?? 0,
            // NOTE: The new /admin/stats endpoint does not provide 'approved' or 'rejected' counts for companies.
            approved: 0,
            rejected: 0,
            verified: companyStats?.verified ?? 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        toast.error("Could not load statistics.");
      }
    };

    fetchCompanies();
    fetchStats();
  }, [searchTerm, statusFilter, industryFilter, sortOption, currentPage]);

  // Get status badge styling
  const getStatusBadge = (status, verified) => {
    const statusStyles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };
    
    const style = statusStyles[status] || statusStyles.pending;
    const Icon = style.icon;
    
    return (
      <div className="flex items-center space-x-2">
        <Badge className={`${style.bg} ${style.text} flex items-center space-x-1`}>
          <Icon className="w-3 h-3" />
          <span className="capitalize">{status.replace('_', ' ')}</span>
        </Badge>
        {verified && (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>
    );
  };

  // Filter companies
  const filteredCompanies = companies;

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  // Handle company approval/rejection
  const handleCompanyAction = async (companyId, action, reason = null) => {
    try {
      let res;
      if (action === 'approved') {
        res=await approveCompany(companyId);
      } else if (action === 'rejected') {
        res=await rejectCompany(companyId, reason);
      }

      setCompanies(prev => prev.map(company =>
        company.id === companyId
          ? {
              ...company,
              status: action,
              verified: action === 'approved',
              rejectionReason: action === 'rejected' ? reason : null
            }
          : company
      ));
      const actionText = action === 'approved' ? 'approved' : 'rejected';
      toast.success(res.data?.message || `Company ${actionText} successfully.`);
    } catch (error) {
      toast.error(`Failed to ${action} company.`);
      console.error(`Failed to ${action} company:`, error);
    }
    if (action === 'rejected') {
      setIsRejecting(false);
      setSelectedCompany(null);
      setRejectionReason('');
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    const updatedCompanies = companies.map(company => 
      bulkSelection.has(company.id)
        ? { ...company, status: action, verified: action === 'approved' }
        : company
    );
    setCompanies(updatedCompanies);
    setBulkSelection(new Set());
    toast.success(`${bulkSelection.size} companies ${action} successfully`);
  };

  // Toggle bulk selection
  const toggleBulkSelection = (companyId) => {
    const newSelection = new Set(bulkSelection);
    if (newSelection.has(companyId)) {
      newSelection.delete(companyId);
    } else {
      newSelection.add(companyId);
    }
    setBulkSelection(newSelection);
  };

  const handleViewDetails = async (company) => {
    setSelectedCompany(company);
    try {
      const res = await getCompanyProfile(company.id);
      if (res.data?.success) {
        setDetailedCompany(res.data.data);
      } else {
        toast.error("Failed to load company details.");
      }
    } catch (error) {
      toast.error("Failed to load company details.");
      console.error("Failed to fetch company details:", error);
    }
  };

  // Company Detail Modal Component
  const CompanyDetailModal = ({ company, detailedData, onClose }) => (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Building2 className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <span className="text-xl font-semibold">{company.name}</span>
            {getStatusBadge(company.status, company.verified)}
          </div>
        </DialogTitle>
      </DialogHeader>

      {detailedData ? (
        <div className="space-y-6">
          {/* Recruiter Info */}
          <div>
            <h3 className="font-semibold mb-3">Recruiter Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Fullname:</strong> {detailedData.recruiterInfo.fullname}</p>
              <p><strong>Email:</strong> {detailedData.recruiterInfo.email}</p>
              <p><strong>User Created At:</strong> {new Date(detailedData.recruiterInfo.userCreatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          {/* Company Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Company Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Industry:</strong> {detailedData.company.industry}</p>
                <p><strong>Size:</strong> {detailedData.company.size}</p>
                <p><strong>Tax Code:</strong> {detailedData.company.taxCode}</p>
                <p><strong>Website:</strong> <a href={detailedData.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{detailedData.company.website}</a></p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact & Location</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {detailedData.company.contactInfo.email}</p>
                <p><strong>Phone:</strong> {detailedData.company.contactInfo.phone}</p>
                <p><strong>Address:</strong> {`${detailedData.company.location.ward || ''}, ${detailedData.company.location.province || ''}`}</p>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-3">Job Stats</h3>
              <p>Total Jobs: {detailedData.jobStats.totalJobs}</p>
              <p>Recruiting: {detailedData.jobStats.recruitingJobs}</p>
              <p>Pending: {detailedData.jobStats.pendingJobs}</p>
              <p>Expired: {detailedData.jobStats.expiredJobs}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Application Stats</h3>
              <p>Total: {detailedData.applicationStats.total}</p>
              <p>Pending: {detailedData.applicationStats.pending}</p>
              <p>Accepted: {detailedData.applicationStats.accepted}</p>
              <p>Rejected: {detailedData.applicationStats.rejected}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Recharge Stats</h3>
              <p>Total Paid: {detailedData.rechargeStats.totalAmountPaid}</p>
              <p>Total Coins: {detailedData.rechargeStats.totalCoinsRecharged}</p>
              <p>Count: {detailedData.rechargeStats.rechargeCount}</p>
              <p>Last Recharge: {detailedData.rechargeStats.lastRechargeDate ? new Date(detailedData.rechargeStats.lastRechargeDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
           {/* Document Status */}
          <div>
            <h3 className="font-semibold mb-3">Document Verification</h3>
            <a href={detailedData.company.businessRegistrationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Business Registration</a>
          </div>
        </div>
      ) : (
        <p>Loading details...</p>
      )}

      <DialogFooter className="space-x-2">
        {company.status === 'pending' && (
            <Button
              variant="outline"
              onClick={() => {
                setIsRejecting(true);
                setSelectedCompany(company);
              }}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
        )}
        {(company.status === 'pending' || company.status === 'rejected') && (
            <Button
              onClick={() => {
                if (company.status === 'rejected') {
                  setIsConfirmingReapproval(true);
                } else {
                  handleCompanyAction(company.id, 'approved');
                  onClose();
                }
              }}
              className={company.status === 'rejected' ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
            >
              <Check className="w-4 h-4 mr-2" />
              {company.status === 'rejected' ? 'Xem xét lại' : 'Approve'}
            </Button>
        )}
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Management</h1>
          <p className="text-gray-600">Review, verify, and manage company registrations with advanced tools</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {bulkSelection.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{bulkSelection.size} selected</span>
              <Button size="sm" onClick={() => handleBulkAction('approved')} className="bg-green-600 hover:bg-green-700">
                Bulk Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('rejected')}>
                Bulk Reject
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Companies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
            <div className="text-sm text-gray-600">Verified</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Advanced Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Input
                placeholder="Search by name, email, etc..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pr-10"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industryEnum.options.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt_desc">Newest</SelectItem>
                <SelectItem value="createdAt_asc">Oldest</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <Card>
        <CardHeader>
          <CardTitle>Company Applications</CardTitle>
          <CardDescription>
            {companies.length} companies found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        className="mt-2"
                        checked={bulkSelection.has(company.id)}
                        onChange={() => toggleBulkSelection(company.id)}
                      />
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Building2 className="w-8 h-8 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{company.name}</h3>
                          {getStatusBadge(company.status, company.verified)}
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{company.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{company.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{company.location.city}, {company.location.state}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>{company.size}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{company.industry}</span>
                          </div>
                        </div>

                        {/* Performance indicators */}
                        <div className="flex items-center space-x-6 mt-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span>{company.jobPostings} jobs</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{company.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{company.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(company)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        {selectedCompany && selectedCompany.id === company.id && (
                          <CompanyDetailModal
                            company={selectedCompany}
                            detailedData={detailedCompany}
                            onClose={() => {
                              setSelectedCompany(null);
                              setDetailedCompany(null);
                            }}
                          />
                        )}
                      </Dialog>
                      
                      {company.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsRejecting(true);
                              setSelectedCompany(company);
                            }}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                      )}
                      {(company.status === 'pending' || company.status === 'rejected') && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedCompany(company);
                              if (company.status === 'rejected') {
                                setIsConfirmingReapproval(true);
                              } else {
                                handleCompanyAction(company.id, 'approved');
                              }
                            }}
                            className={company.status === 'rejected' ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            {company.status === 'rejected' ? 'Xem xét lại' : 'Approve'}
                          </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No companies match your current filters.</p>
            </div>
          )}
        </CardContent>
        <div className="flex justify-center items-center space-x-2 p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
      </Card>

      {/* Rejection Reason Dialog */}
      <Dialog open={isRejecting} onOpenChange={setIsRejecting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Company Registration</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this company. This will be sent to the recruiter.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="e.g., Invalid tax code, missing documentation..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejecting(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleCompanyAction(selectedCompany.id, 'rejected', rejectionReason)}
              disabled={!rejectionReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Re-approval Confirmation Dialog */}
      <Dialog open={isConfirmingReapproval} onOpenChange={setIsConfirmingReapproval}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận phê duyệt lại</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn phê duyệt lại công ty "{selectedCompany?.name}" không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmingReapproval(false)}>
              Hủy
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                handleCompanyAction(selectedCompany.id, 'approved');
                setIsConfirmingReapproval(false);
                setSelectedCompany(null);
              }}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}