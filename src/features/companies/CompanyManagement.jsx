import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { getAllCompaniesForAdmin, updateCompanyVerification } from '@/services/companyService';
import { CompanyListSkeleton } from '@/components/common/CompanyListSkeleton';
import { Pagination } from '@/components/common/Pagination';
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
  Phone
} from 'lucide-react';

export function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  // Fetch companies from API
  const fetchCompanies = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        page,
        limit: meta.limit,
      };

      if (searchTerm) queryParams.search = searchTerm;

      const response = await getAllCompaniesForAdmin(queryParams);
      setCompanies(response.data.data || []);
      setMeta(response.data.meta || meta);
    } catch (error) {
      setError(error.response?.data?.message || 'Không thể tải danh sách công ty');
      toast.error(error.response?.data?.message || 'Không thể tải danh sách công ty');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, meta.limit]);

  // Load companies on component mount and when filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCompanies(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    fetchCompanies(meta.currentPage);
  }, [meta.currentPage, fetchCompanies]);


  const handleVerificationChange = useCallback(async (companyId, verified) => {
    try {
      setLoading(true);
      await updateCompanyVerification(companyId, verified);
      
      // Update local state
      setCompanies(prev => prev.map(company => 
        company._id === companyId 
          ? { ...company, verified }
          : company
      ));
      
      toast.success(verified ? 'Đã xác thực công ty' : 'Đã bỏ xác thực công ty');
    } catch (error) {
      toast.error(error.message || 'Không thể cập nhật trạng thái xác thực');
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatusBadge = (verified) => {
    return verified ? (
      <Badge className="bg-green-100 text-green-800">Đã xác thực</Badge>
    ) : (
      <Badge variant="outline">Chưa xác thực</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Công ty</h1>
          <p className="text-gray-600">Xem xét và quản lý việc đăng ký công ty</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh mục Công ty</CardTitle>
          <CardDescription>
            Quản lý việc phê duyệt công ty và xem thông tin công ty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm công ty theo tên, email hoặc ngành nghề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <CompanyListSkeleton />
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">{error}</div>
              <Button onClick={() => fetchCompanies()} variant="outline">
                Thử lại
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map((company) => (
                <Card key={company._id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {company.logo ? (
                            <img 
                              src={company.logo} 
                              alt={company.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-8 h-8 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold">{company.name}</h3>
                            {getStatusBadge(company.verified)}
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{company.about}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{company.contactInfo?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{company.contactInfo?.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>{company.size || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Building2 className="w-4 h-4" />
                              <span>{company.industry || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {[
                                  company.address?.street,
                                  company.address?.city,
                                  company.address?.country
                                ].filter(Boolean).join(', ') || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>Đăng ký {new Date(company.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                          {company.website && (
                            <div className="mt-2">
                              <a 
                                href={company.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Xem Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {company.verified ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerificationChange(company._id, false)}
                            disabled={loading}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Bỏ xác thực
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleVerificationChange(company._id, true)}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={loading}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Xác thực
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && companies.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy công ty nào phù hợp với tìm kiếm của bạn.</p>
            </div>
          )}
          <div className="mt-6">
            <Pagination
              currentPage={meta.currentPage}
              totalPages={meta.totalPages}
              onPageChange={(page) => setMeta(prev => ({ ...prev, currentPage: page }))}
              loading={loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
