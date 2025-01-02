import { Clock, LogIn, LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ApiRuleResponse } from './view-chalet-types';
import { API_URL } from '@/config';
import { Separator } from '@/components/ui/separator';

const ChaletRules = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rules'],
    queryFn: async () => {
      const response = await axios.get<ApiRuleResponse>(`${API_URL}/v1/rules/all-rules`);
      return response.data.rules;
    },
  });

  const getIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'arrival time':
        return <Clock className="w-5 h-5 text-gray-600" />;
      case 'check in':
        return <LogIn className="w-5 h-5 text-gray-600" />;
      case 'check out':
        return <LogOut className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (isLoading) return <div>Loading rules...</div>;
  if (error) return <div>Error loading rules</div>;
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-6">
      {data.map((rule, index) => (
        <div key={rule.id}>
          <div className="flex items-start gap-4">
            <div className="mt-1">{getIcon(rule.title)}</div>
            <div>
              <h3 className="font-medium text-base">{rule.title}</h3>
              <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">{rule.description}</p>
            </div>
          </div>

          {index < data.length - 1 && <Separator className="mt-6" />}
        </div>
      ))}
    </div>
  );
};

export default ChaletRules;
