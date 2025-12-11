import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableSelect from '@/components/ui/searchable-select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pagination } from '@/components/common/Pagination';
import { t } from '@/constants/translations';
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
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { industryEnum } from '@/lib/schemas';
import { toast } from 'sonner';
import { getAllCompaniesForAdmin, getSystemStats, getCompanyStats, approveCompany, rejectCompany } from '@/services/companyService';

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
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, verified: 0 });
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isConfirmingReapproval, setIsConfirmingReapproval] = useState(false);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, industryFilter, sortOption]);

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
              email: item.company.contactInfo?.email || item.recruiterInfo?.email || 'N/A',
              phone: item.company.contactInfo?.phone || 'N/A',
              website: item.company.website,
              industry: item.company.industry,
              size: item.company.size,
              founded: 'N/A',
              revenue: 'N/A',
              status: item.company.status,
              verified: item.company.verified,
              rejectionReason: item.company.rejectReason,
              location: {
                street: typeof item.company.address === 'string' ? item.company.address : (item.company.address?.street || 'N/A'),
                city: item.company.location?.province || item.company.address?.city || 'N/A',
                state: item.company.location?.district || item.company.address?.state || 'N/A',
                zipCode: 'N/A',
                country: 'Vietnam',
              },
              jobPostings: item.activeJobs || 0,
              totalApplications: item.totalApplications || 0,
              documents: [
                { type: 'business_registration', status: 'approved', url: item.company.businessRegistrationUrl },
                { type: 'tax_id', status: 'approved', url: '#' }
              ],
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
        console.log('📊 Fetching initial company stats...');
        const statsResponse = await getCompanyStats();
        console.log('📊 Initial stats response:', statsResponse.data);
        if (statsResponse && statsResponse.data?.success) {
          const companyStats = statsResponse.data.data;
          console.log('✅ Initial stats loaded:', companyStats);
          setStats({
            total: companyStats?.total ?? 0,
            pending: companyStats?.pending ?? 0,
            approved: companyStats?.approved ?? 0,
            rejected: companyStats?.rejected ?? 0,
            verified: companyStats?.verified ?? 0,
          });
        }
      } catch (error) {
        console.error("❌ Failed to fetch stats:", error);
        toast.error("Could not load statistics.");
      }
    };

    fetchCompanies();
    fetchStats();
  }, [searchTerm, statusFilter, industryFilter, sortOption, currentPage]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: t('companies.statusPending') },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: t('companies.statusApproved') },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: t('companies.statusRejected') }
    };

    const style = statusStyles[status] || statusStyles.pending;
    const Icon = style.icon;

    return (
      <Badge className={`${style.bg} ${style.text} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span className="capitalize">{style.label}</span>
      </Badge>
    );
  };

  // Filter companies
  const filteredCompanies = companies;

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle company approval/rejection
  const handleCompanyAction = async (companyId, action, reason = null) => {
    try {
      let res;
      if (action === 'approved') {
        res = await approveCompany(companyId);
      } else if (action === 'rejected') {
        res = await rejectCompany(companyId, reason);
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

      // Refresh stats after action
      try {
        console.log('🔄 Refreshing company stats after action...');
        const statsResponse = await getCompanyStats();
        console.log('📊 Stats response:', statsResponse.data);
        if (statsResponse && statsResponse.data?.success) {
          const companyStats = statsResponse.data.data;
          console.log('✅ Updated stats:', companyStats);
          setStats({
            total: companyStats?.total ?? 0,
            pending: companyStats?.pending ?? 0,
            approved: companyStats?.approved ?? 0,
            rejected: companyStats?.rejected ?? 0,
            verified: companyStats?.verified ?? 0,
          });
        }
      } catch (error) {
        console.error("❌ Failed to refresh stats:", error);
      }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('companies.title')}</h1>
          <p className="text-gray-600">{t('companies.description')}</p>
        </div>
      </div>

      {/* Stats Overview - Colorful Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg rounded-2xl">
          <CardContent className="p-5 text-center">
            <div className="flex justify-center mb-2">
              <Building2 className="w-8 h-8 text-white/90" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
            <div className="text-sm text-white/80 font-medium">{t('companies.totalCompanies')}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 border-0 shadow-lg rounded-2xl">
          <CardContent className="p-5 text-center">
            <div className="flex justify-center mb-2">
              <Clock className="w-8 h-8 text-white/90" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.pending}</div>
            <div className="text-sm text-white/80 font-medium">{t('companies.pendingReview')}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-lg rounded-2xl">
          <CardContent className="p-5 text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle className="w-8 h-8 text-white/90" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.approved}</div>
            <div className="text-sm text-white/80 font-medium">{t('companies.approved')}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 shadow-lg rounded-2xl">
          <CardContent className="p-5 text-center">
            <div className="flex justify-center mb-2">
              <XCircle className="w-8 h-8 text-white/90" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.rejected}</div>
            <div className="text-sm text-white/80 font-medium">{t('companies.rejected')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>{t('companies.advancedFilters')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Input
                placeholder={t('companies.searchPlaceholder')}
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
                <SelectValue placeholder={t('companies.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('companies.allStatuses')}</SelectItem>
                <SelectItem value="pending">{t('companies.statusPending')}</SelectItem>
                <SelectItem value="approved">{t('companies.statusApproved')}</SelectItem>
                <SelectItem value="rejected">{t('companies.statusRejected')}</SelectItem>
              </SelectContent>
            </Select>
            <SearchableSelect
              options={[
                { value: 'all', label: t('companies.allIndustries') },
                ...industryEnum.options.map(industry => ({ value: industry, label: industry }))
              ]}
              value={industryFilter}
              onChange={setIndustryFilter}
              placeholder={t('companies.filterByIndustry')}
              searchPlaceholder="Tìm lĩnh vực..."
            />
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder={t('users.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt_desc">{t('companies.newest')}</SelectItem>
                <SelectItem value="createdAt_asc">{t('companies.oldest')}</SelectItem>
                <SelectItem value="name_asc">{t('companies.nameAZ')}</SelectItem>
                <SelectItem value="name_desc">{t('companies.nameZA')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <Card>
        <CardHeader>
          <CardDescription>
            {t('companies.applicationsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
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
                          {getStatusBadge(company.status)}
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
                            <span>{company.jobPostings} việc làm đang tuyển</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span>{company.totalApplications} đơn ứng tuyển</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/companies/${company.id}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {t('companies.viewCompanyPage')}
                      </Button>

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
                          {t('common.reject')}
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
                          {company.status === 'rejected' ? t('companies.reconsider') : t('common.approve')}
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

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Trang {currentPage} trên {totalPages}
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rejection Reason Dialog */}
      <Dialog open={isRejecting} onOpenChange={setIsRejecting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.reject')} {t('companies.title')}</DialogTitle>
            <DialogDescription>
              {t('companies.rejectionReason')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder={t('companies.enterRejectionReason')}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejecting(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleCompanyAction(selectedCompany.id, 'rejected', rejectionReason)}
              disabled={!rejectionReason.trim()}
            >
              {t('common.reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Re-approval Confirmation Dialog */}
      <Dialog open={isConfirmingReapproval} onOpenChange={setIsConfirmingReapproval}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('companies.confirmReapproval')}</DialogTitle>
            <DialogDescription>
              {t('companies.reapprovalMessage')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmingReapproval(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                handleCompanyAction(selectedCompany.id, 'approved');
                setIsConfirmingReapproval(false);
                setSelectedCompany(null);
              }}
            >
              {t('companies.reapprove')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}