import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, User, Clock } from 'lucide-react';

interface UserStatsOverviewProps {
  stats: {
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
    recentUsers: number;
  };
  loading?: boolean;
}

export function UserStatsOverview({ stats, loading = false }: UserStatsOverviewProps) {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'All registered users',
      color: 'text-blue-600'
    },
    {
      title: 'Admin Users', 
      value: stats.adminUsers,
      icon: UserCheck,
      description: 'Users with admin privileges',
      color: 'text-green-600'
    },
    {
      title: 'Regular Users',
      value: stats.regularUsers, 
      icon: User,
      description: 'Standard user accounts',
      color: 'text-purple-600'
    },
    {
      title: 'Recent Users',
      value: stats.recentUsers,
      icon: Clock,
      description: 'Joined in last 7 days',
      color: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted animate-pulse rounded" />
              </CardTitle>
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-1" />
              <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>        );
      })}
    </div>
  );
}

export default UserStatsOverview;
